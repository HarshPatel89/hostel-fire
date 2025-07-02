import { Component, Output, EventEmitter } from '@angular/core';
import { MenubarModule } from 'primeng/menubar';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-topbar',
  imports: [CommonModule, MenubarModule, ButtonModule],
  templateUrl: './topbar.html',
  styleUrl: './topbar.scss'
})
export class Topbar {
  @Output() sidebarToggle = new EventEmitter<void>();

  onSidebarToggle() {
    this.sidebarToggle.emit();
  }
}
