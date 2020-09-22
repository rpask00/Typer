import { Component, OnInit, HostListener } from '@angular/core';

@Component({
  selector: 'text-field',
  templateUrl: './text-field.component.html',
  styleUrls: ['./text-field.component.scss']
})



export class TextFieldComponent implements OnInit {

  sample: string[];
  corrects: boolean[];
  wrongs: boolean[];
  active: number;
  constructor() { }

  ngOnInit(): void {
    this.sample = 'Lorem_ipsum_dolor_sit_amet_consectetu_Enimprovident_Lorem_ipsum_dolorsit_amet_consecteturadipisicing_elit_Enim_provident'.toLowerCase().split('');
    this.corrects = this.sample.map(e => false)
    this.wrongs = this.sample.map(e => false)
    this.active = 0;
  }

  @HostListener('window:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    let key: string = event.key;
    this.corrects[this.active] = key == this.sample[this.active]
    this.wrongs[this.active] = key != this.sample[this.active]
    this.active++;
  }

}
