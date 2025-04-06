/**
 * BaseCarResponse mirrors your backend's BaseCarResponse record.
 */
export interface BaseCarResponse {
  id: number;
  make: string;
  model: string;
  year: number;
  price: number;
  description?: string;
}

/** Response for a Sedan car. */
export interface SedanCarResponse {
  base: BaseCarResponse;
  trunkCapacity: number;
}

/** Response for an SUV car. */
export interface SUVCarResponse {
  base: BaseCarResponse;
  fourWheelDrive: boolean;
}

/** Response for a Truck. */
export interface TruckCarResponse {
  base: BaseCarResponse;
  payloadCapacity: number;
}

/**
 * Union type for the car response.
 */
export type CarResponse = SedanCarResponse | SUVCarResponse | TruckCarResponse;
