import { Component, OnInit } from '@angular/core';
import { User } from 'firebase';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { TypingService } from '../services/typing.service';
@Component({
  selector: 'nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss']
})
export class NavComponent implements OnInit {

  user$: Observable<User> | Observable<null>

  constructor(
    private typingSv: TypingService,
    private authSV: AuthService,
  ) { }

  ngOnInit(): void {
    this.user$ = this.authSV.user$
  }

  switchmode(e: any) {
    this.typingSv.switch_mode(!e.target.checked)
  }



}
