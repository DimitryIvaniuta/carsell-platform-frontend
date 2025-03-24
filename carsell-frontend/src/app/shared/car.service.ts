import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CarService {
  private apiUrl = '/api/cars';

  constructor(private http: HttpClient) { }

  getCars(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  getCar(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  createCar(car: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, car);
  }

  updateCar(id: number, car: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, car);
  }

  deleteCar(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }
}
