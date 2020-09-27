import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFireDatabase } from '@angular/fire/database';
import { BehaviorSubject, Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { Fetch_Data, Stats } from '../models/user-model';
import { AuthService } from './auth.service';
import { WordsSupplyService } from './words-supply.service';

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


  private fetch_data: BehaviorSubject<Fetch_Data> = new BehaviorSubject<Fetch_Data>({
    keyset: this.wordssupSv.default_keyset,
    currentkey: 'E',
    words_count: 12,
  })

  constructor(
    private afDB: AngularFireDatabase,
    private afAuth: AngularFireAuth,
    private authSV: AuthService,
    private wordssupSv: WordsSupplyService
  ) {
    this.afAuth.user.pipe(take(1)).subscribe(user => {
      if (user) {
        this.afDB.object('users/' + user.uid + '/stats')
          .valueChanges()
          .pipe(take(1))
          .subscribe((stats: Stats) => this.stats.next(stats))

        this.afDB.object('users/' + user.uid + '/fetch_data')
          .valueChanges()
          .pipe(take(1))
          .subscribe((fetch_data: Fetch_Data) => this.fetch_data.next(fetch_data))
      }
    })
  }

  switch_mode(mode: boolean): void {
    this.stuckmode = mode
  }

  get_mode = (): boolean => this.stuckmode
  get_fetch_data$ = (): Observable<Fetch_Data> => this.fetch_data.asObservable()
  gte_keyset$ = (): Observable<any> => this.fetch_data.asObservable().pipe(map(fetch_data => fetch_data.keyset))
  get_stats$ = (): Observable<Stats> => this.stats.asObservable()
  get_current_key$ = (): Observable<string> => this.fetch_data.asObservable().pipe(map(fetch_data => fetch_data.currentkey))

  update_stats(speed: number, mistakes: number): void {
    this.stats.pipe(take(1)).subscribe(stats => {
      let avgSpeed = (stats.samples * stats.averageSpeed + speed) / ++stats.samples
      let avgErrors = (stats.samples * stats.averageErrors + mistakes) / stats.samples

      stats.averageSpeed = avgSpeed
      stats.averageErrors = avgErrors

      stats.lastSpeed = speed
      stats.lastErrors = mistakes

      this.authSV.updateStatsInDB(stats)
      this.stats.next(stats)
    })
  }

}

