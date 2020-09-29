import { Component, HostListener, Input, Output, EventEmitter, OnChanges } from '@angular/core';
import { TypingService } from 'src/app/services/typing.service';
import { rootCertificates } from 'tls';

@Component({
  selector: 'field',
  templateUrl: './field.component.html',
  styleUrls: ['./field.component.scss']
})
export class FieldComponent implements OnChanges {

  @Output('stroke') stroke = new EventEmitter<string>();
  @Input('sample_words') sample_words: string[]
  @Input('width') width: number
  @Input('fnt_size') fnt_size: number = 40


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
    console.log(this.fnt_size)
    this.active = 0
    this.sample = this.sample_words.map(word => word.toLowerCase()).join('_').split('')
    this.rows = this.split_into_equal_rows(this.sample_words)
    this.corrects = this.sample.map(e => false)
    this.wrongs = this.sample.map(e => false)
    this.firsttry = true

    document.documentElement.style.setProperty('--playground_font_size', this.fnt_size + 'px')
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
}

