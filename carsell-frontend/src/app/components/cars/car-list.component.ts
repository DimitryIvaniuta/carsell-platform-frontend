import { Component, OnInit } from '@angular/core';
import { CarService } from '../../shared/car.service';
import { MatDialog } from '@angular/material/dialog';
import { CarDialogComponent } from './car-dialog.component';

@Component({
  selector: 'app-car-list',
  templateUrl: './car-list.component.html',
  styleUrls: ['./car-list.component.css']
})
export class CarListComponent implements OnInit {
  cars: any[] = [];
  displayedColumns: string[] = ['id', 'make', 'model', 'year', 'price', 'actions'];

  constructor(private carService: CarService, public dialog: MatDialog) { }

  ngOnInit() {
    this.loadCars();
  }

  loadCars() {
    this.carService.getCars().subscribe({
      next: (data: any[]) => this.cars = data,
      error: err => console.error(err)
    });
  }

  deleteCar(id: number) {
    if (confirm('Are you sure you want to delete this car?')) {
      this.carService.deleteCar(id).subscribe({
        next: () => this.loadCars(),
        error: err => console.error(err)
      });
    }
  }

  openCarDialog(car?: any) {
    const dialogRef = this.dialog.open(CarDialogComponent, {
      width: '400px',
      data: car ? { ...car } : {}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (result.id) {
          // Update existing car
          this.carService.updateCar(result.id, result).subscribe({
            next: () => this.loadCars(),
            error: err => console.error(err)
          });
        } else {
          // Create new car
          this.carService.createCar(result).subscribe({
            next: () => this.loadCars(),
            error: err => console.error(err)
          });
        }
      }
    });
  }
}
