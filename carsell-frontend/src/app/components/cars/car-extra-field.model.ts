import { ValidatorFn } from '@angular/forms';
import { CarAddRequest } from '../../models/cars/car-request.model';

/** Extra field values can be numbers, booleans, or even strings if needed. */
export type ExtraValue = number | boolean | string;

/**
 * Represents the configuration for a single extra form control.
 */
export interface CarExtraFieldConfig {
  /** The name of the extra field (e.g., "trunkCapacity"). */
  fieldName: string;
  /** Validators to apply to this control. */
  validators: ValidatorFn[];
  /**
   * Extracts the extra value from a partial CarAddRequest.
   * Returns the value if present and of the correct type, otherwise null.
   */
  extractValue: (data: Partial<CarAddRequest>) => ExtraValue | null;
}

/**
 * Represents the extra fields configuration for a given car type.
 */
export interface CarTypeControlConfig {
  /** A list of extra fields that should be added to the form. */
  extraFields: CarExtraFieldConfig[];
}
