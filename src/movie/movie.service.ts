import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Movie } from './entities/movie.entity';
import { Repository } from 'typeorm';
import {
  PrizeInterval,
  PrizeIntervalResult,
  ProducerPrizes,
} from './types/prize-interval.type';

@Injectable()
export class MovieService {
  constructor(
    @InjectRepository(Movie)
    private movieRepository: Repository<Movie>,
  ) {}

  /**
   * @description Find all movies in the database.
   */
  findAll() {
    return this.movieRepository.find();
  }

  /**
   * @description Find min and max prize intervals for producers with multiple wins.
   * @returns {Promise<PrizeIntervalResult>} The min and max prize intervals.
   */
  async findPrizeIntervals(): Promise<PrizeIntervalResult> {
    const winnersMovies = await this.movieRepository.find({
      where: { winner: true },
    });

    const producerPrizes = this.groupProducersByYears(winnersMovies);

    const intervals = this.calculateIntervals(producerPrizes);

    if (intervals.length === 0) {
      return { min: [], max: [] };
    }

    return this.findMinMaxIntervals(intervals);
  }

  /**
   * @description Group producers by their winning years.
   * @param winnersMovies List of winning movies.
   * @returns {ProducerPrizes[]} List of producers with their winning years.
   */
  private groupProducersByYears(winnersMovies: Movie[]): ProducerPrizes[] {
    const producerPrizes: ProducerPrizes[] = [];

    for (const winnerMovie of winnersMovies) {
      const producers = this.parseProducers(winnerMovie.producers);

      for (const producer of producers) {
        const producerWin = producerPrizes.find(
          (pw) => pw.producer === producer,
        );
        if (producerWin) {
          producerWin.years.push(winnerMovie.year);
        } else {
          producerPrizes.push({ producer, years: [winnerMovie.year] });
        }
      }
    }

    return producerPrizes;
  }

  /**
   * @description Parse producers string into an array of producer names.
   * @param producersStr Producers string from the movie record containing "and" and ",".
   * @returns An array of producer names.
   */
  private parseProducers(producersStr: string): string[] {
    return producersStr
      .split(/,|\s(?:and)\s?/)
      .map((p) => p.trim())
      .filter((p) => p.length > 0);
  }

  /**
   * @description Calculate prize intervals for producers.
   * @param producerPrizes List of producers with their winning years.
   * @returns {PrizeInterval[]} List of prize intervals.
   */
  private calculateIntervals(
    producerPrizes: ProducerPrizes[],
  ): PrizeInterval[] {
    const intervals: PrizeInterval[] = [];

    for (const producer of producerPrizes) {
      if (producer.years.length < 2) continue;

      producer.years.sort((a, b) => a - b);

      for (let i = 0; i < producer.years.length - 1; i++) {
        intervals.push({
          producer: producer.producer,
          interval: producer.years[i + 1] - producer.years[i],
          previousWin: producer.years[i],
          followingWin: producer.years[i + 1],
        });
      }
    }

    return intervals;
  }

  /**
   * @description Find the minimum and maximum prize intervals for producers.
   * @param intervals List of prize intervals.
   * @returns {PrizeIntervalResult} The min and max prize intervals.
   */
  private findMinMaxIntervals(intervals: PrizeInterval[]): PrizeIntervalResult {
    intervals.sort((a, b) => a.interval - b.interval);

    const minInterval = intervals[0].interval;
    const maxInterval = intervals[intervals.length - 1].interval;
    return {
      min: intervals.filter((i) => i.interval === minInterval),
      max: intervals.filter((i) => i.interval === maxInterval),
    };
  }
}
