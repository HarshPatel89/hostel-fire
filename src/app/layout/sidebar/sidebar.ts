import { Component, Input, Output, EventEmitter } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.scss'
})
export class Sidebar {
  @Input() visible = false;
  @Output() menuItemClicked = new EventEmitter<void>();

  onHide() {
    this.visible = false;
  }

  onMenuItemClick() {
    this.menuItemClicked.emit();
  }
}
