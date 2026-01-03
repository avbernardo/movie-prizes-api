import { Test, TestingModule } from '@nestjs/testing';
import { MoviesInitService } from './movies-init.service';

describe('MoviesInitService', () => {
  let service: MoviesInitService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MoviesInitService],
    }).compile();

    service = module.get<MoviesInitService>(MoviesInitService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
