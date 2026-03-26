import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { ChatService } from '../services/chat.service';
import { UserService } from '../services/user.service';
import { AssignmentService } from '../services/assignment.service';
import { CollegeClassService } from '../services/college-class.service';
import { AttendanceService } from '../services/attendance.service';

interface TimetableSlot {
  time: string;
  monday: string;
  tuesday: string;
  wednesday: string;
  thursday: string;
  friday: string;
}

@Component({
  selector: 'app-teacher-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './teacher-dashboard.component.html',
  styleUrl: './teacher-dashboard.component.css'
})
export class TeacherDashboardComponent implements OnInit {

  activeSection: string = 'timetable';
  loggedInName: string = '';
  currentUserId: string = '';
  currentUserName: string = '';
  teacherId: string = '';
  assignedClasses: string[] = [];

  profile = {
    firstName: '',
    lastName: '',
    email: '',
    role: '',
    department: '',
    subjects: ''
  };

  // Timetable
  classes: any[] = [];
  selectedTimetableDepartment: string = '';
  selectedTimetableClass: string = '';

  timetables: { [key: string]: any[] } = {
    'DSI1': [
      { time: '08:00 - 10:00', monday: 'DSI1 — Algorithms', tuesday: '—', wednesday: 'DSI1 — Data Structures', thursday: '—', friday: 'DSI1 — Databases' },
      { time: '10:00 - 12:00', monday: '—', tuesday: 'DSI1 — Web Development', wednesday: '—', thursday: 'DSI1 — Algorithms', friday: '—' },
      { time: '14:00 - 16:00', monday: 'DSI1 — Databases', tuesday: '—', wednesday: 'DSI1 — Web Development', thursday: '—', friday: 'DSI1 — Data Structures' },
      { time: '16:00 - 18:00', monday: '—', tuesday: 'DSI1 — Data Structures', wednesday: '—', thursday: 'DSI1 — Web Development', friday: '—' },
    ],
    'DSI2': [
      { time: '08:00 - 10:00', monday: 'DSI2 — Software Engineering', tuesday: '—', wednesday: 'DSI2 — Networks', thursday: '—', friday: 'DSI2 — Algorithms' },
      { time: '10:00 - 12:00', monday: '—', tuesday: 'DSI2 — Algorithms', wednesday: '—', thursday: 'DSI2 — Software Engineering', friday: '—' },
      { time: '14:00 - 16:00', monday: 'DSI2 — Networks', tuesday: '—', wednesday: 'DSI2 — Databases', thursday: '—', friday: 'DSI2 — Software Engineering' },
      { time: '16:00 - 18:00', monday: '—', tuesday: 'DSI2 — Databases', wednesday: '—', thursday: 'DSI2 — Networks', friday: '—' },
    ],
    'DSI3': [
      { time: '08:00 - 10:00', monday: 'DSI3 — AI', tuesday: '—', wednesday: 'DSI3 — Cloud Computing', thursday: '—', friday: 'DSI3 — Security' },
      { time: '10:00 - 12:00', monday: '—', tuesday: 'DSI3 — Security', wednesday: '—', thursday: 'DSI3 — AI', friday: '—' },
      { time: '14:00 - 16:00', monday: 'DSI3 — Cloud Computing', tuesday: '—', wednesday: 'DSI3 — AI', thursday: '—', friday: 'DSI3 — Cloud Computing' },
      { time: '16:00 - 18:00', monday: '—', tuesday: 'DSI3 — Cloud Computing', wednesday: '—', thursday: 'DSI3 — Security', friday: '—' },
    ],
    'GL1': [
      { time: '08:00 - 10:00', monday: 'GL1 — UML', tuesday: '—', wednesday: 'GL1 — Java EE', thursday: '—', friday: 'GL1 — Design Patterns' },
      { time: '10:00 - 12:00', monday: '—', tuesday: 'GL1 — Design Patterns', wednesday: '—', thursday: 'GL1 — UML', friday: '—' },
      { time: '14:00 - 16:00', monday: 'GL1 — Java EE', tuesday: '—', wednesday: 'GL1 — UML', thursday: '—', friday: 'GL1 — Java EE' },
      { time: '16:00 - 18:00', monday: '—', tuesday: 'GL1 — Java EE', wednesday: '—', thursday: 'GL1 — Design Patterns', friday: '—' },
    ]
  };

  get timetableDepartments(): string[] {
    return [...new Set(this.classes.map((c: any) => c.department))];
  }

