import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Player } from 'src/app/models/player';
import { MultiplayerService } from 'src/app/services/multiplayer.service';
import { map, switchMap } from 'rxjs/operators';

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
  ) { }


  ngOnInit(): void {
    this.me$ = this.multiplayerSv.me$
    this.players$ = this.multiplayerSv.me$.pipe(switchMap(me => {
      return this.multiplayerSv.players.pipe(map(players => players.filter(p => p.socket != me.socket)))
    }))
  }
  
  invite(player: Player) {
    this.multiplayerSv.invite(player)
  }

}
