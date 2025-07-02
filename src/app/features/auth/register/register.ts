
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './register.html',
  styleUrl: './register.scss'
})
export class RegisterComponent {
  username = '';
  password = '';
  confirmPassword = '';

  constructor(private router: Router) {}

  onSubmit() {
    // TODO: Hook up registration
    this.router.navigate(['/login']);
  }
}
