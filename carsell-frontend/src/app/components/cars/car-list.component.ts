import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { CarService } from '../../services/car.service';
import { CarDialogComponent } from './car-dialog.component';

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

  openCarDialog(car?: any): void {
    const dialogRef = this.dialog.open(CarDialogComponent, {
      width: '400px',
      data: car ? { ...car } : {}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (result.id) {
          this.carService.updateCar(result.id, result).subscribe({
            next: () => this.loadCars(),
            error: (err) => console.error(err)
          });
        } else {
          this.carService.createCar(result).subscribe({
            next: () => this.loadCars(),
            error: (err) => console.error(err)
          });
        }
      }
    });
  }
}
