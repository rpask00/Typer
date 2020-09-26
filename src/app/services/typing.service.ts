import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFireDatabase } from '@angular/fire/database';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { take } from 'rxjs/operators';
import { Fetch_Data, Stats } from '../models/user-model';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class TypingService {

  private stuckmode: boolean = true;
  private stats = new BehaviorSubject<Stats>({
    averageSpeed: 0,
    lastSpeed: 0,
    averageErrors: 0,
    lastErrors: 0,
    samples: 0,
  })

  private fetch_data: Fetch_Data = {
    keyset: {
      E: 1,
      N: 1,
      I: 1,
      T: 1,
      R: 1,
      L: 1,
      S: 1,
    },
    currentkey: 'E',
    words_count: 12,
  }

  constructor(
    private afDB: AngularFireDatabase,
    private afAuth: AngularFireAuth,
    private authSV: AuthService,
  ) {
    this.afAuth.user.pipe(take(1)).subscribe(user => {
      this.afDB.object('users/' + user.uid + '/stats').valueChanges().pipe(take(1)).subscribe((stats: Stats) => this.stats.next(stats))
    })
  }

  switchmode(mode: boolean) {
    this.stuckmode = mode
  }

  getmode() {
    return this.stuckmode
  }

  getstats$(): Observable<Stats> {
    return this.stats.asObservable()
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
    this.stats.pipe(take(1)).subscribe(stats => {
      let avgSpeed = (stats.samples * stats.averageSpeed + speed) / ++stats.samples
      let avgErrors = (stats.samples * stats.averageErrors + mistakes) / stats.samples

      stats.averageSpeed = avgSpeed
      stats.averageErrors = avgErrors

      stats.lastSpeed = speed
      stats.lastErrors = mistakes

      this.authSV.updateStats(stats)
      this.stats.next(stats)
    })
  }

}

