import { AfterContentInit, Injectable, OnInit } from '@angular/core';
import { BehaviorSubject, forkJoin, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TypingService {

  private stuckmode: boolean = true;
  private speed = new BehaviorSubject<number>(0)
  private mistakes = new BehaviorSubject<number>(0)

  private fetch_data = {
    keyset: 'ENITRLS',
    currentkey: 'E',
    words_count: 12,
  }

  constructor() { }


  switchmode(mode: boolean) {
    this.stuckmode = mode
  }

  getmode() {
    return this.stuckmode
  }

  getspeed$() {
    of(45).subscribe(v => this.speed.next(v))

    return this.speed.asObservable()
  }

  getmistakes$() {
    of(12).subscribe(v => this.mistakes.next(v))

    return this.mistakes.asObservable()
  }

  get_fetch_data$() {
    return of(this.fetch_data)
  }

  gte_keyset$() {
    return of(this.fetch_data.keyset)
  }

  get_currentkey$() {
    return of(this.fetch_data.currentkey)
  }

  update_speed_and_mistakes(speed: number, mistakes: number) {
    this.speed.next(speed)
    this.mistakes.next(mistakes)
  }

}

