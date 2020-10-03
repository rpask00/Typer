import { Component, OnInit } from '@angular/core';
import { User } from 'firebase';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Player } from 'src/app/models/player';
import { AuthService } from 'src/app/services/auth.service';
import { MultiplayerService } from 'src/app/services/multiplayer.service';

@Component({
  selector: 'playground',
  templateUrl: './playground.component.html',
  styleUrls: ['./playground.component.scss']
})
export class PlaygroundComponent implements OnInit {
  width: number = 40;
  sample_words: string[] = []
  sample: string[]
  fnt_size: number = 25
  active: number = 0
  lock: boolean = true
  isLoggedIn$: Observable<boolean>
  user$: Observable<User>
  game$: Observable<string>
  endGame$: Observable<string>
  invitation$: Observable<Player>
  opponent: Player
  resultMe = ''
  resultOpponent = ''

  constructor(
    private authSv: AuthService,
    private multiplayerSv: MultiplayerService
  ) { }

  async ngOnInit() {
    this.isLoggedIn$ = this.authSv.isloggedIn()
    this.game$ = this.multiplayerSv.game$
    this.user$ = this.authSv.user$
    this.endGame$ = this.multiplayerSv.onEndGame$

    this.invitation$ = this.multiplayerSv.invitation$.pipe(tap(player => {
      if (player) this.opponent = player
    }))

    this.user$.subscribe(user => {
      if (user)
        this.multiplayerSv.createPlayer(user)
    })

    this.multiplayerSv.sample_words$.subscribe(sample_words => {
      this.initSample(sample_words)
    })

    this.multiplayerSv.lock$.subscribe(lock => this.lock = lock)

    this.endGame$.subscribe(res => {
      this.resultMe = res == 'win' ? 'win' : 'lose'
      this.resultOpponent = res == 'win' ? 'lose' : 'win'

      setTimeout(() => {
        this.resultMe = ''
        this.resultOpponent = ''
      }, 5000);
    })

  }

  initSample(sample_words) {
    this.sample_words = sample_words
    this.sample = this.sample_words.map(word => word.toLowerCase()).join('_').split('')
  }

  type(key: string) {
    this.multiplayerSv.type(key)
  }


  logIn() {
    this.authSv.logIn()
  }
}
