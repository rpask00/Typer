import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TypingService {

  private stuckmode: boolean = true;
  private speed = new BehaviorSubject<number>(0)
  private mistakes = new BehaviorSubject<number>(0)

  constructor() { }

  switchmode(mode: boolean) {
    this.stuckmode = mode
  }

  getmode() {
    return this.stuckmode
  }

  getspeed$() {
    return this.speed.asObservable()
  }

  getmistakes$() {
    return this.mistakes.asObservable()
  }

  update_speed_and_mistakes(speed: number, mistakes: number) {
    this.speed.next(speed)
    this.mistakes.next(mistakes)
  }

}
