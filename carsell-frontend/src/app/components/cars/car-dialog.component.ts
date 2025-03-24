import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-car-dialog',
  templateUrl: './car-dialog.component.html'
})
export class CarDialogComponent {
  carForm: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<CarDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder
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
      trunkCapacity: [data.trunkCapacity]  // Optional field for SEDAN
    });
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  onSubmit() {
    if (this.carForm.valid) {
      this.dialogRef.close(this.carForm.value);
    }
  }
}
