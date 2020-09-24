import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})

export class WordsSupplyService {

  constructor() { }

  async getWords(count, letter, keyset) {
    let res = await fetch("http://127.0.0.1:3000/words/" + count + '/' + letter + '/' + keyset)
    let json = await res.json()

    return JSON.parse(json)
  }
}
