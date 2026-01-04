export type ProducerPrizes = {
  producer: string;
  years: number[];
};

export type PrizeInterval = {
  producer: string;
  interval: number;
  previousWin: number;
  followingWin: number;
};

export type PrizeIntervalResult = {
  min: PrizeInterval[];
  max: PrizeInterval[];
};
