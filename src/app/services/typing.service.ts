import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFireDatabase } from '@angular/fire/database';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { map, take, first } from 'rxjs/operators';
import { Fetch_Data, Stats } from '../models/user-model';
import { AuthService } from './auth.service';
import { WordsSupplyService } from './words-supply.service';

@Injectable({
  providedIn: 'root'
})
export class TypingService {

  private stuckmode: boolean = true;
  private stats: BehaviorSubject<Stats>
  private fetch_data: BehaviorSubject<Fetch_Data>
  constructor(
    private afDB: AngularFireDatabase,
    private afAuth: AngularFireAuth,
    private authSV: AuthService,
    private wordssupSv: WordsSupplyService
  ) { }

  switch_mode(mode: boolean): void {
    this.stuckmode = mode
  }

  get_mode = (): boolean => this.stuckmode

  async get_fetch_data$(): Promise<Observable<Fetch_Data>> {
    if (this.fetch_data)
      return this.fetch_data.asObservable()

    let user = await this.afAuth.user.pipe(take(1)).toPromise()
    let f_d: any
    if (user)
      f_d = await this.afDB.object('users/' + user.uid + '/fetch_data')
        .valueChanges()
        .pipe(take(1))
        .toPromise()
    else
      f_d = this.wordssupSv.default_fd

    this.fetch_data = new BehaviorSubject(f_d)
    return this.fetch_data.asObservable()
  }

  async get_stats$(): Promise<Observable<Stats>> {
    if (this.stats)
      return this.stats.asObservable()

    let user = await this.afAuth.user.pipe(take(1)).toPromise()
    let stats: any
    if (user)
      stats = await this.afDB.object('users/' + user.uid + '/stats')
        .valueChanges()
        .pipe(take(1))
        .toPromise()
    else
      stats = this.wordssupSv.default_fd

    this.stats = new BehaviorSubject(stats)
    return this.stats.asObservable()
  }

  async get_keyset$(): Promise<Observable<any>> {
    return (await this.get_fetch_data$()).pipe(map(fetch_data => fetch_data.keyset))
  }

  async get_current_key$(): Promise<Observable<string>> {
    return (await this.get_fetch_data$()).pipe(map(fetch_data => fetch_data.currentkey))
  }

  async get_sample_words(words_count?, currentkey?, keyset?): Promise<string[]> {
    if (words_count && currentkey && keyset)
      return await this.wordssupSv.getWords(words_count, currentkey, keyset)

    let f_d = await (await this.get_fetch_data$()).pipe(first()).toPromise()
    let filtered_keyset = Object.keys(f_d.keyset).filter(key => f_d.keyset[key][0]).join('')
    return await this.wordssupSv.getWords(f_d.words_count, f_d.currentkey, filtered_keyset)

  }

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


  update_fetch_data(keyset): void {
    this.fetch_data.pipe(take(1)).subscribe(f_d => {
      if (f_d.currentkey && keyset[f_d.currentkey][0] == 5) {
        f_d.currentkey = this.wordssupSv.get_next_key(f_d.currentkey)
        keyset[f_d.currentkey][0] = 1
      }

      f_d.keyset = keyset

      this.authSV.updateFetchDataInDB(f_d)
      this.fetch_data.next(f_d)
    })
  }

}

