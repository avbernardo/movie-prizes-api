# Movie Prizes API

RESTful API to query nominated and winning movies from the Golden Raspberry Awards Worst Movie category.

## Technologies

- Node.js
- NestJS
- TypeScript
- TypeORM
- Sql.js
- Jest
- Supertest
- Csv-parser

## Prerequisites

- Node.js 18+
- pnpm

## Install dependencies

pnpm install

## Running the Project

### Development mode

pnpm start:dev

### Build

pnpm build

### Production mode

pnpm start:prod

## Running Tests

### Integration tests

pnpm test:e2e

### With coverage

pnpm test:e2e --coverage

## API Endpoints

Base URL: `http://localhost:3000`

### List all movies

```http
GET http://localhost:3000/movie
```

**Example:**

```bash
curl http://localhost:3000/movie
```

### Get prize intervals

```http
GET http://localhost:3000/movie/prize-intervals
```

**Example:**

```bash
curl http://localhost:3000/movie/prize-intervals
```

**Response example:**

```json
{
  "min": [
    {
      "producer": "Joel Silver",
      "interval": 1,
      "previousWin": 1990,
      "followingWin": 1991
    }
  ],
  "max": [
    {
      "producer": "Matthew Vaughn",
      "interval": 13,
      "previousWin": 2002,
      "followingWin": 2015
    }
  ]
}
```
