import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { List } from './list/list';
import { AddUpdate } from './add-update/add-update';

const routes: Routes = [
  { path: '', component: List },
  { path: 'add', component: AddUpdate },
  { path: 'edit/:id', component: AddUpdate },
];

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ]
})
export class RoomsModule { }
