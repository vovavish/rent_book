import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { BookSearchDto } from './dto/book_search.dto';

@Injectable()
export class BookSearchService {
  constructor(private prisma: PrismaService) {}

  async searchBooks(dto: BookSearchDto) {
    const {
      query,
      type,
      author,
      category,
      publisher,
      publishingCity,
      publishedYear,
      printRun,
      minPages,
      maxPages,
      condition,
      ageRestriction,
      periodicity,
      materialConstruction,
      format,
      minPrice,
      maxPrice,
      edition,
      language,
      minDeposit,
      maxDeposit,
      minDaysToRent,
      maxDaysToRent,
      address,
      isCashPayment,
    } = dto;

    console.log(category);

    return this.prisma.book.findMany({
      where: {
        AND: [
          { availabilityStatus: 'ACTIVE' },
          query
            ? {
                OR: [
                  { title: { contains: query, mode: 'insensitive' } },
                  { frequencyTitle: { contains: query, mode: 'insensitive' } },
                  { description: { contains: query, mode: 'insensitive' } },
                  { author: { contains: query, mode: 'insensitive' } },
                  { publisher: { contains: query, mode: 'insensitive' } },
                  { publishingCity: { contains: query, mode: 'insensitive' } },
                ],
              }
            : {},
          type ? { type } : {},
          author ? { author: { contains: author, mode: 'insensitive' } } : {},
          category && category.length > 0
            ? { category: { hasSome: category } }
            : {},
          publisher
            ? { publisher: { contains: publisher, mode: 'insensitive' } }
            : {},
          publishingCity
            ? {
                publishingCity: {
                  contains: publishingCity,
                  mode: 'insensitive',
                },
              }
            : {},
          publishedYear ? { publishedYear } : {},
          printRun ? { printRun } : {},
          minPages || maxPages
            ? {
                pages: {
                  ...(minPages !== undefined ? { gte: minPages } : {}),
                  ...(maxPages !== undefined ? { lte: maxPages } : {}),
                },
              }
            : {},
          condition ? { condition } : {},
          ageRestriction ? { ageRestriction } : {},
          periodicity ? { periodicity } : {},
          materialConstruction ? { materialConstruction } : {},
          format ? { format } : {},
          edition ? { edition } : {},
          language
            ? { language: { contains: language, mode: 'insensitive' } }
            : {},
          minPrice || maxPrice
            ? {
                price: {
                  ...(minPrice !== undefined ? { gte: minPrice } : {}),
                  ...(maxPrice !== undefined ? { lte: maxPrice } : {}),
                },
              }
            : {},
          minDeposit || maxDeposit
            ? {
                deposit: {
                  ...(minDeposit !== undefined ? { gte: minDeposit } : {}),
                  ...(maxDeposit !== undefined ? { lte: maxDeposit } : {}),
                },
              }
            : {},
          minDaysToRent || maxDaysToRent
            ? {
                minDaysToRent: {
                  ...(minDaysToRent !== undefined
                    ? { gte: minDaysToRent }
                    : {}),
                  ...(maxDaysToRent !== undefined
                    ? { lte: maxDaysToRent }
                    : {}),
                },
              }
            : {},
          address
            ? { address: { contains: address, mode: 'insensitive' } }
            : {},
          isCashPayment !== undefined ? { isCashPayment } : {},
        ],
      },
      orderBy: {
        title: 'asc',
      },
    });
  }
}
