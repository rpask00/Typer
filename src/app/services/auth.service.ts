import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth'
import { Stats } from '../models/user-model';
import { Observable } from 'rxjs';
import { AngularFireDatabase } from '@angular/fire/database';
import { map, take } from 'rxjs/operators';
import { WordsSupplyService } from './words-supply.service';
import { auth, User } from 'firebase';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  user$: Observable<User>

  constructor(
    private afAuth: AngularFireAuth,
    private afDatabase: AngularFireDatabase,
    private wordssupSv: WordsSupplyService
  ) {
    this.user$ = this.afAuth.user
  }

  async logIn() {
    let provider = new auth.GoogleAuthProvider()
    let credentials = await this.afAuth.signInWithPopup(provider)

    this.createUser(credentials)
  }

  isloggedIn(): Observable<boolean> {
    return this.afAuth.user.pipe(map(user => !!user))
  }

  logOut(): void {
    this.afAuth.signOut().then(() => console.log('logged out'))
  }

  createUser(credentials: auth.UserCredential): void {
    this.afDatabase.object('users/' + credentials.user.uid).valueChanges().pipe(take(1)).subscribe(user => {
      if (!user)
        this.afDatabase.object('users/' + credentials.user.uid).set({
          name: credentials.user.displayName,
          photoUrl: credentials.user.photoURL,
          email: credentials.user.email,
          stats: this.wordssupSv.default_stats,
          stuckMode: true,
          fetch_data: this.wordssupSv.default_fd
        })
    })


  }

  updateStatsInDB(stats: Stats): void {
    this.afAuth.user.pipe(take(1)).subscribe(user => {
      if (user) this.afDatabase.object('users/' + user.uid + '/stats').set(stats)
    })
  }

  updateFetchDataInDB(f_d: any): void {
    this.afAuth.user.pipe(take(1)).subscribe(user => {
      if (user) this.afDatabase.object('users/' + user.uid + '/fetch_data').set(f_d)
    })
  }

}
