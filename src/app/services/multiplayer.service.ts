import { Injectable } from '@angular/core';
import { User } from 'firebase';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { first } from 'rxjs/operators';
import { Player } from '../models/player';
import { WebsocketsService } from './websockets.service';

@Injectable({
  providedIn: 'root'
})
export class MultiplayerService {

  game$ = new BehaviorSubject<string>('')
  gameSub: Subscription
  invitation = new BehaviorSubject<Player | null>(null)

  constructor(
    private socketSV: WebsocketsService
  ) {
    this.socketSV.listen('invitation').subscribe((player: Player) => this.invitation.next(player))
  }

  createPlayer(user: User) {
    this.socketSV.emit('creating-connection', user)
  }

  invite(player: Player) {
    this.socketSV.emit('invite', {
      from: this.socketSV.me,
      to: player
    })

    this.socketSV.listen('game-begin').pipe(first()).subscribe(() => {
      this.gameSub = this.socketSV.listen('type').subscribe((type: string) => this.game$.next(type))
      this.invitation.next(null)
    })

  }

  get players(): Observable<Player[]> {
    return this.socketSV.sockets$
  }

  get me$() {
    return this.socketSV.me$
  }

  get invitation$() {
    return this.invitation.asObservable()
  }

}
