import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBookDto } from './dto/create_book.dto';
import { UpdateBookDto } from './dto/update_book.dto';
import { Book, Rental, RentalStatus } from '@prisma/client';
import { CreateRentalDto } from './dto/create_rental.dto';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class RentBookService {
  constructor(private prisma: PrismaService) {}

  // Создание объявления о сдаче книги
  async createBook(
    userId: number,
    createBookDto: CreateBookDto,
    files: Express.Multer.File[],
  ): Promise<Book> {
    const baseUrl = process.env.BASE_URL || 'http://localhost:3000';
    const coverImagesUrls = files.map(
      (file) => `${baseUrl}/uploads/${file.filename}`,
    );

    return this.prisma.book.create({
      data: {
        ...createBookDto,
        userId,
        coverImagesUrls,
        availabilityStatus: createBookDto.availabilityStatus || 'ACTIVE',
      },
    });
  }

  // Обновление объявления
  async updateBook(
    userId: number,
    bookId: number,
    updateBookDto: UpdateBookDto,
  ): Promise<Book> {
    const book = await this.getBookById(userId, bookId);
    return this.prisma.book.update({
      where: { id: book.id },
      data: updateBookDto,
    });
  }

  // Получение книг пользователя
  async getUserBooks(userId: number): Promise<Book[]> {
    return this.prisma.book.findMany({
      where: { userId },
    });
  }

  // Получение книги по ID
  async getBookById(userId: number, bookId: number): Promise<Book> {
    const book = await this.prisma.book.findFirst({
      where: { id: bookId, userId },
      include: { user: true },
    });
    if (!book) {
      throw new NotFoundException(
        `Book with ID ${bookId} not found or you don't have access`,
      );
    }
    return book;
  }

  async getToRentalBookById(bookId: number): Promise<Book> {
    return await this.prisma.book.findUnique({
      where: { id: bookId },
      include: { user: true },
    });
  }

  // Удаление объявления
  async deleteBook(userId: number, bookId: number): Promise<Book> {
    const book = await this.getBookById(userId, bookId);
    return this.prisma.book.delete({
      where: { id: book.id },
    });
  }

  async hideUserBook(userId: number, bookId: number): Promise<Book> {
    const book = await this.getBookById(userId, bookId);

    if (book.availabilityStatus === 'RENTED') {
      throw new ForbiddenException(`Book is in active rental`);
    }

    return this.prisma.book.update({
      where: { id: bookId },
      data: { availabilityStatus: 'CLOSED' },
    });
  }

  async openUserBook(userId: number, bookId: number): Promise<Book> {
    const book = await this.getBookById(userId, bookId);

    if (book.availabilityStatus !== 'CLOSED') {
      throw new ForbiddenException(`Book is not closed`);
    }

    return this.prisma.book.update({
      where: { id: bookId },
      data: { availabilityStatus: 'ACTIVE' },
    });
  }

  // Запрос аренды книги (PENDING)
  async requestRental(
    renterId: number,
    createRentalDto: CreateRentalDto,
  ): Promise<Rental> {
    const { bookId, rentStartDate, rentEndDate } = createRentalDto;
    const book = await this.prisma.book.findUnique({ where: { id: bookId } });

    if (!book) throw new NotFoundException(`Book with ID ${bookId} not found`);
    if (book.availabilityStatus !== 'ACTIVE')
      throw new ForbiddenException(`Book is not available for rental`);

    // Преобразуем строки дат в объекты Date
    const startDate = new Date(rentStartDate);
    const endDate = new Date(rentEndDate);

    // Проверяем, что endDate позже startDate
    if (endDate <= startDate) {
      throw new BadRequestException('End date must be after start date');
    }

    // Вычисляем количество дней аренды
    const timeDiff = endDate.getTime() - startDate.getTime();
    const daysDiff = Math.ceil(timeDiff / (1000 * 60 * 60 * 24)); // Округляем вверх

    // Вычисляем общую стоимость
    const totalPrice = book.price * daysDiff + book.deposit;

    return this.prisma.rental.create({
      data: {
        bookId,
        renterId,
        ownerId: book.userId,
        rentStartDate: startDate,
        rentEndDate: endDate,
        status: RentalStatus.PENDING,
        price: totalPrice, // Добавляем расчетную стоимость
      },
    });
  }

  // Владелец подтверждает аренду (APPROVED_BY_OWNER)
  async approveRental(ownerId: number, rentalId: number): Promise<Rental> {
    return this.updateRentalStatus(
      ownerId,
      rentalId,
      RentalStatus.PENDING,
      RentalStatus.APPROVED_BY_OWNER,
    );
  }

  // Владелец отклоняет аренду (REJECTED)
  async rejectRental(ownerId: number, rentalId: number): Promise<Rental> {
    return this.updateRentalStatus(
      ownerId,
      rentalId,
      RentalStatus.PENDING,
      RentalStatus.REJECTED,
    );
  }

  async rejectRentalFromApproval(
    ownerId: number,
    rentalId: number,
  ): Promise<Rental> {
    return this.updateRentalStatus(
      ownerId,
      rentalId,
      RentalStatus.APPROVED_BY_OWNER,
      RentalStatus.REJECTED,
    );
  }

  // Читатель отклоняет запрос во время Pending
  async rejectRentalFromPending(
    userId: number,
    rentalId: number,
  ): Promise<Rental> {
    const rental = await this.prisma.rental.findUnique({
      where: { id: rentalId },
    });

    const currentStatus = RentalStatus.PENDING;

    if (!rental)
      throw new NotFoundException(`Rental with ID ${rentalId} not found`);
    if (rental.status !== currentStatus)
      throw new ForbiddenException(`Rental is not in the correct state`);
    if (rental.ownerId !== userId && rental.renterId !== userId)
      throw new ForbiddenException(
        `You don't have permission to update this rental`,
      );

    return this.prisma.rental.delete({
      where: { id: rentalId },
    });
  }

  // Читатель отклоняет запрос во время ApprovedByOwner, т.е. отказывается от оплаты
  async rejectRentalFromApprovedByOwner(
    userId: number,
    rentalId: number,
  ): Promise<Rental> {
    const rental = await this.prisma.rental.findUnique({
      where: { id: rentalId },
    });

    const currentStatus = RentalStatus.APPROVED_BY_OWNER;

    if (!rental)
      throw new NotFoundException(`Rental with ID ${rentalId} not found`);
    if (rental.status !== currentStatus)
      throw new ForbiddenException(`Rental is not in the correct state`);
    if (rental.ownerId !== userId && rental.renterId !== userId)
      throw new ForbiddenException(
        `You don't have permission to update this rental`,
      );

    await this.prisma.book.update({
      where: { id: rental.bookId },
      data: { availabilityStatus: 'ACTIVE' },
    });

    return this.prisma.rental.delete({
      where: { id: rentalId },
    });
  }

  // Читатель подтверждает оплату (CONFIRMED)
  async confirmPayment(renterId: number, rentalId: number): Promise<Rental> {
    return this.updateRentalStatus(
      renterId,
      rentalId,
      RentalStatus.APPROVED_BY_OWNER,
      RentalStatus.CONFIRMED,
    );
  }

  async cancelOwnerRental(ownerId: number, rentalId: number): Promise<Rental> {
    return this.updateRentalStatus(
      ownerId,
      rentalId,
      RentalStatus.CONFIRMED,
      RentalStatus.CANCELED,
    );
  }

  async cancelReaderRental(
    renterId: number,
    rentalId: number,
  ): Promise<Rental> {
    return this.updateRentalStatus(
      renterId,
      rentalId,
      RentalStatus.GIVEN_TO_READER,
      RentalStatus.CANCELED,
    );
  }

  // Владелец передает книгу (GIVEN_TO_READER)
  async confirmGivingBook(ownerId: number, rentalId: number): Promise<Rental> {
    return this.updateRentalStatus(
      ownerId,
      rentalId,
      RentalStatus.CONFIRMED,
      RentalStatus.GIVEN_TO_READER,
    );
  }

  // Читатель подтверждает получение (ACTIVE)
  async confirmReceivingBook(
    renterId: number,
    rentalId: number,
  ): Promise<Rental> {
    return this.updateRentalStatus(
      renterId,
      rentalId,
      RentalStatus.GIVEN_TO_READER,
      RentalStatus.ACTIVE,
    );
  }

  // Владелец подтверждает возврат (COMPLETED)
  async approveReturn(ownerId: number, rentalId: number): Promise<Rental> {
    return this.updateRentalStatus(
      ownerId,
      rentalId,
      RentalStatus.RETURN_APPROVAL,
      RentalStatus.COMPLETED,
    );
  }

  // Вспомогательный метод для смены статуса
  private async updateRentalStatus(
    userId: number,
    rentalId: number,
    currentStatus: RentalStatus,
    newStatus: RentalStatus,
  ): Promise<Rental> {
    const rental = await this.prisma.rental.findUnique({
      where: { id: rentalId },
    });

    if (!rental)
      throw new NotFoundException(`Rental with ID ${rentalId} not found`);
    if (rental.status !== currentStatus)
      throw new ForbiddenException(`Rental is not in the correct state`);
    if (rental.ownerId !== userId && rental.renterId !== userId)
      throw new ForbiddenException(
        `You don't have permission to update this rental`,
      );

    if (newStatus === RentalStatus.APPROVED_BY_OWNER) {
      await this.prisma.book.update({
        where: { id: rental.bookId },
        data: { availabilityStatus: 'RENTED' },
      });
    } else if (newStatus === RentalStatus.COMPLETED) {
      await this.prisma.book.update({
        where: { id: rental.bookId },
        data: { availabilityStatus: 'ACTIVE' },
      });
    } else if (newStatus === RentalStatus.REJECTED) {
      await this.prisma.book.update({
        where: { id: rental.bookId },
        data: { availabilityStatus: 'ACTIVE' },
      });
    } else if (newStatus === RentalStatus.CANCELED) {
      await this.prisma.book.update({
        where: { id: rental.bookId },
        data: { availabilityStatus: 'ACTIVE' },
      });
    }

    return this.prisma.rental.update({
      where: { id: rentalId },
      data: { status: newStatus },
    });
  }

  async getUserRentals(userId: number) {
    return this.prisma.rental.findMany({
      where: {
        OR: [
          { renterId: userId }, // Аренды, где пользователь - арендатор
        ],
      },
      include: {
        book: {
          select: {
            id: true,
            title: true,
            coverImagesUrls: true,
            author: true,
          },
        },
        renter: {
          select: {
            id: true,
            name: true,
          },
        },
        owner: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }
  async getUserRentalsInOut(userId: number) {
    return this.prisma.rental.findMany({
      where: {
        ownerId: userId, // Аренды, где пользователь - владелец
      },
      include: {
        book: {
          select: {
            id: true,
            title: true,
            coverImagesUrls: true,
            author: true,
          },
        },
        renter: {
          select: {
            id: true,
            name: true,
          },
        },
        owner: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }
  async getBooks() {
    return this.prisma.book.findMany({
      where: {
        availabilityStatus: 'ACTIVE',
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            lastname: true,
            surname: true,
            email: true,
            createdAt: true,
            updatedAt: true,
            roles: true,
          },
        },
      },
      orderBy: {
        updatedAt: 'desc',
      },
    });
  }

  @Cron(CronExpression.EVERY_HOUR) // Запускается каждый час
  async updateExpiredRentals() {
    const now = new Date();

    // Получаем аренды, срок которых истёк
    const expiredRentals = await this.prisma.rental.findMany({
      where: {
        status: 'ACTIVE',
        rentEndDate: { lte: now },
      },
    });

    if (expiredRentals.length > 0) {
      // Обновляем статус всех просроченных аренд
      await this.prisma.rental.updateMany({
        where: { id: { in: expiredRentals.map((r) => r.id) } },
        data: { status: 'RETURN_APPROVAL' },
      });
    }
  }

  async getUserFavorites(userId: number) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        favoriteBooks: true,
      },
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    return user.favoriteBooks;
  }

  async addToFavorites(userId: number, bookId: number): Promise<void> {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    const book = await this.prisma.book.findUnique({ where: { id: bookId } });

    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }
    if (!book) {
      throw new NotFoundException(`Book with ID ${bookId} not found`);
    }

    // Проверяем, не добавлена ли книга уже в избранное
    const isAlreadyFavorite = await this.prisma.user.findFirst({
      where: {
        id: userId,
        favoriteBooks: { some: { id: bookId } },
      },
    });

    if (isAlreadyFavorite) {
      throw new BadRequestException(
        `Book with ID ${bookId} is already in favorites`,
      );
    }

    await this.prisma.user.update({
      where: { id: userId },
      data: {
        favoriteBooks: {
          connect: { id: bookId },
        },
      },
    });
  }

  async removeFromFavorites(userId: number, bookId: number): Promise<void> {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    const book = await this.prisma.book.findUnique({ where: { id: bookId } });

    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }
    if (!book) {
      throw new NotFoundException(`Book with ID ${bookId} not found`);
    }

    // Проверяем, есть ли книга в избранном
    const isFavorite = await this.prisma.user.findFirst({
      where: {
        id: userId,
        favoriteBooks: { some: { id: bookId } },
      },
    });

    if (!isFavorite) {
      throw new BadRequestException(
        `Book with ID ${bookId} is not in favorites`,
      );
    }

    await this.prisma.user.update({
      where: { id: userId },
      data: {
        favoriteBooks: {
          disconnect: { id: bookId },
        },
      },
    });
  }
}
