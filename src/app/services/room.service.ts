import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RoomService {

  private apiUrl = 'http://localhost:8080/api/rooms';

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({ Authorization: `Bearer ${token}` });
  }

  getAllRooms(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl, { headers: this.getHeaders() });
  }

  addRoom(room: any): Observable<any> {
    return this.http.post(this.apiUrl, room, { headers: this.getHeaders() });
  }

  updateRoom(id: string, room: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, room, { headers: this.getHeaders() });
  }

  deleteRoom(id: string): Observable<string> {
    return this.http.delete(`${this.apiUrl}/${id}`, { headers: this.getHeaders(), responseType: 'text' });
  }
}