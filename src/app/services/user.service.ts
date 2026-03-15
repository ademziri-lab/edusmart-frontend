import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private apiUrl = 'http://localhost:8080/api/users';

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({ Authorization: `Bearer ${token}` });
  }

  getTeachers(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/teachers`, { headers: this.getHeaders() });
  }

  getStudents(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/students`, { headers: this.getHeaders() });
  }

  // Assign one class to a student
  assignClassToStudent(userId: string, className: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/${userId}/assign-class`,
      { className },
      { headers: this.getHeaders() }
    );
  }

  // Assign multiple classes to a teacher
  assignClassesToTeacher(userId: string, assignedClasses: string[]): Observable<any> {
    return this.http.put(`${this.apiUrl}/${userId}/assign-classes`,
      { assignedClasses },
      { headers: this.getHeaders() }
    );
  }
}