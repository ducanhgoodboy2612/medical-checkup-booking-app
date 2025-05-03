import { atom } from 'recoil';
export const cartState = atom({
  key: 'cartState',
  default: [],
});

export const searchTermState = atom({
  key: 'searchTermState',
  default: '',
});