  get filteredTimetableClasses(): any[] {
    const base = this.selectedTimetableDepartment
      ? this.classes.filter((c: any) => c.department === this.selectedTimetableDepartment)
      : this.classes;
    if (this.assignedClasses.length > 0) {
      return base.filter((c: any) => this.assignedClasses.includes(c.name));
    }
    return base;
  }

  getCurrentTimetable(): any[] {
    if (!this.selectedTimetableClass) return [];
    return this.timetables[this.selectedTimetableClass] || [];
  }

  // Virtual Classroom
  assignments: any[] = [];
  showAddAssignmentModal: boolean = false;
  showSubmissionsModal: boolean = false;
  selectedAssignment: any = null;
  gradeInputs: { [studentId: string]: number } = {};

  newAssignment = {
    title: '',
    subject: '',
    className: '',
    dueDate: '',
    description: '',
    fileName: '',
    fileData: '',
    fileType: ''
  };
  // Attendance
showAttendanceModal: boolean = false;
attendanceClass: string = '';
attendanceSubject: string = '';
attendanceStudents: any[] = [];
attendanceSaving: boolean = false;
  // Chat
  students: any[] = [];
  selectedStudent: string = '';
  newMessage: string = '';
  currentMessages: any[] = [];

  constructor(
    private router: Router,
    private chatService: ChatService,
    private authService: AuthService,
    private userService: UserService,
    private assignmentService: AssignmentService,
    private classService: CollegeClassService,
    private attendanceService: AttendanceService
  ) {}

  ngOnInit() {
    this.loadCurrentUser();
    this.loadStudents();
    this.loadClasses();
  }

  loadCurrentUser() {
    const token = this.authService.getToken();
    if (token) {
      const payload = JSON.parse(atob(token.split('.')[1]));
      this.loggedInName = payload.firstName + ' ' + payload.lastName;
      this.currentUserId = payload.sub;
      this.currentUserName = payload.firstName + ' ' + payload.lastName;
      this.teacherId = payload.sub;
      this.assignedClasses = payload.assignedClasses || [];
      this.profile = {
        firstName: payload.firstName,
        lastName: payload.lastName,
        email: payload.sub,
        role: payload.role,
        department: payload.department || 'Not assigned yet',
        subjects: payload.subjects || 'Not assigned yet'
      };
      this.chatService.connect(this.currentUserId);
      this.chatService.getMessages().subscribe((message) => {
        const key = message.senderId === this.currentUserId ? message.receiverId : message.senderId;
        if (this.selectedStudent === key || message.senderId === this.currentUserId) {
          this.currentMessages = [...this.currentMessages, message];
        }
      });
      this.loadAssignments();
    }
  }

  loadStudents() {
    this.userService.getStudents().subscribe({
      next: (data) => { this.students = data; },
      error: (err) => console.error('Error loading students:', err)
    });
  }

  loadClasses() {
    this.classService.getAllClasses().subscribe({
      next: (data: any[]) => { this.classes = data; },
      error: (err: any) => console.error('Error loading classes:', err)
    });
  }

  setSection(section: string) {
    this.activeSection = section;
    if (section === 'chat' && this.selectedStudent) {
      this.loadConversation();
    }
  }

  getSectionTitle(): string {
    switch (this.activeSection) {
      case 'timetable': return 'My Timetable';
      case 'classroom': return 'Virtual Classroom';
      case 'chat': return 'Chat with Students';
      case 'profile': return 'My Profile';
      case 'attendance': return 'Attendance';
      default: return 'Dashboard';

    }
  }

  // ─── VIRTUAL CLASSROOM ───

  loadAssignments() {
    this.assignmentService.getAssignmentsByTeacher(this.teacherId).subscribe({
      next: (data) => { this.assignments = data; },
      error: (err) => console.error('Error loading assignments:', err)
    });
  }

  openAddAssignmentModal() {
    this.newAssignment = { title: '', subject: '', className: '', dueDate: '', description: '', fileName: '', fileData: '', fileType: '' };
    this.showAddAssignmentModal = true;
  }

  closeAddAssignmentModal() {
    this.showAddAssignmentModal = false;
  }

