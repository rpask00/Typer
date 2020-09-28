import { Component, OnInit, Input } from '@angular/core';
import { User } from 'src/app/models/user-model';
import { AuthService } from 'src/app/services/auth.service';
import { Observable } from 'rxjs';

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
    console.log(this.user)
  }

  logIn() {
    this.authSV.logIn()
  }

  logOut() {
    this.authSV.logOut()
  }

}
