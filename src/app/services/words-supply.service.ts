import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})

export class WordsSupplyService {

  constructor() { }
  default_keyset = {
    A: 0,
    B: 0,
    C: 0,
    D: 0,
    E: 1,
    F: 0,
    G: 0,
    H: 0,
    I: 1,
    J: 0,
    K: 0,
    L: 1,
    M: 0,
    N: 1,
    O: 0,
    P: 0,
    Q: 0,
    R: 1,
    S: 1,
    T: 1,
    U: 0,
    V: 0,
    W: 0,
    X: 0,
    Y: 0,
    Z: 0,
  }

  async getWords(count, letter, keyset) {
    let res = await fetch("http://127.0.0.1:3000/words/" + count + '/' + letter + '/' + keyset)
    let json = await res.json()

    return JSON.parse(json)
  }
}
