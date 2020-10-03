import { Injectable, OnInit } from '@angular/core';
import { Observable, forkJoin, BehaviorSubject } from 'rxjs';
import { first, take } from 'rxjs/operators';
import * as io from 'socket.io-client';
import { Player } from '../models/player';

@Injectable({
  providedIn: 'root'
})
export class WebsocketsService {
  private socekt: any;
  readonly url: string = 'http://127.0.0.1:3000'
  private sockets = new BehaviorSubject<Player[]>([])
  me$: Observable<Player>
  me: Player

  constructor() {
    this.socekt = io(this.url)
    this.listen('players-share').subscribe((players: Player[]) => this.sockets.next(players))
    this.me$ = this.listen('me') as Observable<Player>
    this.me$.pipe(first()).subscribe(me => this.me = me)
  }

  listen(eventName: string) {
    return new Observable(subscriber => {
      this.socekt.on(eventName, data => {
        subscriber.next(data)
      })
    })
  }

  async emit(eventName: string, data?: any) {
    this.socekt.emit(eventName, data);
  }


  get sockets$() {
    return this.sockets.asObservable()
  }



}
