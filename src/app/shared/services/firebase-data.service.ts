import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { Room } from '../models/room';
import { Customer } from '../models/customer';

@Injectable({ providedIn: 'root' })
export class FirebaseDataService {
  constructor(private firestore: AngularFirestore) {}

  // Room CRUD
  getRooms(): Observable<Room[]> {
    return this.firestore.collection<Room>('rooms').valueChanges({ idField: 'id' });
  }

  addRoom(room: Room) {
    return this.firestore.collection('rooms').add(room);
  }

  updateRoom(room: Room) {
    return this.firestore.collection('rooms').doc(room.id).update(room);
  }

  deleteRoom(id: string) {
    return this.firestore.collection('rooms').doc(id).delete();
  }

  // Customer CRUD
  getCustomers(): Observable<Customer[]> {
    return this.firestore.collection<Customer>('customers').valueChanges({ idField: 'id' });
  }

  addCustomer(customer: Customer) {
    return this.firestore.collection('customers').add(customer);
  }

  updateCustomer(customer: Customer) {
    return this.firestore.collection('customers').doc(customer.id).update(customer);
  }

  deleteCustomer(id: string) {
    return this.firestore.collection('customers').doc(id).delete();
  }
}
