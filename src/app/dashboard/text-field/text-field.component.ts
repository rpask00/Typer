import { Component, OnInit, HostListener } from '@angular/core';
import { take } from 'rxjs/operators';
import { TypingService } from 'src/app/services/typing.service';
import { WordsSupplyService } from 'src/app/services/words-supply.service';

@Component({
  selector: 'text-field',
  templateUrl: './text-field.component.html',
  styleUrls: ['./text-field.component.scss']
})

export class TextFieldComponent implements OnInit {

  sample: string[];
  corrects: boolean[];
  wrongs: boolean[];
  active: number = 0;
  mistakes_count: number = 0;
  words_count: number = 0;
  firsttry: boolean = true;
  time: number = 0;
  samplelength: number = 0;
  timeInterval: NodeJS.Timeout
  rows: any[][]
  current_keyset: any = {}

  constructor(
    private typingSv: TypingService,
    private wordsSupSv: WordsSupplyService,
  ) { }

  ngOnInit(): void {
    this.initSample()
  }

  @HostListener('window:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    let iSstuckMode: boolean = this.typingSv.get_mode()
    let key: string = event.key;
    let corect_key: string = this.sample[this.active]

    this.update_keyset(corect_key, key)

    if (key == ' ')
      key = '_'

    if (this.firsttry && this.active == 0)
      this.timeInterval = setInterval(() => this.time++, 1000)


    if (this.firsttry) {
      this.corrects[this.active] = key == corect_key
      this.wrongs[this.active] = key != corect_key
    }

    if (key == corect_key) {
      this.active++
      this.firsttry = true

      if (this.active == this.samplelength) {
        clearInterval(this.timeInterval)
        this.loadSample()
      }

    } else {
      this.mistakes_count++

      if (iSstuckMode)
        this.firsttry = false
      else
        this.active++
    }


  }

  update_keyset(corect_key: string, pressed_key: string): void {
    if (pressed_key == ' ')
      return

    pressed_key = pressed_key.toUpperCase()
    corect_key = corect_key.toUpperCase()

    let total: number = this.current_keyset[pressed_key][1]
    let errors: number = this.current_keyset[pressed_key][2]

    this.current_keyset[pressed_key][1] = ++total

    if (corect_key != pressed_key)
      this.current_keyset[pressed_key][2] = ++errors

    // this.current_keyset[pressed_key][0] = Math.min(Math.floor(total / errors / 3) + 1, 5)
    this.current_keyset[pressed_key][0] = Math.min(Math.floor(total / errors / 1) + 1, 5)
  }

  async initSample() {
    this.typingSv.get_fetch_data$().pipe(take(1)).subscribe(async (f_d) => {
      this.current_keyset = f_d.keyset
      let keyset = Object.keys(f_d.keyset).filter(key => f_d.keyset[key][0]).join('')
      let sample_words: string[] = await this.wordsSupSv.getWords(f_d.words_count, f_d.currentkey, keyset)
      this.words_count = sample_words.length
      this.sample = sample_words.map(word => word.toLowerCase()).join('_').split('')

      this.rows = this.split_into_equal_rows(sample_words)

      this.samplelength = this.sample.length
      this.corrects = this.sample.map(e => false)
      this.wrongs = this.sample.map(e => false)
      this.active = 0
      this.mistakes_count = 0
      this.time = 0
    })

  }



  split_into_equal_rows(sample_words: string[]) {
    let rows: string[][] = []
    let curentlent: number = 0
    let rows_count: number = 0
    let index: number = 0

    for (let word of sample_words) {
      curentlent += word.length + 1
      index = Math.floor(curentlent / 45)

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


  loadSample() {
    let speed: number = this.samplelength / this.time * 60 / 4.5
    speed = Math.round(speed)
    this.typingSv.update_stats(speed, this.mistakes_count)
    this.typingSv.update_fetch_data(this.current_keyset)

    this.initSample()
  }


}
