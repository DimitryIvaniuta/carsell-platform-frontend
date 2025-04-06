import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CarResponse } from '../models/cars/car-response.model';
import { CarAddRequest } from '../models/cars/car-request.model';

@Injectable({
  providedIn: 'root'
})
export class CarService {
  private apiUrl = '/api/cars';

  constructor(private http: HttpClient) {}

  getCars(): Observable<CarResponse[]> {
    return this.http.get<CarResponse[]>(this.apiUrl);
  }

  getCar(id: number): Observable<CarResponse> {
    return this.http.get<CarResponse>(`${this.apiUrl}/${id}`);
  }

  createCar(car: CarAddRequest): Observable<CarResponse> {
    return this.http.post<CarResponse>(this.apiUrl, car);
  }

  updateCar(id: number, car: CarAddRequest): Observable<CarResponse> {
    return this.http.put<CarResponse>(`${this.apiUrl}/${id}`, car);
  }

  deleteCar(id: number): Observable<CarResponse> {
    return this.http.delete<CarResponse>(`${this.apiUrl}/${id}`);
  }
}
