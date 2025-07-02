import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { FirebaseDataService } from '../../../shared/services/firebase-data.service';
import { Customer } from '../../../shared/models/customer';

@Component({
  selector: 'app-add-update',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './add-update.html',
  styleUrl: './add-update.scss'
})
export class AddUpdate {
  customerForm: FormGroup;
  isEdit = false;
  customerId: string | null = null;

  constructor(
    public fb: FormBuilder,
    public dataService: FirebaseDataService,
    public route: ActivatedRoute,
    public router: Router
  ) {
    this.customerForm = this.fb.group({
      name: ['', Validators.required],
      phone: ['', Validators.required],
      roomNumber: [null, Validators.required],
      rent: [null, Validators.required],
      joiningDate: ['', Validators.required],
      age: [null, Validators.required],
      address: ['', Validators.required],
      adhaarNumber: ['', Validators.required],
    });

    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.isEdit = true;
        this.customerId = id;
        this.dataService.getCustomers().subscribe((customers: Customer[]) => {
          const customer = customers.find((c: Customer) => c.id === id);
          if (customer) {
            this.customerForm.patchValue(customer);
          }
        });
      }
    });
  }

  onSubmit() {
    if (this.customerForm.invalid) return;
    const customer: Customer = {
      ...this.customerForm.value,
      id: this.customerId || ''
    };
    if (this.isEdit && this.customerId) {
      this.dataService.updateCustomer({ ...customer, id: this.customerId }).then(() => {
        this.router.navigate(['../'], { relativeTo: this.route });
      });
    } else {
      this.dataService.addCustomer(customer).then(() => {
        this.router.navigate(['../'], { relativeTo: this.route });
      });
    }
  }

  cancel() {
    this.router.navigate(['../'], { relativeTo: this.route });
  }
}
