import { Controller, Get, Query } from '@nestjs/common';
import { BookSearchService } from './book_search.service';
import { BookSearchDto } from './dto/book_search.dto';
import { Public } from "src/common/decorators";

@Controller('book-search')
export class BookSearchController {
  constructor(private readonly bookSearchService: BookSearchService) {}

  @Get()
  @Public()
  async searchBooks(@Query() dto: BookSearchDto) {
    return this.bookSearchService.searchBooks(dto);
  }
}
