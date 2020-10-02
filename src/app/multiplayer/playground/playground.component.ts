import { Component, OnInit } from '@angular/core';
import { User } from 'firebase';
import { Observable, of } from 'rxjs';
import { Player } from 'src/app/models/player';
import { AuthService } from 'src/app/services/auth.service';
import { MultiplayerService } from 'src/app/services/multiplayer.service';
import { TypingService } from 'src/app/services/typing.service';

@Component({
  selector: 'playground',
  templateUrl: './playground.component.html',
  styleUrls: ['./playground.component.scss']
})
export class PlaygroundComponent implements OnInit {
  width: number = 40;
  sample_words: string[]
  sample: string[]
  fnt_size: number = 25
  active: number = 0
  lock: boolean = true
  isLoggedIn$: Observable<boolean>
  user$: Observable<User>
  enemy$: Observable<string>
  invitation$: Observable<Player>

  constructor(
    private typingSv: TypingService,
    private authSv: AuthService,
    private multiplayerSv: MultiplayerService
  ) { }

  async ngOnInit() {
    this.isLoggedIn$ = this.authSv.isloggedIn()
    this.enemy$ = this.multiplayerSv.game$.asObservable()
    this.user$ = this.authSv.user$
    this.invitation$ = this.multiplayerSv.invitation$
    // this.invitation$ = of({
    //   displayName: "Rafał Paśko",
    //   photoURL: "https://lh3.googleusercontent.com/a-/AOh14GhFRFNkcPfCByUPJXQbBpQEftPovCl3XaoxpCIloA",
    //   socket: 'sefessfesfssds'
    // })


    await this.initSample()

    this.user$.subscribe(user => {
      if (user)
        this.multiplayerSv.createPlayer(user)
    })

  }

  async initSample() {
    this.sample_words = await this.typingSv.get_sample_words(15, true)
    this.sample = this.sample_words.map(word => word.toLowerCase()).join('_').split('')
  }

  handleClick_me(key: string) {
    let corect_key: string = this.sample[this.active]

    if (key == ' ')
      key = '_'

    if (key == corect_key)
      this.active++

  }

  handleClick_enemy(key: string) {
  }

  logIn() {
    this.authSv.logIn()
  }
}
