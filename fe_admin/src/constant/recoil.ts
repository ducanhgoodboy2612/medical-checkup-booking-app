import { atom } from 'recoil';
import dayjs from 'dayjs';
export const cartState = atom({
  key: 'cartState',
  default: [],
});

export const searchTermState = atom({
  key: 'searchTermState',
  default: '',
});

export const minPriceState = atom({
  key: 'minPriceState',
  default: 0,
});

export const maxPriceState = atom({
  key: 'maxPriceState',
  default: 1000000,
});

interface SearchParams {
  startDate: string;
  endDate: string;
  phone: string;
}

export const searchParamsState = atom<SearchParams>({
  key: 'searchParamsState',
  default: {
    startDate: dayjs().toISOString(),
    endDate: dayjs().toISOString(),
    phone: '0000'
  }
});