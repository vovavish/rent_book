import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  UseGuards,
  ParseIntPipe,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { RentBookService } from './rent_book.service';
import { CreateBookDto } from './dto/create_book.dto';
import { UpdateBookDto } from './dto/update_book.dto';
import { CreateRentalDto } from './dto/create_rental.dto';
import { GetCurrentUserId, Public } from 'src/common/decorators';
import { AtGuard } from 'src/common/guards';
import { FilesInterceptor } from '@nestjs/platform-express';
import { RateOwnerAndBookDto } from './dto/rate_owner_and_book_dto';
import { ComplainBookDto } from './dto/complain_book.dto';

@Controller('rent_books')
export class RentBookController {
  constructor(private readonly bookService: RentBookService) {}

  // Создание объявления о сдаче книги
  @UseGuards(AtGuard)
  @Post('create')
  @UseInterceptors(FilesInterceptor('coverImages', 10))
  async createBook(
    @GetCurrentUserId() userId: number,
    @Body('data') data: string,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    console.log('files', files);
    const createBookDto: CreateBookDto = JSON.parse(data);
    return this.bookService.createBook(userId, createBookDto, files);
  }

  // Получение всех книг пользователя
  @UseGuards(AtGuard)
  @Get('my_books')
  async getUserBooks(@GetCurrentUserId() userId: number) {
    return this.bookService.getUserBooks(userId);
  }

  @Public()
  @Get('books')
  async getBooks() {
    return this.bookService.getBooks();
  }

  @Public()
  @Get('books/news')
  async getBooksNews() {
    return this.bookService.getBooksNews();
  }

  @Public()
  @Get('books/recommended')
  async getBooksRecommended() {
    return this.bookService.getBooksRecommended();
  }

  // Получение книги по ID
  @UseGuards(AtGuard)
  @Get('get/:bookId')
  async getBookById(
    @GetCurrentUserId() userId: number,
    @Param('bookId', ParseIntPipe) bookId: number,
  ) {
    return this.bookService.getBookById(userId, bookId);
  }

  @Public()
  @Get('getToRental/:bookId')
  async getToRentalBookById(@Param('bookId', ParseIntPipe) bookId: number) {
    return this.bookService.getToRentalBookById(bookId);
  }

  @UseGuards(AtGuard)
  @Get('getRentalById/:rentalId')
  async getRentalById(@Param('rentalId', ParseIntPipe) rentalId: number) {
    return this.bookService.getRentalById(rentalId);
  }

  // Обновление объявления
  @UseGuards(AtGuard)
  @Patch('update/:bookId')
  @UseInterceptors(FilesInterceptor('coverImages', 10))
  async updateBook(
    @GetCurrentUserId() userId: number,
    @Param('bookId', ParseIntPipe) bookId: number,
    @Body('data') data: string,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    console.log('update files', files);
    console.log('data', data);
    const updateBookDto: UpdateBookDto = JSON.parse(data);
    return this.bookService.updateBook(userId, bookId, updateBookDto, files);
  }

  // Удаление объявления
  @UseGuards(AtGuard)
  @Delete('delete/:bookId')
  async deleteBook(
    @GetCurrentUserId() userId: number,
    @Param('bookId', ParseIntPipe) bookId: number,
  ) {
    return this.bookService.deleteBook(userId, bookId);
  }

  // Скрываем объявление
  @UseGuards(AtGuard)
  @Post('hide/:bookId')
  async hideUserBook(
    @GetCurrentUserId() userId: number,
    @Param('bookId', ParseIntPipe) bookId: number,
  ) {
    return this.bookService.hideUserBook(userId, bookId);
  }

  // Скрываем объявление
  @UseGuards(AtGuard)
  @Post('open/:bookId')
  async openUserBook(
    @GetCurrentUserId() userId: number,
    @Param('bookId', ParseIntPipe) bookId: number,
  ) {
    return this.bookService.openUserBook(userId, bookId);
  }

  // Запрос аренды книги
  @UseGuards(AtGuard)
  @Post('request_rental')
  async requestRental(
    @GetCurrentUserId() renterId: number,
    @Body() createRentalDto: CreateRentalDto,
  ) {
    return this.bookService.requestRental(renterId, createRentalDto);
  }

  @UseGuards(AtGuard)
  @Post('approve_rental/:rentalId')
  async approveRental(
    @GetCurrentUserId() ownerId: number,
    @Param('rentalId', ParseIntPipe) rentalId: number,
  ) {
    return this.bookService.approveRental(ownerId, rentalId);
  }

  @UseGuards(AtGuard)
  @Post('reject_rental/:rentalId')
  async rejectRental(
    @GetCurrentUserId() ownerId: number,
    @Param('rentalId', ParseIntPipe) rentalId: number,
  ) {
    return this.bookService.rejectRental(ownerId, rentalId);
  }

  @UseGuards(AtGuard)
  @Post('reject_rental_from_approval/:rentalId')
  async rejectRentalFromApproval(
    @GetCurrentUserId() ownerId: number,
    @Param('rentalId', ParseIntPipe) rentalId: number,
  ) {
    return this.bookService.rejectRentalFromApproval(ownerId, rentalId);
  }

