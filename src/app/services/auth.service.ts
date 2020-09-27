import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth'
import { Stats, User } from '../models/user-model';
import { Observable, of } from 'rxjs';
import { auth } from 'firebase';
import { AngularFireDatabase } from '@angular/fire/database';
import { switchMap, take, tap } from 'rxjs/operators';
import { WordsSupplyService } from './words-supply.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  user$: Observable<User>

  constructor(
    private afAuth: AngularFireAuth,
    private adDatabase: AngularFireDatabase,
    private wordssupSv: WordsSupplyService
  ) {
    this.user$ = this.afAuth.user.pipe(switchMap(user => {
      if (user) return this.adDatabase.object('users/' + user.uid).valueChanges() as Observable<User>
      return of(null)
    }))
  }

  async logIn() {
    let provider = new auth.GoogleAuthProvider()
    let credentials = await this.afAuth.signInWithPopup(provider)

    this.createUser(credentials)
  }

  logOut(): void {
    this.afAuth.signOut().then(() => console.log('logged out'))
  }

  createUser(credentials: auth.UserCredential): void {
    this.adDatabase.object('users/' + credentials.user.uid).set({
      name: credentials.user.displayName,
      photoUrl: credentials.user.photoURL,
      email: credentials.user.email,
      stats: {
        averageSpeed: 0,
        lastSpeed: 0,
        averageErrors: 0,
        lastErrors: 0,
        samples: 0,
      },
      stuckMode: true,
      fetch_data: {
        keyset: this.wordssupSv.default_keyset,
        currentkey: 'E',
        words_count: 15,
      }
    })
  }

  updateStatsInDB(stats: Stats): void {
    this.afAuth.user.pipe(take(1)).subscribe(user => {
      if (user) this.adDatabase.object('users/' + user.uid + '/stats').set(stats)
    })
  }

}
