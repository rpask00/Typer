import { Injectable, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFireDatabase } from '@angular/fire/database';
import { BehaviorSubject, of } from 'rxjs';
import { take } from 'rxjs/operators';
import { Fetch_Data, Stats } from '../models/user-model';

@Injectable({
  providedIn: 'root'
})
export class TypingService implements OnInit {

  private stuckmode: boolean = true;
  private speed = new BehaviorSubject<number>(0)
  private mistakes = new BehaviorSubject<number>(0)

  private fetch_data: Fetch_Data = {
    keyset: 'ENITRLS',
    currentkey: 'E',
    words_count: 12,
  }

  constructor(
    private afDB: AngularFireDatabase,
    private afAuth: AngularFireAuth
  ) {

  }

  ngOnInit(): void {
    this.afAuth.user.pipe(take(1)).subscribe(user => {
      if (user) {
        this.afDB.object('users/' + user.uid + '/stats').valueChanges().pipe(take(1)).subscribe((stats: Stats) => {
          console.log(stats)
          this.mistakes.next(stats.lastErrors)
          this.speed.next(stats.lastSpeed)
        })
      } else {
        this.mistakes.next(0)
        this.speed.next(0)
      }

    })
  }

  

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

  get_fetch_data$() {
    return of(this.fetch_data)
  }

  gte_keyset$() {
    return of(this.fetch_data.keyset)
  }

  get_currentkey$() {
    return of(this.fetch_data.currentkey)
  }

  update_stats(speed: number, mistakes: number) {
    this.speed.next(speed)
    this.mistakes.next(mistakes)
  }

}

