import { Component } from '@angular/core';
import { RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { CommonModule } from '@angular/common';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'vestaplan';
  mostrarMenu: boolean = false;

  constructor(private readonly router: Router) {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      this.mostrarMenu = !(event.url === '/login' || event.url === '/' || event.url.includes('login'));
    });
  }

  logout(): void {
    localStorage.removeItem('vestaplan_token');
    this.router.navigate(['/login']);
  } 
}