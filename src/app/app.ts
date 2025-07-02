import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Topbar } from './layout/topbar/topbar';
import { Sidebar } from './layout/sidebar/sidebar';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  imports: [CommonModule, RouterOutlet, Topbar, Sidebar],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  sidebarVisible = false;
  protected title = 'hostel-fire';

  showSidebar() {
    this.sidebarVisible = true;
  }

  hideSidebar() {
    this.sidebarVisible = false;
  }
}
