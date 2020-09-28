import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from '../../models/user-model';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'playerslist',
  templateUrl: './playerslist.component.html',
  styleUrls: ['./playerslist.component.scss']
})
export class PlayerslistComponent implements OnInit {

  user$: Observable<User> | Observable<null>

  constructor(
    private authSV: AuthService,
  ) {
    this.user$ = authSV.user$
  }


  ngOnInit(): void {
  }

}
