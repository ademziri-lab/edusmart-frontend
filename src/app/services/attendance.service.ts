import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AttendanceService {

  private apiUrl = 'http://localhost:8080/api/attendance';

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({ Authorization: `Bearer ${token}` });
  }

  // Teacher saves attendance
  saveAttendance(attendance: any): Observable<any> {
    return this.http.post(this.apiUrl, attendance, { headers: this.getHeaders() });
  }

  // Get students by class
  getStudentsByClass(className: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/students/${className}`, { headers: this.getHeaders() });
  }

  // Get all sessions for a class
  getAttendanceByClass(className: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/class/${className}`, { headers: this.getHeaders() });
  }

  // Get student attendance summary
  getStudentSummary(studentId: string, className: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/student/${studentId}/class/${className}`, { headers: this.getHeaders() });
  }
}
