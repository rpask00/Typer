import { Injectable } from '@angular/core';
import { Fetch_Data, Stats } from '../models/user-model';

@Injectable({
  providedIn: 'root'
})

export class WordsSupplyService {

  constructor() { }

  default_fd: Fetch_Data = {
    keyset: {
      A: [0, 1, 1],
      B: [0, 1, 1],
      C: [0, 1, 1],
      D: [0, 1, 1],
      E: [1, 1, 1],
      F: [0, 1, 1],
      G: [0, 1, 1],
      H: [0, 1, 1],
      I: [1, 1, 1],
      J: [0, 1, 1],
      K: [0, 1, 1],
      L: [1, 1, 1],
      M: [0, 1, 1],
      N: [1, 1, 1],
      O: [0, 1, 1],
      P: [0, 1, 1],
      Q: [0, 1, 1],
      R: [1, 1, 1],
      S: [1, 1, 1],
      T: [1, 1, 1],
      U: [0, 1, 1],
      V: [0, 1, 1],
      W: [0, 1, 1],
      X: [0, 1, 1],
      Y: [0, 1, 1],
      Z: [0, 1, 1],
    },
    currentkey: 'E',
    words_count: 15
  }

  default_stats: Stats = {
    averageSpeed: 0,
    lastSpeed: 0,
    averageErrors: 0,
    lastErrors: 0,
    samples: 0,
  }

  order: string[] = 'ENITRLSAUODYCHGMPBKVWFZXQJ '.split('')

  async getWords(count, letter, keyset): Promise<string[]> {
    let res = await fetch("http://127.0.0.1:3000/words/" + count + '/' + letter + '/' + keyset)
    let json = await res.json()

    return JSON.parse(json)
  }

  async getallWords(count): Promise<string[]> {
    let res = await fetch("http://127.0.0.1:3000/allwords/" + count)
    let json = await res.json()

    return JSON.parse(json)
  }

  get_next_key(key) {
    let nxt_key = this.order[this.order.indexOf(key) + 1]
    return nxt_key == ' ' ? '' : nxt_key
  }
}
