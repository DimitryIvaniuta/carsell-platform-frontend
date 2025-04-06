import { Validators } from '@angular/forms';
import { CarExtraFieldConfig } from '../../../components/cars/car-extra-field.model';
import { TruckCarRequest } from '../car-request.model';

export const truckControlConfig: CarExtraFieldConfig = {
  fieldName: 'payloadCapacity',
  validators: [Validators.required],
  extractValue: (data: Partial<TruckCarRequest>): number | null => {
    if ('payloadCapacity' in data && typeof data.payloadCapacity === 'number') {
      return data.payloadCapacity;
    }
    return null;
  }
};
