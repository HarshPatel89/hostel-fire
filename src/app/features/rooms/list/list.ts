import { Component, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { FirebaseDataService } from '../../../shared/services/firebase-data.service';
import { Room } from '../../../shared/models/room';
import { Customer } from '../../../shared/models/customer';
import { CommonModule, DatePipe } from '@angular/common';
import { TableModule } from 'primeng/table';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { MultiSelectModule } from 'primeng/multiselect';
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
    MultiSelectModule,
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
  
  rooms$: Observable<Room[]>;
  customers$: Observable<Customer[]>;
  roomsList: Room[] = [];
  customersList: Customer[] = [];
  roomForm: FormGroup;
  availableCustomers: any[] = [];
  displayDialog = false;
  isEdit = false;
  isSubmitting = false;
  selectedRoomId: string | null = null;

  constructor(
    public dataService: FirebaseDataService,
    private fb: FormBuilder,
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) {
    this.rooms$ = this.dataService.getRooms();
    this.customers$ = this.dataService.getCustomers();
    
    this.rooms$.subscribe(list => {
      this.roomsList = list || [];
    });
    
    this.customers$.subscribe(list => {
      this.customersList = list || [];
      this.updateAvailableCustomers();
    });
    
    this.roomForm = this.fb.group({
      number: [null, [Validators.required, Validators.min(1)]],
      capacity: [null, [Validators.required, Validators.min(1), Validators.max(10)]],
      rent: [null, [Validators.required, Validators.min(0)]],
      remarks: ['', Validators.maxLength(500)],
      customers: [[]]
    });
  }

  // Get total rooms count
  getTotalRooms(): number {
    return this.roomsList.length;
  }

  // Get occupied rooms count
  getOccupiedRooms(): number {
    return this.roomsList.filter(room => room.customers && room.customers.length > 0).length;
  }

  // Get available rooms count
  getAvailableRooms(): number {
    return this.roomsList.filter(room => !room.customers || room.customers.length === 0).length;
  }

  // Get total monthly rent potential
  getTotalRentPotential(): number {
    return this.roomsList.reduce((total, room) => total + room.rent, 0);
  }

  // Get current monthly rent (from occupied rooms)
  getCurrentMonthlyRent(): number {
    return this.roomsList
      .filter(room => room.customers && room.customers.length > 0)
      .reduce((total, room) => total + room.rent, 0);
  }

  // Get occupancy rate
  getOccupancyRate(): number {
    if (this.roomsList.length === 0) return 0;
    return Math.round((this.getOccupiedRooms() / this.roomsList.length) * 100);
  }

  // Get customers in a room
  getCustomersInRoom(room: Room): Customer[] {
    if (!room.customers || room.customers.length === 0) return [];
    return this.customersList.filter(customer => room.customers.includes(customer.id));
  }

  // Get room status
  getRoomStatus(room: Room): { status: string; class: string; icon: string } {
    if (!room.customers || room.customers.length === 0) {
      return { status: 'Available', class: 'available', icon: 'pi pi-check-circle' };
    } else if (room.customers.length >= room.capacity) {
      return { status: 'Full', class: 'full', icon: 'pi pi-times-circle' };
    } else {
      return { status: 'Partially Occupied', class: 'partial', icon: 'pi pi-info-circle' };
    }
  }

  // Update available customers for dropdown
  updateAvailableCustomers() {
    this.availableCustomers = this.customersList
      .filter(customer => !customer.roomNumber || !this.roomsList.some(room => 
        room.customers && room.customers.includes(customer.id)
      ))
      .map(customer => ({
        label: `${customer.name} (${customer.phone})`,
        value: customer.id,
        customer: customer
      }));
  }

  openAddDialog() {
    this.isEdit = false;
    this.selectedRoomId = null;
    this.roomForm.reset();
    this.displayDialog = true;
  }

  openEditDialog(room: Room) {
    this.isEdit = true;
    this.selectedRoomId = room.id;
    this.roomForm.patchValue({
      number: room.number,
      capacity: room.capacity,
      rent: room.rent,
      remarks: room.remarks || '',
      customers: room.customers || []
    });
    this.displayDialog = true;
  }

  closeDialog() {
    this.displayDialog = false;
    this.roomForm.reset();
    this.isSubmitting = false;
  }

  onSubmit() {
    if (this.roomForm.invalid) return;
    
    this.isSubmitting = true;
    const formValue = this.roomForm.value;
    const room: Room = {
      ...formValue,
      id: this.selectedRoomId || '',
      customers: formValue.customers || []
    };
    
    if (this.isEdit && this.selectedRoomId) {
      this.dataService.updateRoom({ ...room, id: this.selectedRoomId }).then(() => {
        this.messageService.add({ 
          severity: 'success', 
          summary: 'Success', 
          detail: 'Room updated successfully' 
        });
        this.closeDialog();
      }).catch(error => {
        this.messageService.add({ 
          severity: 'error', 
          summary: 'Error', 
          detail: 'Failed to update room' 
        });
        this.isSubmitting = false;
      });
    } else {
      this.dataService.addRoom(room).then(() => {
        this.messageService.add({ 
          severity: 'success', 
          summary: 'Success', 
          detail: 'Room added successfully' 
        });
        this.closeDialog();
      }).catch(error => {
        this.messageService.add({ 
          severity: 'error', 
          summary: 'Error', 
          detail: 'Failed to add room' 
        });
        this.isSubmitting = false;
      });
    }
  }

  confirmDelete(room: Room) {
    const customersInRoom = this.getCustomersInRoom(room);
    const message = customersInRoom.length > 0 
      ? `Room ${room.number} has ${customersInRoom.length} customer(s). Are you sure you want to delete this room? This action cannot be undone.`
      : `Are you sure you want to delete Room ${room.number}? This action cannot be undone.`;

    this.confirmationService.confirm({
      message: message,
      header: 'Confirm Delete',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.dataService.deleteRoom(room.id).then(() => {
          this.messageService.add({ 
            severity: 'success', 
            summary: 'Deleted', 
            detail: 'Room deleted successfully' 
          });
        }).catch(error => {
          this.messageService.add({ 
            severity: 'error', 
            summary: 'Error', 
            detail: 'Failed to delete room' 
          });
        });
      }
    });
  }
}
