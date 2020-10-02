import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Player } from 'src/app/models/player';

@Component({
  selector: 'thumbnail',
  templateUrl: './thumbnail.component.html',
  styleUrls: ['./thumbnail.component.scss']
})
export class ThumbnailComponent implements OnInit {
  
  @Input('player') player: null | Player = null
  @Output('invitation') invitation = new EventEmitter<string>()

  constructor() { }

  ngOnInit(): void {
  }

  invite(socket: string) {
    this.invitation.emit(socket)
  }

}