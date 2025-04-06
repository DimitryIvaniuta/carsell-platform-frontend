import { Validators } from '@angular/forms';
import { SUVCarRequest } from '../car-request.model';
import { CarExtraFieldConfig } from '../../../components/cars/car-extra-field.model';

export const suvControlConfig: CarExtraFieldConfig = {
  fieldName: 'fourWheelDrive',
  validators: [Validators.required],
  extractValue: (data: Partial<SUVCarRequest>): boolean | null => {
    if ('fourWheelDrive' in data && typeof data.fourWheelDrive === 'boolean') {
      return data.fourWheelDrive;
    }
    return null;
  }
};
