import { Validators } from '@angular/forms';
import { SedanCarRequest } from '../car-request.model';
import { CarExtraFieldConfig } from '../../../components/cars/car-extra-field.model';

export const sedanTrunkControlConfig: CarExtraFieldConfig = {
  fieldName: 'trunkCapacity',
  validators: [Validators.required],
  extractValue: (data: Partial<SedanCarRequest>): number | null => {
    if ('trunkCapacity' in data && typeof data.trunkCapacity === 'number') {
      return data.trunkCapacity;
    }
    return null;
  }
};

export const sedanCapacityControlConfig: CarExtraFieldConfig = {
  fieldName: 'sedanCapacity',
  validators: [Validators.required],
  extractValue: (data: Partial<SedanCarRequest>): number | null => {
    if ('sedanCapacity' in data && typeof data.sedanCapacity === 'number') {
      return data.sedanCapacity;
    }
    return null;
  }
};