  onAssignmentFileSelected(event: any) {
    const file = event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const base64 = (reader.result as string).split(',')[1];
      this.newAssignment.fileData = base64;
      this.newAssignment.fileName = file.name;
      this.newAssignment.fileType = file.name.endsWith('.pdf') ? 'pdf' : 'docx';
    };
    reader.readAsDataURL(file);
  }

  postAssignment() {
    if (!this.newAssignment.title || !this.newAssignment.className) return;
    const payload = {
      ...this.newAssignment,
      teacherId: this.teacherId,
      teacherName: this.loggedInName
    };
    this.assignmentService.createAssignment(payload).subscribe({
      next: () => {
        this.loadAssignments();
        this.closeAddAssignmentModal();
      },
      error: (err) => console.error('Error posting assignment:', err)
    });
  }

  deleteAssignment(id: string) {
    if (!confirm('Delete this assignment?')) return;
    this.assignmentService.deleteAssignment(id).subscribe({
      next: () => { this.loadAssignments(); },
      error: (err) => console.error('Error deleting assignment:', err)
    });
  }

  viewSubmissions(assignment: any) {
    this.selectedAssignment = assignment;
    this.gradeInputs = {};
    this.showSubmissionsModal = true;
  }

  closeSubmissionsModal() {
    this.showSubmissionsModal = false;
    this.selectedAssignment = null;
    this.gradeInputs = {};
  }

  downloadFile(fileData: string, fileName: string, fileType: string) {
    const byteArray = Uint8Array.from(atob(fileData), c => c.charCodeAt(0));
    const blob = new Blob([byteArray], {
      type: fileType === 'pdf' ? 'application/pdf' : 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    a.click();
    window.URL.revokeObjectURL(url);
  }

  gradeSubmission(assignmentId: string, studentId: string) {
    const grade = this.gradeInputs[studentId];
    if (grade === undefined || grade === null) return;
    this.assignmentService.gradeSubmission(assignmentId, studentId, grade).subscribe({
      next: () => {
        this.loadAssignments();
        this.closeSubmissionsModal();
      },
      error: (err) => console.error('Error grading submission:', err)
    });
  }

  getTotalSubmissions(): number {
    return this.assignments.reduce((t, a) => t + (a.submissions?.length || 0), 0);
  }

  getSubmissionStatus(assignment: any): string {
    return assignment.submissions?.length + ' / ? submitted';
  }
  // ─── ATTENDANCE ───

openAttendanceModal() {
  this.attendanceClass = '';
  this.attendanceSubject = '';
  this.attendanceStudents = [];
  this.showAttendanceModal = true;
}

closeAttendanceModal() {
  this.showAttendanceModal = false;
  this.attendanceStudents = [];
}

loadAttendanceStudents() {
  if (!this.attendanceClass) return;
  this.attendanceService.getStudentsByClass(this.attendanceClass).subscribe({
    next: (data) => {
      this.attendanceStudents = data.map(s => ({
        ...s,
        present: true
      }));
    },
    error: (err) => console.error('Error loading students:', err)
  });
}

toggleAttendance(studentId: string) {
  const student = this.attendanceStudents.find(s => s.id === studentId);
  if (student) student.present = !student.present;
}

saveAttendance() {
  if (!this.attendanceClass || !this.attendanceSubject || this.attendanceStudents.length === 0) return;
  this.attendanceSaving = true;

  const payload = {
    teacherId: this.teacherId,
    teacherName: this.loggedInName,
    className: this.attendanceClass,
    subject: this.attendanceSubject,
    records: this.attendanceStudents.map(s => ({
      studentId: s.id,
      studentName: s.firstName + ' ' + s.lastName,
      present: s.present
    }))
  };

  this.attendanceService.saveAttendance(payload).subscribe({
    next: () => {
      this.attendanceSaving = false;
      this.closeAttendanceModal();
    },
    error: (err) => {
      console.error('Error saving attendance:', err);
      this.attendanceSaving = false;
    }
  });
}

getPresentCount(): number {
  return this.attendanceStudents.filter(s => s.present).length;
}

getAbsentCount(): number {
  return this.attendanceStudents.filter(s => !s.present).length;
}

  // ─── CHAT ───

  getChatMessages(): any[] {
    return this.currentMessages;
  }

  sendMessage() {
  if (!this.newMessage.trim() || !this.selectedStudent) return;
  const message = {
    senderId: this.currentUserId,
    senderName: this.currentUserName,
    receiverId: this.selectedStudent,
    receiverName: this.selectedStudent,
    content: this.newMessage.trim()
  };
  // Add message to UI instantly
  this.currentMessages = [...this.currentMessages, {
    ...message,
    timestamp: new Date().toISOString()
  }];
  this.chatService.sendMessage(message);
  this.newMessage = '';
}

  onStudentSelected() {
    this.loadConversation();
  }

  loadConversation() {
    if (!this.selectedStudent) return;
    this.chatService.getConversation(this.currentUserId, this.selectedStudent).subscribe({
      next: (messages) => { this.currentMessages = messages; },
      error: (err) => console.error('Error loading conversation:', err)
    });
  }

  logout() {
    this.authService.logout();
  }
}
