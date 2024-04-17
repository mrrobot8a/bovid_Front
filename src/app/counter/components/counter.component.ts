import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-counter',
  templateUrl: './counter.component.html',
})

export class CounterComponent{
  title: string = 'Contador App';
  public number: number = 20;
  public base: number = 5;

  sum():void{
    this.number++;
  }
  subtract(){
    this.number -= 1;
  }
  acumulate(value: number){
    this.number += value;
  }
  reset():void{
    this.number = this.base;
  }
}
