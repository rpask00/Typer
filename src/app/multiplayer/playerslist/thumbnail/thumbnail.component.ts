import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Player } from 'src/app/models/player';

@Component({
  selector: 'thumbnail',
  templateUrl: './thumbnail.component.html',
  styleUrls: ['./thumbnail.component.scss']
})
export class ThumbnailComponent implements OnInit {

  @Input('player') player: null | Player = null
  @Input('showBtn') showBtn: boolean = true
  @Output('invitation') invitation = new EventEmitter<Player>()

  constructor() { }

  ngOnInit(): void {
  }

  invite(player: Player) {
    this.invitation.emit(player)
  }

}