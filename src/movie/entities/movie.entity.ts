import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Movie {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column()
  title: string;

  @Column()
  studios: string;

  @Column()
  producers: string;

  @Column()
  year: number;

  @Column()
  winner: boolean;
}
