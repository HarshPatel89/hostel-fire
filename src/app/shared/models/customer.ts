export interface Customer {
  id: string;
  name: string;
  phone: string;
  roomNumber: number;
  rent: number;
  joiningDate: string; // ISO string
  age: number;
  address: string;
  adhaarNumber: string;
  avatarColor?: string;
  avatarInitials?: string;
}