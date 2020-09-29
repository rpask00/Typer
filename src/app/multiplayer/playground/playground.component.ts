import { Component, OnInit } from '@angular/core';
import { Observable, of } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
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
  firsttry = true
  isLoggedIn$: Observable<boolean>
  enemy$: Observable<any>

  constructor(
    private typingSv: TypingService,
    private authSv: AuthService
  ) { }

  async ngOnInit() {
    await this.initSample()
  }

  async initSample() {
    this.sample_words = await this.typingSv.get_sample_words(15, true)
    this.sample = this.sample_words.map(word => word.toLowerCase()).join('_').split('')
    this.isLoggedIn$ = this.authSv.isloggedIn()
    this.isLoggedIn$.subscribe(console.log)
    this.enemy$ = of(false)
  }

  handleClick(key: string) {

    let corect_key: string = this.sample[this.active]
    if (key == ' ')
      key = '_'

    if (key == corect_key) {
      this.active++


    } else {
      this.firsttry = false
    }
  }

  logIn() {
    this.authSv.logIn()
  }
}
