import { Component, OnInit } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Player } from 'src/app/models/player';
import { MultiplayerService } from 'src/app/services/multiplayer.service';
import { map, switchMap, take, tap } from 'rxjs/operators';

@Component({
  selector: 'playerslist',
  templateUrl: './playerslist.component.html',
  styleUrls: ['./playerslist.component.scss']
})
export class PlayerslistComponent implements OnInit {

  players$: Observable<Player[]>
  me$: Observable<Player>

  constructor(
    private multiplayerSv: MultiplayerService,
  ) {
    this.me$ = this.multiplayerSv.me$
  }


  ngOnInit(): void {
    this.players$ = this.multiplayerSv.me$.pipe(switchMap(me => {
      return this.multiplayerSv.players.pipe(map(players => players.filter(player => player.socket != me.socket)))
    }))
  }

  invite(socket: string) {
    console.log(socket)
  }

}
