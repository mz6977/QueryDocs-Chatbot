import { Component, Renderer2 } from '@angular/core';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {
  showSidebar: boolean = false; // Tracks the visibility of the sidebar

  constructor(private renderer: Renderer2) {}

  // Toggles the navbar open/close state
  toggleNavbar() {
    const body = document.body;
    if (body.classList.contains('navbar-open')) {
      this.renderer.removeClass(body, 'navbar-open');
    } else {
      this.renderer.addClass(body, 'navbar-open');
    }
  }

  // Toggles the sidebar visibility
  toggleSidebar(): void {
    this.showSidebar = !this.showSidebar;
  }
}