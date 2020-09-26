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
  keyset$: Observable<string[]>
  allkeys_set: string[] = 'ENITRLSAUODYCHGMPBKVWFZXQJ'.split('')
  currentkey$: Observable<string>

  constructor(
    private typingSV: TypingService
  ) { }

  ngOnInit(): void {
    this.stats$ = this.typingSV.getstats$()
    this.keyset$ = this.typingSV.gte_keyset$()
    // .pipe(map(keyset => {
    //   keyset.split('').forEach(key => this.allkeys_set.shift())
    //   return keyset.split('')
    // }))
    this.currentkey$ = this.typingSV.get_currentkey$()
  }

}
