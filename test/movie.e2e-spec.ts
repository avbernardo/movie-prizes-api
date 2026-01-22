import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import * as csv from 'csv-parser';
import * as fs from 'fs';
import * as request from 'supertest';
import { Repository } from 'typeorm';
import { AppModule } from '../src/app.module';
import { Movie } from '../src/movie/entities/movie.entity';

describe('Movie API (e2e)', () => {
  let app: INestApplication;
  let movieRepository: Repository<Movie>;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    movieRepository = moduleFixture.get<Repository<Movie>>(
      getRepositoryToken(Movie),
    );

    let attempts = 0;
    const maxAttempts = 10;

    while (attempts < maxAttempts) {
      const count = await movieRepository.count();
      if (count > 0) {
        break;
      }
      await new Promise((resolve) => setTimeout(resolve, 500));
      attempts++;
    }
  });

  afterAll(async () => {
    await app.close();
  });

  describe('GET /movie', () => {
    it('should return all movies', async () => {
      const response = await request(app.getHttpServer())
        .get('/movie')
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);
    });

    it('should return movies with correct structure', async () => {
      const response = await request(app.getHttpServer())
        .get('/movie')
        .expect(200);

      const movie = response.body[0];
      expect(movie).toHaveProperty('id');
      expect(movie).toHaveProperty('year');
      expect(movie).toHaveProperty('title');
      expect(movie).toHaveProperty('studios');
      expect(movie).toHaveProperty('producers');
      expect(movie).toHaveProperty('winner');
    });
  });

  describe('Data Validation', () => {
    it('should have loaded movies from CSV', async () => {
      const count = await movieRepository.count();
      expect(count).toBeGreaterThan(0);
    });
    it('should match CSV data with database data', async () => {
      const csvMovies = await readCSV();
      const dataBaseMovies = await movieRepository.find();

      expect(dataBaseMovies.length).toBe(csvMovies.length);

      for (const [index, movie] of dataBaseMovies.entries()) {
        const csvMovie = csvMovies[index];

        expect(movie).toBeDefined();
        expect(movie.studios).toBe(csvMovie.studios);
        expect(movie.producers).toBe(csvMovie.producers);
        expect(movie.winner).toBe(csvMovie.winner);
      }
    });
  });

  describe('GET /movie/prize-intervals', () => {
    it('should return status code 200 with min and max intervals', async () => {
      const response = await request(app.getHttpServer())
        .get('/movie/prize-intervals')
        .expect(200);

      expect(response.body).toHaveProperty('min');
      expect(response.body).toHaveProperty('max');
      expect(Array.isArray(response.body.min)).toBe(true);
      expect(Array.isArray(response.body.max)).toBe(true);
    });
  });

  /**
   * @description Reads movies from the CSV file.
   * @returns {Promise<Movie[]>} - A promise that resolves to an array of Movie objects.
   */
  function readCSV(): Promise<Movie[]> {
    return new Promise((resolve, reject) => {
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
          resolve(movies);
        })
        .on('error', (error) => {
          reject(error);
        });
    });
  }
});
