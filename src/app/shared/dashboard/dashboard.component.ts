import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable, Subscription, combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';
import { FirebaseDataService } from '../services/firebase-data.service';
import { Customer } from '../models/customer';
import { Room } from '../models/room';
import { CardModule } from 'primeng/card';
import { ChartModule } from 'primeng/chart';
import { ButtonModule } from 'primeng/button';
import { ProgressBarModule } from 'primeng/progressbar';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { TooltipModule } from 'primeng/tooltip';

interface DashboardStats {
  totalCustomers: number;
  totalRooms: number;
  occupiedRooms: number;
  availableRooms: number;
  occupancyRate: number;
  currentMonthlyRent: number;
  totalRentPotential: number;
  revenueEfficiency: number;
  averageRentPerRoom: number;
  averageCustomersPerRoom: number;
}

interface MonthlyRevenue {
  month: string;
  current: number;
  potential: number;
}

interface RoomStatusData {
  status: string;
  count: number;
  percentage: number;
  color: string;
}

interface CustomerAgeDistribution {
  range: string;
  count: number;
  percentage: number;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    CardModule,
    ChartModule,
    ButtonModule,
    ProgressBarModule,
    TableModule,
    TagModule,
    TooltipModule
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit, OnDestroy {
  customers$: Observable<Customer[]>;
  rooms$: Observable<Room[]>;
  customersList: Customer[] = [];
  roomsList: Room[] = [];
  dashboardStats: DashboardStats = {
    totalCustomers: 0,
    totalRooms: 0,
    occupiedRooms: 0,
    availableRooms: 0,
    occupancyRate: 0,
    currentMonthlyRent: 0,
    totalRentPotential: 0,
    revenueEfficiency: 0,
    averageRentPerRoom: 0,
    averageCustomersPerRoom: 0
  };

  // Chart data
  occupancyChartData: any;
  revenueChartData: any;
  roomStatusChartData: any;
  customerAgeChartData: any;
  monthlyRevenueData: MonthlyRevenue[] = [];
  roomStatusData: RoomStatusData[] = [];
  customerAgeData: CustomerAgeDistribution[] = [];

  // Recent activities
  recentCustomers: Customer[] = [];
  recentRooms: Room[] = [];

  private subscription = new Subscription();

  constructor(private dataService: FirebaseDataService) {
    this.customers$ = this.dataService.getCustomers();
    this.rooms$ = this.dataService.getRooms();
  }

  ngOnInit() {
    this.subscription.add(
      combineLatest([this.customers$, this.rooms$]).subscribe(([customers, rooms]) => {
        this.customersList = customers || [];
        this.roomsList = rooms || [];
        this.calculateDashboardStats();
        this.generateChartData();
        this.getRecentActivities();
      })
    );
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  calculateDashboardStats() {
    const totalRooms = this.roomsList.length;
    const occupiedRooms = this.roomsList.filter(room => 
      room.customers && room.customers.length > 0
    ).length;
    const availableRooms = totalRooms - occupiedRooms;
    const occupancyRate = totalRooms > 0 ? (occupiedRooms / totalRooms) * 100 : 0;
    
    const currentMonthlyRent = this.roomsList
      .filter(room => room.customers && room.customers.length > 0)
      .reduce((total, room) => total + room.rent, 0);
    
    const totalRentPotential = this.roomsList.reduce((total, room) => total + room.rent, 0);
    const revenueEfficiency = totalRentPotential > 0 ? (currentMonthlyRent / totalRentPotential) * 100 : 0;
    
    const averageRentPerRoom = totalRooms > 0 ? totalRentPotential / totalRooms : 0;
    const averageCustomersPerRoom = totalRooms > 0 ? this.customersList.length / totalRooms : 0;

    this.dashboardStats = {
      totalCustomers: this.customersList.length,
      totalRooms,
      occupiedRooms,
      availableRooms,
      occupancyRate: Math.round(occupancyRate),
      currentMonthlyRent,
      totalRentPotential,
      revenueEfficiency: Math.round(revenueEfficiency),
      averageRentPerRoom: Math.round(averageRentPerRoom),
      averageCustomersPerRoom: Math.round(averageCustomersPerRoom * 100) / 100
    };
  }

  generateChartData() {
    this.generateOccupancyChart();
    this.generateRevenueChart();
    this.generateRoomStatusChart();
    this.generateCustomerAgeChart();
    this.generateMonthlyRevenueData();
  }

  generateOccupancyChart() {
    const occupiedRooms = this.roomsList.filter(room => 
      room.customers && room.customers.length > 0
    ).length;
    const availableRooms = this.roomsList.length - occupiedRooms;

    this.occupancyChartData = {
      labels: ['Occupied', 'Available'],
      datasets: [
        {
          data: [occupiedRooms, availableRooms],
          backgroundColor: ['#667eea', '#e9ecef'],
          borderColor: ['#5a6fd8', '#dee2e6'],
          borderWidth: 2
        }
      ]
    };
  }

  generateRevenueChart() {
    const currentRevenue = this.dashboardStats.currentMonthlyRent;
    const potentialRevenue = this.dashboardStats.totalRentPotential;
    const lostRevenue = potentialRevenue - currentRevenue;

    this.revenueChartData = {
      labels: ['Current Revenue', 'Lost Revenue'],
      datasets: [
        {
          data: [currentRevenue, lostRevenue],
          backgroundColor: ['#28a745', '#dc3545'],
          borderColor: ['#20c997', '#c82333'],
          borderWidth: 2
        }
      ]
    };
  }

  generateRoomStatusChart() {
    const fullRooms = this.roomsList.filter(room => 
      room.customers && room.customers.length >= room.capacity
    ).length;
    const partialRooms = this.roomsList.filter(room => 
      room.customers && room.customers.length > 0 && room.customers.length < room.capacity
    ).length;
    const emptyRooms = this.roomsList.filter(room => 
      !room.customers || room.customers.length === 0
    ).length;

    const total = this.roomsList.length;
    
    this.roomStatusData = [
      { status: 'Full', count: fullRooms, percentage: total > 0 ? Math.round((fullRooms / total) * 100) : 0, color: '#dc3545' },
      { status: 'Partially Occupied', count: partialRooms, percentage: total > 0 ? Math.round((partialRooms / total) * 100) : 0, color: '#ffc107' },
      { status: 'Available', count: emptyRooms, percentage: total > 0 ? Math.round((emptyRooms / total) * 100) : 0, color: '#28a745' }
    ];

    this.roomStatusChartData = {
      labels: this.roomStatusData.map(item => item.status),
      datasets: [
        {
          data: this.roomStatusData.map(item => item.count),
          backgroundColor: this.roomStatusData.map(item => item.color),
          borderColor: this.roomStatusData.map(item => item.color),
          borderWidth: 2
        }
      ]
    };
  }

  generateCustomerAgeChart() {
    const ageRanges = [
      { min: 18, max: 25, label: '18-25' },
      { min: 26, max: 35, label: '26-35' },
      { min: 36, max: 45, label: '36-45' },
      { min: 46, max: 55, label: '46-55' },
      { min: 56, max: 100, label: '56+' }
    ];

    this.customerAgeData = ageRanges.map(range => {
      const count = this.customersList.filter(customer => 
        customer.age >= range.min && customer.age <= range.max
      ).length;
      const percentage = this.customersList.length > 0 ? Math.round((count / this.customersList.length) * 100) : 0;
      
      return {
        range: range.label,
        count,
        percentage
      };
    });

    this.customerAgeChartData = {
      labels: this.customerAgeData.map(item => item.range),
      datasets: [
        {
          label: 'Tenants',
          data: this.customerAgeData.map(item => item.count),
          backgroundColor: 'rgba(102, 126, 234, 0.8)',
          borderColor: '#667eea',
          borderWidth: 2,
          fill: false
        }
      ]
    };
  }

  generateMonthlyRevenueData() {
    // Generate sample monthly data (in a real app, this would come from actual payment records)
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const currentMonth = new Date().getMonth();
    
    this.monthlyRevenueData = months.map((month, index) => {
      const isCurrentOrPast = index <= currentMonth;
      const baseRevenue = this.dashboardStats.totalRentPotential;
      const currentRevenue = isCurrentOrPast ? 
        Math.round(baseRevenue * (0.7 + Math.random() * 0.3)) : 0;
      const potentialRevenue = baseRevenue;
      
      return {
        month,
        current: currentRevenue,
        potential: potentialRevenue
      };
    });
  }

  getRecentActivities() {
    // Get recent tenants (last 5)
    this.recentCustomers = this.customersList
      .sort((a, b) => new Date(b.joiningDate).getTime() - new Date(a.joiningDate).getTime())
      .slice(0, 5);

    // Get recent rooms (last 5)
    this.recentRooms = this.roomsList.slice(0, 5);
  }

  getRoomStatusColor(status: string): string {
    switch (status) {
      case 'Full': return '#dc3545';
      case 'Partially Occupied': return '#ffc107';
      case 'Available': return '#28a745';
      default: return '#6c757d';
    }
  }

  getCustomerStatus(customer: Customer): { status: string; color: string } {
    const room = this.roomsList.find(r => r.customers?.includes(customer.id));
    if (!room) return { status: 'No Room', color: '#6c757d' };
    
    if (room.customers && room.customers.length >= room.capacity) {
      return { status: 'Full Room', color: '#dc3545' };
    } else {
      return { status: 'Active', color: '#28a745' };
    }
  }

  getDaysSinceJoining(joiningDate: string): number {
    const joinDate = new Date(joiningDate);
    const today = new Date();
    const diffTime = Math.abs(today.getTime() - joinDate.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  formatCurrency(amount: number): string {
    return `₹${amount.toLocaleString()}`;
  }

  getChartOptions() {
    return {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'bottom',
          labels: {
            usePointStyle: true,
            padding: 20
          }
        }
      }
    };
  }

  // Make Math available in template
  get Math() {
    return Math;
  }
}
