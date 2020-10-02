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

  @Input('user') user: Observable<User> | Observable<null>

  constructor(
    private authSV: AuthService,
  ) { }

  ngOnInit(): void {
  }

  logIn() {
    this.authSV.logIn()
  }

  logOut() {
    this.authSV.logOut()
  }

}
