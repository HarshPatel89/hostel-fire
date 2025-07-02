
import { Component, EventEmitter, Output } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-topbar',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './topbar.html',
  styleUrl: './topbar.scss'
})
export class Topbar {
  @Output() sidebarToggle = new EventEmitter<void>();

  onSidebarToggle() {
    this.sidebarToggle.emit();
  }
}
