
import { Component, ElementRef, ViewChild, Renderer2, signal, computed, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../auth/services/auth.service';
import { User } from '../../../auth/interfaces';
import { BehaviorSubject } from 'rxjs';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { CustomSidenavComponent } from '../../../shared/components/custom-sidenav/custom-sidenav.component';

@Component({
  selector: 'app-layout-page-users',
  templateUrl: './layout-page.component.html',
  styleUrls: ['./layaout-page.component.css'],
  styles: [`

`],

  animations: [
    trigger('widthAnimation', [
      state('expanded', style({
        width: '80px' // Ancho cuando está expandido
      })),
      state('collapsed', style({
        width: '44px' // Ancho cuando está colapsado
      })),
      transition('expanded => collapsed', [
        animate('0.5s')
      ]),
      transition('collapsed => expanded', [
        animate('0.5s')
      ])
    ]),
    trigger('textAnimation', [
      // opacity
      state('visible', style({
        opacity: 1,
        width: '50%'
      })),
      state('hidden', style({
        opacity: 0,
        width: '0%'
      })),
      transition('visible => hidden', [

        animate('0.3s')
      ]),
      transition('hidden => visible', [
        animate('0.3s')
      ])
    ]),
  ],


})
export class LayoutPageComponent implements OnInit{
  ngOnInit(): void {
    throw new Error('Method not implemented.');
  }

  constructor(){}


  // constructor(

  //   private router: Router
  //   , private authService: AuthService,
  //   private renderer2: Renderer2,
  // ) { }

  // ngOnInit(): void {

  //   this.usuario = this.authService.currentUser();

  // }




  // usuario: User | null = null;



  // //item del menu lateral
  // public sidebarItems = [
  //   { label: 'Listado', icon: 'label', url: './list' },

  // ];



  // get user(): User | null {
  //   return this.usuario;
  // }

  // onLogout() {
  //   this.authService.logout();
  //   this.router.navigate(['/auth/login'])
  // }


  // collapsed = signal(false);

  // sidenavWidth = computed(() => this.collapsed() ? '70px' : '256px');

  // mariginLeft = computed(() => this.collapsed() ? '89px' : '266px');

  // profilePicSize = computed(() => this.collapsed() ? '40' : '80');

  // visibleText = computed(() => this.collapsed() ? true : false);

  // sizeTitle = computed(() => this.collapsed() ? '0' : '20');

  // private _rolUser = signal<string>('Administrador');





  // currentRolUser = computed(() => !this.collapsed() ? this.usuario?.roles[0].authority + ':' : '');



  // nameUserAbbreviated = computed(() => {
  //   console.log('nameUserAbbreviated--Veces llamada');
  //   const fullName = this.usuario?.fullname; // Obtener el valor actual de la señal
  //   if (!this.collapsed()) {
  //     return fullName;
  //   } else {
  //     const words = fullName!.split(' '); // Usar métodos de string en el valor actual
  //     const initials = words.map(word => word.charAt(0)).join('');
  //     return initials.toUpperCase();
  //   }
  // });

}
