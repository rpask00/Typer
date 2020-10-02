import { Component, Input, OnInit } from '@angular/core';
import { Player } from 'src/app/models/player';

@Component({
  selector: 'invitation',
  templateUrl: './invitation.component.html',
  styleUrls: ['./invitation.component.scss']
})
export class InvitationComponent implements OnInit {

  @Input('invitaion') invitaion: Player

  constructor() { }

  ngOnInit(): void {
  }

}
