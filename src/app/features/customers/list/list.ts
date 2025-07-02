import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { FirebaseDataService } from '../../../shared/services/firebase-data.service';
import { Customer } from '../../../shared/models/customer';
import { CommonModule, DatePipe } from '@angular/common';

@Component({
  selector: 'app-list',
  standalone: true,
  imports: [CommonModule],
  providers: [DatePipe],
  templateUrl: './list.html',
  styleUrl: './list.scss'
})
export class List {
  customers$: Observable<Customer[]>;

  constructor(
    public dataService: FirebaseDataService,
    public router: Router
  ) {
    this.customers$ = this.dataService.getCustomers();
  }

  addCustomer() {
    this.router.navigate(['customers/add']);
  }

  editCustomer(customer: Customer) {
    this.router.navigate(['customers/edit', customer.id]);
  }

  deleteCustomer(id: string) {
    if (confirm('Are you sure you want to delete this customer?')) {
      this.dataService.deleteCustomer(id);
    }
  }
}
