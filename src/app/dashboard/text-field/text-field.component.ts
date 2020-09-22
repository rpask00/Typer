import { Component, OnInit, HostListener } from '@angular/core';
import { TypingService } from 'src/app/services/typing.service';

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
    private typingSv: TypingService
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

  initSample() {
    let sample_string: string = 'Lorem_ipsum_dolor_sit_amet_consectetu_Enimprovident_Lorem_ipsum_dolorsit_amet_consecteturadipisicing_elit_Enim_provident'
    this.words_count = sample_string.split('_').length
    this.sample = sample_string.toLowerCase().split('')
    this.samplelength = this.sample.length
    this.corrects = this.sample.map(e => false)
    this.wrongs = this.sample.map(e => false)
    this.active = 0
    this.mistakes_count = 0
    this.time = 0
  }


  loadSample() {
    let speed: number = this.words_count / this.time * 60
    speed = Math.round(speed)
    this.typingSv.update_speed_and_mistakes(speed, this.mistakes_count)

    this.initSample()
  }


}
