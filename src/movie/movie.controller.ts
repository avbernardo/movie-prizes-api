import { Controller, Get, HttpCode, HttpStatus } from '@nestjs/common';
import { MovieService } from './movie.service';
import { PrizeIntervalResult } from './types/prize-interval.type';

@Controller('movie')
export class MovieController {
  constructor(private readonly movieService: MovieService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  async findAll() {
    return await this.movieService.findAll();
  }

  @Get('prize-intervals')
  @HttpCode(HttpStatus.OK)
  async findPrizeIntervals(): Promise<PrizeIntervalResult> {
    return this.movieService.findPrizeIntervals();
  }
}
