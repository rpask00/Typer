import { Injectable } from '@angular/core';
import { User } from 'firebase';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { take } from 'rxjs/operators';
import { Player } from '../models/player';
import { TypingService } from './typing.service';
import { WebsocketsService } from './websockets.service';

@Injectable({
  providedIn: 'root'
})
export class MultiplayerService {

  game = new BehaviorSubject<string>('')
  private gameSub: Subscription

  private invitation = new BehaviorSubject<Player | null>(null)
  gamelock = new BehaviorSubject<boolean>(true)

  private gameInfo = null
  private sample_words = new BehaviorSubject<string[]>([])
  private sample_words_in_invitation: string[]

  onEndGame$: Observable<string>

  constructor(
    private socketSV: WebsocketsService,
    private typingSv: TypingService,
  ) {

    this.socketSV.listen('invitation').subscribe((data: { from: Player, sample_words: string[] }) => {
      this.invitation.next(data.from)
      this.sample_words_in_invitation = data.sample_words
    })

    this.socketSV.listen('game-begin').subscribe(data => {
      console.log('begina')
      this.gameInfo = data
      this.game.next(' ')
      if (this.sample_words_in_invitation)
        this.sample_words.next(this.sample_words_in_invitation)

      this.gamelock.next(false)
      this.invitation.next(null)

      this.gameSub = this.socketSV.listen('server-type').subscribe((key: string) => {
        this.game.next(key)
      })
    })

    this.onEndGame$ = socketSV.listen('onEndGame') as Observable<string>
    this.onEndGame$.subscribe(res => {
      this.gameSub.unsubscribe()
      this.gamelock.next(true)
      setTimeout(() => this.game.next(''), (5000))
    })
  }

  async createPlayer(user: User) {
    this.sample_words.next(await this.typingSv.get_sample_words(15, true))
    this.socketSV.emit('creating-connection', user)
  }

  disconnect() {
    this.socketSV.me$.pipe(take(1)).subscribe(me => this.socketSV.emit('disconnect', me))
  }

  invite(player: Player) {
    this.sample_words.pipe(take(1)).subscribe(sample_words => {
      this.socketSV.emit('invite', {
        from: this.socketSV.me,
        to: player,
        sample_words: sample_words
      })
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

  endGame() {
    this.socketSV.emit('endGame', this.gameInfo)

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

  get sample_words$() {
    return this.sample_words.asObservable()
  }


}
