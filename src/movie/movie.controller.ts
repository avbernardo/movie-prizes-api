import { Controller, Get } from '@nestjs/common';
import { MovieService } from './movie.service';
import { PrizeIntervalResult } from './types/prize-interval.type';

@Controller('movie')
export class MovieController {
  constructor(private readonly movieService: MovieService) {}

  @Get()
  async findAll() {
    return await this.movieService.findAll();
  }

  @Get('prize-intervals')
  async findPrizeIntervals(): Promise<PrizeIntervalResult> {
    return this.movieService.findPrizeIntervals();
  }
}
