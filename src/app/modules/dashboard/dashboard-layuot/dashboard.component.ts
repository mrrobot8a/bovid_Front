import { Component, OnInit, computed, signal } from '@angular/core';
import { AuthService } from '../../auth/services/auth.service';
import { User } from '../../auth/interfaces';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard-layout.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {


  constructor(
    private authService: AuthService,
  ) { }

  ngOnInit(): void {



  }

  currenUser = computed(()=>{
    console.log('usario desde dashboard', this.authService.currentUser());
    return this.authService.currentUser()});















}
