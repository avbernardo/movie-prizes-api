import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Movie } from '../entities/movie.entity';

@Injectable()
export class MoviesInitService implements OnApplicationBootstrap {
  constructor(
    @InjectRepository(Movie)
    private movieRepository: Repository<Movie>,
  ) {}

  async onApplicationBootstrap() {
    const count = await this.movieRepository.count();

    if (!count) {
      console.log('Initializing movies data...');
    }
  }
}
