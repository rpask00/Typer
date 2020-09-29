import { Component, OnInit, HostListener } from '@angular/core';
import { TypingService } from 'src/app/services/typing.service';
import { WordsSupplyService } from 'src/app/services/words-supply.service';
import { first } from 'rxjs/operators';

@Component({
  selector: 'text-field',
  templateUrl: './text-field.component.html',
  styleUrls: ['./text-field.component.scss']
})

export class TextFieldComponent implements OnInit {

  sample: string[];
  active: number = 0;
  mistakes_count: number = 0;
  firsttry: boolean = true;
  time: number = 0;
  samplelength: number = 0;
  timeInterval: NodeJS.Timeout
  current_keyset: any = {}
  sample_words: string[]

  constructor(
    private typingSv: TypingService,
    private wordsSupSv: WordsSupplyService,
  ) { }

  ngOnInit(): void {
    this.initSample()
  }

  handleClick(key: string) {
    let iSstuckMode: boolean = this.typingSv.get_mode()
    let corect_key: string = this.sample[this.active]

    this.update_keyset(corect_key, key)

    if (key == ' ')
      key = '_'

    if (this.firsttry && this.active == 0)
      this.timeInterval = setInterval(() => this.time++, 1000)


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
    if (!corect_key || pressed_key == ' ')
      return

    pressed_key = pressed_key.toUpperCase()
    corect_key = corect_key.toUpperCase()

    let total: number = this.current_keyset[pressed_key][1]
    let errors: number = this.current_keyset[pressed_key][2]

    this.current_keyset[pressed_key][1] = ++total

    if (corect_key != pressed_key)
      this.current_keyset[pressed_key][2] = ++errors

    this.current_keyset[pressed_key][0] = Math.min(Math.floor(total / errors / 3) + 1, 5)
  }

  async initSample() {
    this.active = 0
    this.mistakes_count = 0
    this.time = 0
    this.current_keyset = await (await this.typingSv.get_keyset$()).pipe(first()).toPromise()
    this.sample_words = await this.typingSv.get_sample_words()
    this.sample = this.sample_words.map(word => word.toLowerCase()).join('_').split('')
    this.samplelength = this.sample.length

  }

  loadSample() {
    console.log(this.time)
    let speed: number = this.samplelength / this.time * 60 / 4.5
    speed = Math.round(speed)
    this.typingSv.update_stats(speed, this.mistakes_count)
    this.typingSv.update_fetch_data(this.current_keyset)

    this.initSample()
  }


}
