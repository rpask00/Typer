import { Component, OnInit } from '@angular/core';
import { User } from 'firebase';
import { Observable, of } from 'rxjs';
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
  isLoggedIn$: Observable<boolean>
  user$: Observable<User>
  enemy$: Observable<any>
  lock: boolean = true

  constructor(
    private typingSv: TypingService,
    private authSv: AuthService,
    private multiplayerSv: MultiplayerService
  ) { }

  async ngOnInit() {
    this.isLoggedIn$ = this.authSv.isloggedIn()
    this.user$ = this.authSv.user$
    await this.initSample()

    this.user$.subscribe(user => {
      if (user)
        this.multiplayerSv.createPlayer(user)
    })

  }

  async initSample() {
    this.sample_words = await this.typingSv.get_sample_words(15, true)
    this.sample = this.sample_words.map(word => word.toLowerCase()).join('_').split('')
    this.enemy$ = of(false)
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
