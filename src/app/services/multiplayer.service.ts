import { Injectable } from '@angular/core';
import { User } from 'firebase';
import { Observable } from 'rxjs';
import { Player } from '../models/player';
import { WebsocketsService } from './websockets.service';

@Injectable({
  providedIn: 'root'
})
export class MultiplayerService {

  constructor(
    private socketSV: WebsocketsService
  ) { }

  createPlayer(user: User) {
    this.socketSV.emit('creating-connection', user)
  }

  get players(): Observable<Player[]> {
    return this.socketSV.sockets$
  }

  get me$() {
    return this.socketSV.me$
  }

}
