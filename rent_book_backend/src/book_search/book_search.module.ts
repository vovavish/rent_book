import { Module } from '@nestjs/common';
import { BookSearchController } from './book_search.controller';
import { BookSearchService } from './book_search.service';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  controllers: [BookSearchController],
  providers: [BookSearchService, PrismaService],
})
export class BookSearchModule {}
