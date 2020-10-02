import { Component, Input, OnInit } from '@angular/core';
import { Player } from 'src/app/models/player';
import { MultiplayerService } from 'src/app/services/multiplayer.service';

@Component({
  selector: 'invitation',
  templateUrl: './invitation.component.html',
  styleUrls: ['./invitation.component.scss']
})
export class InvitationComponent implements OnInit {

  @Input('invitaion') invitaion: Player

  constructor(
    private multiplayerSv: MultiplayerService
  ) { }

  ngOnInit(): void {
  }

  accept() {
    this.multiplayerSv.accept()
  }

  reject() {
    this.multiplayerSv.reject()
  }

}
