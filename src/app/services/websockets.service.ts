import { Injectable } from '@angular/core';
import { Observable, forkJoin } from 'rxjs';
import { take } from 'rxjs/operators';
import * as io from 'socket.io-client';

@Injectable({
  providedIn: 'root'
})
export class WebsocketsService {
  private socekt: any;
  protected me: string
  readonly url: string = 'https://ship-server-rp.herokuapp.com';

  constructor() {
    this.socekt = io(this.url)
  }

  listen(eventName: string) {
    return new Observable(subscriber => {
      this.socekt.on(eventName, data => {
        subscriber.next(data)
      })
    })
  }

  async emit(eventName: string, data: any) {
    this.socekt.emit(eventName, data);
    this.me = (await this.listen('me').pipe(take(1)).toPromise()) as string
  }


  get socket$() {
    this.listen('keys-share').subscribe(res => console.log(res, 'res'))
    return this.listen('key-share')
  }


}
