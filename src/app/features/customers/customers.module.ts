import { NgModule } from '@angular/core';

import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { List } from './list/list';
import { AddUpdate } from './add-update/add-update';

// PrimeNG modules
import { TableModule } from 'primeng/table';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { CalendarModule } from 'primeng/calendar';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { ConfirmationService } from 'primeng/api';
import { MessageService } from 'primeng/api';
import { TooltipModule } from 'primeng/tooltip';

const routes: Routes = [
  { path: '', component: List },
  { path: 'add', component: AddUpdate },
  { path: 'edit/:id', component: AddUpdate },
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    ReactiveFormsModule,
    TableModule,
    DialogModule,
    InputTextModule,
    DropdownModule,
    CalendarModule,
    ButtonModule,
    ConfirmDialogModule,
    ToastModule,
    TooltipModule,
    List,
    AddUpdate
  ],
  providers: [ConfirmationService, MessageService]
})
export class CustomersModule { }