  @UseGuards(AtGuard)
  @Post('reject_rental_from_pending/:rentalId')
  async rejectRentalFromPending(
    @GetCurrentUserId() ownerId: number,
    @Param('rentalId', ParseIntPipe) rentalId: number,
  ) {
    return this.bookService.rejectRentalFromPending(ownerId, rentalId);
  }

  @UseGuards(AtGuard)
  @Post('reject_rental_from_approved_by_owner/:rentalId')
  async rejectRentalFromApprovedByOwner(
    @GetCurrentUserId() ownerId: number,
    @Param('rentalId', ParseIntPipe) rentalId: number,
  ) {
    return this.bookService.rejectRentalFromApprovedByOwner(ownerId, rentalId);
  }

  @UseGuards(AtGuard)
  @Post('confirm_payment/:rentalId')
  async confirmPayment(
    @GetCurrentUserId() renterId: number,
    @Param('rentalId', ParseIntPipe) rentalId: number,
  ) {
    return this.bookService.confirmPayment(renterId, rentalId);
  }

  @UseGuards(AtGuard)
  @Post('cancel_owner_rental/:rentalId')
  async canvelOwnerRental(
    @GetCurrentUserId() ownerId: number,
    @Param('rentalId', ParseIntPipe) rentalId: number,
  ) {
    return this.bookService.cancelOwnerRental(ownerId, rentalId);
  }

  @UseGuards(AtGuard)
  @Post('cancel_reader_rental/:rentalId')
  async cancelReaderRental(
    @GetCurrentUserId() renterId: number,
    @Param('rentalId', ParseIntPipe) rentalId: number,
  ) {
    return this.bookService.cancelReaderRental(renterId, rentalId);
  }

  @UseGuards(AtGuard)
  @Post('confirm_giving/:rentalId')
  async confirmGivingBook(
    @GetCurrentUserId() ownerId: number,
    @Param('rentalId', ParseIntPipe) rentalId: number,
  ) {
    return this.bookService.confirmGivingBook(ownerId, rentalId);
  }

  @UseGuards(AtGuard)
  @Post('confirm_receiving/:rentalId')
  async confirmReceivingBook(
    @GetCurrentUserId() renterId: number,
    @Param('rentalId', ParseIntPipe) rentalId: number,
  ) {
    return this.bookService.confirmReceivingBook(renterId, rentalId);
  }

  @UseGuards(AtGuard)
  @Post('approve_return/:rentalId')
  async approveReturn(
    @GetCurrentUserId() ownerId: number,
    @Param('rentalId', ParseIntPipe) rentalId: number,
  ) {
    return this.bookService.approveReturn(ownerId, rentalId);
  }

  @UseGuards(AtGuard)
  @Get('my_rentals')
  async getUserRentals(@GetCurrentUserId() userId: number) {
    return this.bookService.getUserRentals(userId);
  }

  @UseGuards(AtGuard)
  @Get('my_rentals_in_out')
  async getUserRentalsInOut(@GetCurrentUserId() userId: number) {
    return this.bookService.getUserRentalsInOut(userId);
  }

  @UseGuards(AtGuard)
  @Get('favorites')
  async getUserFavorites(@GetCurrentUserId() userId: number) {
    return this.bookService.getUserFavorites(userId);
  }

  @UseGuards(AtGuard)
  @Post('favorites/:bookId')
  async addToFavorites(
    @GetCurrentUserId() userId: number,
    @Param('bookId', ParseIntPipe) bookId: number,
  ) {
    return this.bookService.addToFavorites(userId, bookId);
  }

  @UseGuards(AtGuard)
  @Delete('favorites/:bookId')
  async removeFromFavorites(
    @GetCurrentUserId() userId: number,
    @Param('bookId', ParseIntPipe) bookId: number,
  ) {
    return this.bookService.removeFromFavorites(userId, bookId);
  }

  @UseGuards(AtGuard)
  @Post('rate_renter/:rentalId')
  async rateRenter(
    @GetCurrentUserId() ownerId: number,
    @Param('rentalId', ParseIntPipe) rentalId: number,
    @Body('rating') rating: number,
  ) {
    return this.bookService.rateRenter(ownerId, rentalId, rating);
  }

  @UseGuards(AtGuard)
  @Post('rate_owner_and_book/:rentalId')
  async rateOwnerAndBook(
    @GetCurrentUserId() renterId: number,
    @Param('rentalId', ParseIntPipe) rentalId: number,
    @Body() rateDto: RateOwnerAndBookDto,
  ) {
    return this.bookService.rateOwnerAndBook(
      renterId,
      rentalId,
      rateDto.ownerRating,
      rateDto.bookRating,
      rateDto.reviewContent,
    );
  }

  @Public()
  @Get('reviews/:bookId')
  async getBookReviews(@Param('bookId', ParseIntPipe) bookId: number) {
    return this.bookService.getBookReviews(bookId);
  }

  @UseGuards(AtGuard)
  @Post('book_complain/:bookId')
  async bookComplain(
    @GetCurrentUserId() userId: number,
    @Param('bookId', ParseIntPipe) bookId: number,
    @Body() complainDto: ComplainBookDto,
  ) {
    return this.bookService.bookComplain(userId, bookId, complainDto);
  }
}
