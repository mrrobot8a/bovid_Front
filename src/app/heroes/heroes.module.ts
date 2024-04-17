import { NgModule } from '@angular/core';
import { HeroComponent } from './hero/hero.component';
import { HeroListComponent } from './hero-list/hero-list.component';
import { CommonModule } from '@angular/common';



@NgModule({

  // hay que exportar nuestros componentes para usarlos en otros modulos pero de la carpeta que lo encapsula
  exports: [
    HeroComponent,
    HeroListComponent
  ],
  // hay que declara nuestros componentes para usarlos en otros modulos
  declarations: [
    HeroComponent,
    HeroListComponent,],
  providers: [],
  // estas son importaciones que utilizan nuestros modulos declarados en este modulo
  imports: [
    CommonModule
  ],
})
export class HeroesModule { }
