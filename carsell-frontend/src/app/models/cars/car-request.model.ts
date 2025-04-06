/**
 * The "@type" field is used by Jackson for polymorphic deserialization.
 */
export interface BaseCarRequest {
  /** The discriminator property. Must be set to one of the supported types (e.g. "SEDAN", "SUV", "TRUCK"). */
  "@type": string;
  /** Car manufacturer */
  make: string;
  /** Car model */
  model: string;
  /** Production year */
  year: number;
  /** Price as a number (matching BigDecimal on the backend) */
  price: number;
  /** Optional description */
  description?: string;
}

/** Request for adding a Sedan. */
export interface SedanCarRequest extends BaseCarRequest {
  /** Sedan-specific property */
  trunkCapacity: number;
  sedanCapacity: number;
}

/** Request for adding an SUV. */
export interface SUVCarRequest extends BaseCarRequest {
  /** SUV-specific property */
  fourWheelDrive: boolean;
}

/** Request for adding a Truck. */
export interface TruckCarRequest extends BaseCarRequest {
  /** Truck-specific property */
  payloadCapacity: number;
}

/**
 * Define a union type for adding a car.
 * Depending on the selected car type, one of these subtypes is sent.
 */
export type CarAddRequest = SedanCarRequest | SUVCarRequest | TruckCarRequest;

/**
 * Update requests extend their add counterpart by including an "id" field.
 */
export interface SedanCarUpdateRequest extends SedanCarRequest {
  id: number;
}

export interface SUVCarUpdateRequest extends SUVCarRequest {
  id: number;
}

export interface TruckCarUpdateRequest extends TruckCarRequest {
  id: number;
}

/**
 * Union type for updating a car.
 */
export type CarUpdateRequest = SedanCarUpdateRequest | SUVCarUpdateRequest | TruckCarUpdateRequest;

/**
 * For convenience, you can define a union type that covers both adding and updating.
 */
export type CarRequest = CarAddRequest | CarUpdateRequest;
