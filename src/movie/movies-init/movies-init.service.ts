import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as csv from 'csv-parser';
import * as fs from 'fs';
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
      await this.initMovies();
      console.log('Movies data initialization complete.');
    }
  }

  /**
   * @description Initialize movies from CSV file into the database if not already present.
   */
  private async initMovies(): Promise<void> {
    const moviesDataFilePath = './src/data/Movielist.csv';
    const movies: Movie[] = [];
    fs.createReadStream(moviesDataFilePath)
      .pipe(csv({ separator: ';' }))
      .on('data', async (row) => {
        movies.push({
          title: row['title'],
          producers: row['producers'],
          studios: row['studios'],
          winner: row['winner'] === 'yes' ? true : false,
          year: parseInt(row['year'], 10),
        });
      })
      .on('end', async () => {
        for (const movie of movies) {
          await this.movieRepository.save(movie);
        }
      });
  }
}
