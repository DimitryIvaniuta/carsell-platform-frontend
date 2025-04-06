import {sedanCapacityControlConfig, sedanTrunkControlConfig} from './sedan.config';
import { suvControlConfig } from './suv.config';
import { truckControlConfig } from './truck.config';
import { CarTypeControlConfig } from '../../../components/cars/car-extra-field.model';

/**
 * Mapping from car type to its extra field configuration.
 */
export const CarTypeConfigMapping: Record<string, CarTypeControlConfig> = {
  SEDAN: { extraFields: [sedanTrunkControlConfig, sedanCapacityControlConfig] },
  SUV: { extraFields: [suvControlConfig] },
  TRUCK: { extraFields: [truckControlConfig] }
};
