import { Component, ViewChild } from '@angular/core';
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
import { Table } from 'primeng/table';
import { TextareaModule } from 'primeng/textarea';

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
    ToastModule,
    TextareaModule
  ],
  providers: [DatePipe, ConfirmationService, MessageService],
  templateUrl: './list.html',
  styleUrl: './list.scss'
})
export class List {
  @ViewChild('dt') dt!: Table;
  
  customers$: Observable<Customer[]>;
  customersList: Customer[] = [];
  customerForm: FormGroup;
  displayDialog = false;
  isEdit = false;
  isSubmitting = false;
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

  // Get unique occupied rooms count
  getOccupiedRooms(): number {
    const uniqueRooms = new Set(this.customersList.map(customer => customer.roomNumber));
    return uniqueRooms.size;
  }

  // Get total monthly rent
  getTotalRent(): number {
    return this.customersList.reduce((total, customer) => total + customer.rent, 0);
  }

  // Calculate days since joining
  getDaysSinceJoining(joiningDate: string): number {
    const joinDate = new Date(joiningDate);
    const today = new Date();
    const diffTime = Math.abs(today.getTime() - joinDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
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
    this.isSubmitting = false;
  }

  onSubmit() {
    if (this.customerForm.invalid) return;
    
    this.isSubmitting = true;
    const formValue = this.customerForm.value;
    const customer: Customer = {
      ...formValue,
      joiningDate: formValue.joiningDate instanceof Date ? formValue.joiningDate.toISOString() : formValue.joiningDate,
      id: this.selectedCustomerId || ''
    };
    
    if (this.isEdit && this.selectedCustomerId) {
      this.dataService.updateCustomer({ ...customer, id: this.selectedCustomerId }).then(() => {
        this.messageService.add({ 
          severity: 'success', 
          summary: 'Success', 
          detail: 'Customer updated successfully' 
        });
        this.closeDialog();
      }).catch(error => {
        this.messageService.add({ 
          severity: 'error', 
          summary: 'Error', 
          detail: 'Failed to update customer' 
        });
        this.isSubmitting = false;
      });
    } else {
      this.dataService.addCustomer(customer).then(() => {
        this.messageService.add({ 
          severity: 'success', 
          summary: 'Success', 
          detail: 'Customer added successfully' 
        });
        this.closeDialog();
      }).catch(error => {
        this.messageService.add({ 
          severity: 'error', 
          summary: 'Error', 
          detail: 'Failed to add customer' 
        });
        this.isSubmitting = false;
      });
    }
  }

  confirmDelete(customer: Customer) {
    this.confirmationService.confirm({
      message: `Are you sure you want to delete ${customer.name}? This action cannot be undone.`,
      header: 'Confirm Delete',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.dataService.deleteCustomer(customer.id).then(() => {
          this.messageService.add({ 
            severity: 'success', 
            summary: 'Deleted', 
            detail: 'Customer deleted successfully' 
          });
        }).catch(error => {
          this.messageService.add({ 
            severity: 'error', 
            summary: 'Error', 
            detail: 'Failed to delete customer' 
          });
        });
      }
    });
  }
}
