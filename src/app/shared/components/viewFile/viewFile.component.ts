import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
    selector: 'app-view-file',


    templateUrl: './viewFile.component.html',
    styles: `
    :host {
      display: block;
    }
  `,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ViewFileComponent implements  OnInit {

  constructor(private route: ActivatedRoute) { }


  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      const parametro = params['nameFile'];
      console.log('Valor del parámetro:', parametro);
      // Aquí puedes utilizar el valor del parámetro como lo necesites
    });
  }
}
