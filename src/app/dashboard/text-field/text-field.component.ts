import { Component, OnInit, HostListener } from '@angular/core';
import { forkJoin, Observable } from 'rxjs';
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

  constructor(
    private typingSv: TypingService,
    private wordsSupSv: WordsSupplyService,
  ) { }

  ngOnInit(): void {
    this.initSample()
  }

  @HostListener('window:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    let iSstuckMode: boolean = this.typingSv.getmode()

    let key: string = event.key;
    if (key == ' ')
      key = '_'

    if (this.firsttry && this.active == 0)
      this.timeInterval = setInterval(() => this.time++, 1000)


    if (this.firsttry) {
      this.corrects[this.active] = key == this.sample[this.active]
      this.wrongs[this.active] = key != this.sample[this.active]
    }

    if (key == this.sample[this.active]) {
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

  async initSample() {
    let fetch_data = await this.typingSv.get_fetch_data$().toPromise()
    let sample_words: string[] = await this.wordsSupSv.getWords(fetch_data.words_count, fetch_data.currentkey, fetch_data.keyset)
    this.words_count = sample_words.length
    this.sample = sample_words.map(word => word.toLowerCase()).join('_').split('')
    this.samplelength = this.sample.length
    this.corrects = this.sample.map(e => false)
    this.wrongs = this.sample.map(e => false)
    this.active = 0
    this.mistakes_count = 0
    this.time = 0
  }


  loadSample() {
    let speed: number = this.samplelength / this.time * 60 / 4.5
    console.log(this.words_count, this.time)
    speed = Math.round(speed)
    this.typingSv.update_speed_and_mistakes(speed, this.mistakes_count)

    this.initSample()
  }


}
