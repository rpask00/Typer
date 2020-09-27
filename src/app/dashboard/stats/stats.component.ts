import { Component, OnInit } from '@angular/core';
import { TypingService } from 'src/app/services/typing.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Stats } from '../../models/user-model';

@Component({
  selector: 'stats',
  templateUrl: './stats.component.html',
  styleUrls: ['./stats.component.scss']
})
export class StatsComponent implements OnInit {


  stats$: Observable<Stats>
  keyset$: Observable<any>
  currentkey$: Observable<string>

  classes: string[] = ['notactive', 'bad', 'low', 'medium', 'good']

  constructor(
    private typingSV: TypingService
  ) { }

  ngOnInit(): void {
    this.stats$ = this.typingSV.get_stats$()
    this.keyset$ = this.typingSV.gte_keyset$().pipe(map(keyset => Object.keys(keyset).map(key => [key, keyset[key]])))
    this.currentkey$ = this.typingSV.get_current_key$()
  }

}
