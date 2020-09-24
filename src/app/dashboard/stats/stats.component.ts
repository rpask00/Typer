import { Component, OnInit } from '@angular/core';
import { TypingService } from 'src/app/services/typing.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'stats',
  templateUrl: './stats.component.html',
  styleUrls: ['./stats.component.scss']
})
export class StatsComponent implements OnInit {

  speed$: Observable<number>
  mistakes$: Observable<number>
  keyset$: Observable<string[]>

  constructor(
    private typingSV: TypingService
  ) { }

  ngOnInit(): void {
    this.speed$ = this.typingSV.getspeed$()
    this.mistakes$ = this.typingSV.getmistakes$()
    this.keyset$ = this.typingSV.gte_keyset$().pipe(map(keyset => keyset.split('')))
  }

}
