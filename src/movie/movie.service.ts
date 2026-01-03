import { Injectable } from '@nestjs/common';

@Injectable()
export class MovieService {
  findAll() {
    return `This action returns all movie`;
  }
}
