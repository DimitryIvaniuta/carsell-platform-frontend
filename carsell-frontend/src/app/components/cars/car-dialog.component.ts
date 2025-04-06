import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { CarAddRequest } from '../../models/cars/car-request.model';
import { CarTypeConfigMapping } from '../../models/cars/configuration/car-type.config';
import { CarExtraFieldConfig } from './car-extra-field.model';

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
  carForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<CarDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Partial<CarAddRequest>
  ) {}

  ngOnInit(): void {
    // Determine the car type; default to 'SEDAN' if not provided.
    const carType = this.data['@type'] || 'SEDAN';

    this.carForm = this.fb.group({
      "@type": [carType, Validators.required],
      make: [this.data.make, Validators.required],
      model: [this.data.model, Validators.required],
      year: [this.data.year, [Validators.required, Validators.min(1900)]],
      price: [this.data.price, [Validators.required, Validators.min(0)]],
      description: [this.data.description],
    });
    // Lookup extra control configuration for this car type.
    const config = CarTypeConfigMapping[carType];
    if (config && config.extraFields) {
      config.extraFields.forEach((fieldConfig: CarExtraFieldConfig)=> {
        this.carForm.addControl(
          fieldConfig.fieldName,
          this.fb.control(fieldConfig.extractValue, fieldConfig.validators)
        );
      });
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSubmit(): void {
    if (this.carForm.valid) {
      this.dialogRef.close(this.carForm.value as CarAddRequest);
    }
  }
}
