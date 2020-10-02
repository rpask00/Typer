import { Injectable } from '@angular/core';
import { User } from 'firebase';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { first, take } from 'rxjs/operators';
import { Player } from '../models/player';
import { TypingService } from './typing.service';
import { WebsocketsService } from './websockets.service';

@Injectable({
  providedIn: 'root'
})
export class MultiplayerService {

  game = new BehaviorSubject<string>('')
  gameSub: Subscription
  invitation = new BehaviorSubject<Player | null>(null)
  gamelock = new BehaviorSubject<boolean>(true)
  gameInfo = null
  sample_words = new BehaviorSubject<string[]>([])
  sample_words_in_invitation: string[]

  constructor(
    private socketSV: WebsocketsService,
    private typingSv: TypingService,
  ) {
    this.socketSV.listen('invitation').subscribe((data: { from: Player, sample_words: string[] }) => {
      this.invitation.next(data.from)
      this.sample_words_in_invitation = data.sample_words
    })
    this.socketSV.listen('game-begin').pipe(first()).subscribe(data => {
      this.gameInfo = data
      this.game.next(' ')
      this.sample_words.next(this.sample_words_in_invitation)

      this.gamelock.next(false)
      this.invitation.next(null)

      this.gameSub = this.socketSV.listen('server-type').subscribe((key: string) => {
        this.game.next(key)
      })
    })
  }

  async createPlayer(user: User) {
    this.sample_words.next(await this.typingSv.get_sample_words(15, true))
    this.socketSV.emit('creating-connection', user)
  }

  invite(player: Player) {
    debugger
    this.socketSV.emit('invite', {
      from: this.socketSV.me,
      to: player,
      sample_words: this.sample_words
    })
  }

  accept() {
    this.invitation.pipe(take(1)).subscribe(player => {
      this.socketSV.emit('accept', {
        from: player,
        to: this.socketSV.me
      })
    })
    this.invitation.next(null)
  }


  type(key: string) {
    this.gameInfo.key = key
    this.socketSV.emit('client-type', this.gameInfo)
  }

  reject() {
    this.invitation.next(null)
  }

  get players(): Observable<Player[]> {
    return this.socketSV.sockets$
  }

  get me$() {
    return this.socketSV.me$
  }

  get game$() {
    return this.game.asObservable()
  }

  get lock$() {
    return this.gamelock.asObservable()
  }

  get invitation$() {
    return this.invitation.asObservable()
  }

}
