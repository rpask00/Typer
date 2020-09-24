import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth'
import { User } from '../models/user-model';
import { Observable, of } from 'rxjs';
import { auth } from 'firebase';
import { AngularFireDatabase } from '@angular/fire/database';
import { map, switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  user$: Observable<User>

  constructor(
    private afAuth: AngularFireAuth,
    private adDatabase: AngularFireDatabase,
  ) {
    this.user$ = this.afAuth.user.pipe(switchMap(user => {
      if (user) return this.adDatabase.object('users/' + user.uid).valueChanges() as Observable<User>

      return of(null) as Observable<null>
    }))
  }

  async logIn() {
    let provider = new auth.GoogleAuthProvider()
    let credentials = await this.afAuth.signInWithPopup(provider)

    this.setUser(credentials)
  }

  logOut() {
    this.afAuth.signOut().then(() => console.log('logged out'))
  }

  setUser(credentials: auth.UserCredential) {
    this.adDatabase.object('users/' + credentials.user.uid).set({
      name: credentials.user.displayName,
      photoUrl: credentials.user.photoURL,
      email: credentials.user.email,
      averageSpeed: 0,
      lastSpeed: 0,
      averageErrors: 0,
      lastErrors: 0,
      stuckMode: true,
    })
  }
}
