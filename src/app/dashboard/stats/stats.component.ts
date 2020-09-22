import { Component, OnInit } from '@angular/core';
import { TypingService } from 'src/app/services/typing.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'stats',
  templateUrl: './stats.component.html',
  styleUrls: ['./stats.component.scss']
})
export class StatsComponent implements OnInit {

  speed$: Observable<number>
  mistakes$: Observable<number>

  constructor(
    private typingSV: TypingService
  ) { }

  ngOnInit(): void {
    this.speed$ = this.typingSV.getspeed$()
    this.mistakes$ = this.typingSV.getmistakes$()
  }

}
