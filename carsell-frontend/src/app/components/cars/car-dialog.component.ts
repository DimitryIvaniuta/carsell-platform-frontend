import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-car-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule
  ],
  templateUrl: './car-dialog.component.html',
  styleUrls: ['./car-dialog.component.css']
})
export class CarDialogComponent {
  carForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<CarDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.carForm = this.fb.group({
      id: [data.id],
      '@type': [data['@type'] || 'SEDAN', Validators.required],
      make: [data.make, Validators.required],
      model: [data.model, Validators.required],
      year: [data.year, [Validators.required, Validators.min(1900)]],
      price: [data.price, [Validators.required, Validators.min(0)]],
      sellerId: [data.sellerId],
      description: [data.description],
      trunkCapacity: [data.trunkCapacity]
    });
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSubmit(): void {
    if (this.carForm.valid) {
      this.dialogRef.close(this.carForm.value);
    }
  }
}
