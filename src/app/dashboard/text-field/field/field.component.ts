import { Component, HostListener, Input, Output, EventEmitter, OnChanges, OnInit, OnDestroy } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { TypingService } from 'src/app/services/typing.service';

@Component({
  selector: 'field',
  templateUrl: './field.component.html',
  styleUrls: ['./field.component.scss']
})
export class FieldComponent implements OnInit, OnChanges, OnDestroy {

  @Output('stroke') stroke = new EventEmitter<string>();
  @Input('sample_words') sample_words: string[]
  @Input('width') width: number
  @Input('lock') lock: boolean = false
  @Input('fnt_size') fnt_size: number = 40
  @Input('driver') driver$: Observable<KeyboardEvent> | null = null

  driverSub: Subscription
  corrects: boolean[];
  wrongs: boolean[];
  active: number = 0;
  firsttry: boolean = true;
  rows: any[][]
  sample: string[]


  constructor(
    private typingSv: TypingService,
  ) { }

  ngOnChanges(): void {
    this.active = 0
    this.sample = this.sample_words.map(word => word.toLowerCase()).join('_').split('')
    this.rows = this.split_into_equal_rows(this.sample_words)
    this.corrects = this.sample.map(e => false)
    this.wrongs = this.sample.map(e => false)
    this.firsttry = true

    document.documentElement.style.setProperty('--playground_font_size', this.fnt_size + 'px')
  }

  ngOnInit() {
    if (this.driver$)
      this.driverSub = this.driver$.subscribe((event: KeyboardEvent) => this.handle(event))
  }

  split_into_equal_rows(sample_words: string[]) {
    let rows: string[][] = []
    let curentlent: number = 0
    let rows_count: number = 0
    let index: number = 0

    for (let word of sample_words) {
      curentlent += word.length + 1
      index = Math.floor(curentlent / this.width)

      if (index == rows_count) {
        rows.push([])
        rows_count++
      }
      rows[index].push(word)
    }

    rows = rows.map(row => row.join('_').split('').concat(['_']))
    rows[index].pop()

    index = 0
    return rows.map(row => row.map(sign => [sign, index++]))
  }

  @HostListener('window:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    if (this.driver$)
      return

    this.handle(event)
  }

  private handle(event: KeyboardEvent) {
    if (this.lock)
      return

    let iSstuckMode: boolean = this.typingSv.get_mode()
    let key: string = event.key;
    let corect_key: string = this.sample[this.active]

    this.stroke.emit(key)

    if (key == ' ')
      key = '_'

    if (this.firsttry) {
      this.corrects[this.active] = key == corect_key
      this.wrongs[this.active] = key != corect_key
    }

    if (key == corect_key) {
      this.active++
      this.firsttry = true


    } else {

      if (iSstuckMode)
        this.firsttry = false
      else
        this.active++
    }
  }

  ngOnDestroy() {
    if (this.driverSub)
      this.driverSub.unsubscribe()
  }
}

