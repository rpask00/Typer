import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { Observable, of } from 'rxjs';
import { Player } from 'src/app/models/player';
import { User } from 'firebase';

@Component({
  selector: 'user-thumbnail',
  templateUrl: './user-thumbnail.component.html',
  styleUrls: ['./user-thumbnail.component.scss']
})

export class UserThumbnailComponent implements OnInit {

  @Input('user') user: Observable<User> | Observable<Player>
  @Input('player') player: null | Player = null
  @Input('btn') btn: 'logout' | 'invite' = 'logout'
  @Output('invitation') invitation = new EventEmitter<string>()

  constructor(
    private authSV: AuthService,
  ) { }

  ngOnInit(): void {
    if (this.player) {
      this.user = of(this.player)
    }
  }

  logIn() {
    this.authSV.logIn()
  }

  logOut() {
    this.authSV.logOut()
  }

  invite(socket: string) {
    this.invitation.emit(socket)
  }

}
