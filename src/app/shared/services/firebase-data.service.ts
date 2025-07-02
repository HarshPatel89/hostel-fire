import { Injectable } from '@angular/core';
import { Firestore, collection, collectionData, doc, addDoc, updateDoc, deleteDoc } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Room } from '../models/room';
import { Customer } from '../models/customer';

@Injectable({ providedIn: 'root' })
export class FirebaseDataService {
  constructor(private firestore: Firestore) {}

  // Room CRUD
  getRooms(): Observable<Room[]> {
    const roomsRef = collection(this.firestore, 'rooms');
    return collectionData(roomsRef, { idField: 'id' }) as Observable<Room[]>;
  }

  addRoom(room: Room) {
    const roomsRef = collection(this.firestore, 'rooms');
    return addDoc(roomsRef, room);
  }

  updateRoom(room: Room) {
    const roomDoc = doc(this.firestore, `rooms/${room.id}`);
    return updateDoc(roomDoc, { ...room });
  }

  deleteRoom(id: string) {
    const roomDoc = doc(this.firestore, `rooms/${id}`);
    return deleteDoc(roomDoc);
  }

  // Customer CRUD
  getCustomers(): Observable<Customer[]> {
    const customersRef = collection(this.firestore, 'customers');
    return collectionData(customersRef, { idField: 'id' }) as Observable<Customer[]>;
  }

  addCustomer(customer: Customer) {
    const customersRef = collection(this.firestore, 'customers');
    return addDoc(customersRef, customer);
  }

  updateCustomer(customer: Customer) {
    const customerDoc = doc(this.firestore, `customers/${customer.id}`);
    return updateDoc(customerDoc, { ...customer });
  }

  deleteCustomer(id: string) {
    const customerDoc = doc(this.firestore, `customers/${id}`);
    return deleteDoc(customerDoc);
  }
}
