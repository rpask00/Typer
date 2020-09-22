import { Component, OnInit } from '@angular/core';
import { TypingService } from '../services/typing.service';

@Component({
  selector: 'nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss']
})
export class NavComponent implements OnInit {

  constructor(
    private typingSv: TypingService
  ) { }

  ngOnInit(): void { }

  switchmode(e: any) {
    this.typingSv.switchmode(e.target.checked)
  }

}
