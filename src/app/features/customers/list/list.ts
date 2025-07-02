
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { FirebaseDataService } from '../../../shared/services/firebase-data.service';
import { Customer } from '../../../shared/models/customer';
import { CommonModule, DatePipe } from '@angular/common';
import { TableModule } from 'primeng/table';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { CalendarModule } from 'primeng/calendar';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { ConfirmationService, MessageService } from 'primeng/api';

@Component({
  selector: 'app-list',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TableModule,
    DialogModule,
    InputTextModule,
    DropdownModule,
    CalendarModule,
    ButtonModule,
    ConfirmDialogModule,
    ToastModule
  ],
  providers: [DatePipe, ConfirmationService, MessageService],
  templateUrl: './list.html',
  styleUrl: './list.scss'
})
export class List {
  customers$: Observable<Customer[]>;
  customersList: Customer[] = [];
  customerForm: FormGroup;
  displayDialog = false;
  isEdit = false;
  selectedCustomerId: string | null = null;

  constructor(
    public dataService: FirebaseDataService,
    private fb: FormBuilder,
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) {
    this.customers$ = this.dataService.getCustomers();
    this.customers$.subscribe(list => {
      this.customersList = list || [];
    });
    this.customerForm = this.fb.group({
      name: ['', Validators.required],
      phone: ['', Validators.required],
      roomNumber: [null, Validators.required],
      rent: [null, Validators.required],
      joiningDate: [null, Validators.required],
      age: [null, Validators.required],
      address: ['', Validators.required],
      adhaarNumber: ['', Validators.required],
    });
  }

  openAddDialog() {
    this.isEdit = false;
    this.selectedCustomerId = null;
    this.customerForm.reset();
    this.displayDialog = true;
  }

  openEditDialog(customer: Customer) {
    this.isEdit = true;
    this.selectedCustomerId = customer.id;
    this.customerForm.patchValue({
      ...customer,
      joiningDate: customer.joiningDate ? new Date(customer.joiningDate) : null
    });
    this.displayDialog = true;
  }

  closeDialog() {
    this.displayDialog = false;
    this.customerForm.reset();
  }

  onSubmit() {
    if (this.customerForm.invalid) return;
    const formValue = this.customerForm.value;
    const customer: Customer = {
      ...formValue,
      joiningDate: formValue.joiningDate instanceof Date ? formValue.joiningDate.toISOString() : formValue.joiningDate,
      id: this.selectedCustomerId || ''
    };
    if (this.isEdit && this.selectedCustomerId) {
      this.dataService.updateCustomer({ ...customer, id: this.selectedCustomerId }).then(() => {
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Customer updated' });
        this.closeDialog();
      });
    } else {
      this.dataService.addCustomer(customer).then(() => {
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Customer added' });
        this.closeDialog();
      });
    }
  }

  confirmDelete(customer: Customer) {
    this.confirmationService.confirm({
      message: `Are you sure you want to delete ${customer.name}?`,
      accept: () => {
        this.dataService.deleteCustomer(customer.id).then(() => {
          this.messageService.add({ severity: 'success', summary: 'Deleted', detail: 'Customer deleted' });
        });
      }
    });
  }
}
