import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { CarService } from '../../services/car.service';
import { CarDialogComponent } from './car-dialog.component';
import { CarAddRequest, CarRequest, CarUpdateRequest } from '../../models/cars/car-request.model';
import { CarResponse } from '../../models/cars/car-response.model';

@Component({
  selector: 'app-car-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatToolbarModule,
    MatTableModule,
    MatButtonModule,
    MatDialogModule
  ],
  templateUrl: './car-list.component.html',
  styleUrls: ['./car-list.component.css']
})
export class CarListComponent implements OnInit {
  cars: any[] = [];
  displayedColumns: string[] = ['id', 'make', 'model', 'year', 'price', 'actions'];
  defaultCar: CarAddRequest = {
    "@type": "SEDAN",
    make: 'Toyota',
    model: 'Camry',
    year: new Date().getFullYear(),
    price: 12123,
    description: 'test',
    trunkCapacity: 3,
    sedanCapacity: 5
  };
  constructor(private carService: CarService, public dialog: MatDialog) {}

  ngOnInit(): void {
    this.loadCars();
  }

  loadCars(): void {
    this.carService.getCars().subscribe({
      next: (data) => this.cars = data,
      error: (err) => console.error(err)
    });
  }

  deleteCar(id: number): void {
    if (confirm('Are you sure you want to delete this car?')) {
      this.carService.deleteCar(id).subscribe({
        next: () => this.loadCars(),
        error: (err) => console.error(err)
      });
    }
  }

  openCarDialog(car?: CarResponse | CarRequest): void {
    // If no car is provided, assume adding a new car.
    const dialogData: CarRequest = car ? car as CarRequest : this.defaultCar;
    const dialogRef = this.dialog.open(CarDialogComponent, {
      width: '400px',
      data: dialogData
    });

    dialogRef.afterClosed().subscribe((result: CarRequest | undefined) => {
      if (result) {
        if (this.isUpdateRequest(result)) {
          // For update, call updateCar using the update type (which includes an id).
          this.carService.updateCar(result.id, result as CarUpdateRequest).subscribe({
            next: () => this.loadCars(),
            error: (err) => console.error(err)
          });
        } else {
          // For new car, call createCar.
          this.carService.createCar(result).subscribe({
            next: () => this.loadCars(),
            error: (err) => console.error(err)
          });
        }
      }
    });
  }


  /**
   * Type guard to check if the car request is an update request.
   */
  private isUpdateRequest(car: CarRequest): car is CarUpdateRequest {
    return (car as CarUpdateRequest).id !== undefined;
  }

}
