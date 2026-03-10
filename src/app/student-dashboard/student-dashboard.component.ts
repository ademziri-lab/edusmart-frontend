import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../services/auth.service';
<<<<<<< HEAD
import { InternshipService } from '../services/internship.service';
import { ChatService } from '../services/chat.service';
import { UserService } from '../services/user.service';
=======
import { ChatService } from '../services/chat.service';
import { UserService } from '../services/user.service';
import { InternshipService } from '../services/internship.service';
import { AssignmentService } from '../services/assignment.service';
>>>>>>> friend/master

interface TimetableSlot {
  time: string;
  monday: string;
  tuesday: string;
  wednesday: string;
  thursday: string;
  friday: string;
}

<<<<<<< HEAD
interface Assignment {
  id: number;
  subject: string;
  title: string;
  dueDate: string;
  status: 'pending' | 'submitted';
}

interface InternshipRequest {
  id: string;
  studentId: string;
  studentName: string;
  company: string;
  duration: string;
  startDate: string;
  status: string;
}

=======
>>>>>>> friend/master
@Component({
  selector: 'app-student-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './student-dashboard.component.html',
  styleUrl: './student-dashboard.component.css'
})
export class StudentDashboardComponent implements OnInit {

  activeSection: string = 'timetable';
  loggedInName: string = '';
  currentUserId: string = '';
  currentUserName: string = '';
<<<<<<< HEAD
=======
  studentClass: string = 'DSI1'; // will be updated from JWT if available
>>>>>>> friend/master

  profile = {
    firstName: '',
    lastName: '',
    email: '',
    role: '',
<<<<<<< HEAD
    class: '',
    department: ''
=======
    department: '',
    class: ''
>>>>>>> friend/master
  };

  // Timetable
  timetable: TimetableSlot[] = [
<<<<<<< HEAD
    { time: '08:00 - 10:00', monday: 'Algorithms', tuesday: 'Mathematics', wednesday: '—', thursday: 'English', friday: 'Algorithms' },
    { time: '10:00 - 12:00', monday: 'Mathematics', tuesday: '—', wednesday: 'Algorithms', thursday: 'Mathematics', friday: '—' },
    { time: '14:00 - 16:00', monday: '—', tuesday: 'English', wednesday: 'Mathematics', thursday: '—', friday: 'English' },
    { time: '16:00 - 18:00', monday: 'English', tuesday: 'Algorithms', wednesday: '—', thursday: 'Algorithms', friday: 'Mathematics' },
  ];

  // Assignments
  assignments: Assignment[] = [
    { id: 1, subject: 'Algorithms', title: 'Exercise 1 — Sorting Algorithms', dueDate: '2024-10-15', status: 'pending' },
    { id: 2, subject: 'Mathematics', title: 'Problem Set 3', dueDate: '2024-10-18', status: 'submitted' },
    { id: 3, subject: 'English', title: 'Essay — Technology in Education', dueDate: '2024-10-20', status: 'pending' },
  ];

  // Internships
  internshipRequests: InternshipRequest[] = [];
=======
    { time: '08:00 - 10:00', monday: 'Algorithms', tuesday: '—', wednesday: 'Data Structures', thursday: '—', friday: 'Databases' },
    { time: '10:00 - 12:00', monday: '—', tuesday: 'Web Development', wednesday: '—', thursday: 'Algorithms', friday: '—' },
    { time: '14:00 - 16:00', monday: 'Databases', tuesday: '—', wednesday: 'Web Development', thursday: '—', friday: 'Data Structures' },
    { time: '16:00 - 18:00', monday: '—', tuesday: 'Data Structures', wednesday: '—', thursday: 'Web Development', friday: '—' },
  ];

  // Virtual Classroom
  assignments: any[] = [];
  showSubmitModal: boolean = false;
  selectedAssignment: any = null;
  submissionFile = {
    fileName: '',
    fileData: '',
    fileType: ''
  };

  // Internship
  internships: any[] = [];
>>>>>>> friend/master
  showInternshipModal: boolean = false;
  newInternship = {
    company: '',
    duration: '',
<<<<<<< HEAD
    startDate: ''
=======
    startDate: '',
    description: ''
>>>>>>> friend/master
  };

  // Chat
  teachers: any[] = [];
  selectedTeacher: string = '';
  newMessage: string = '';
  currentMessages: any[] = [];

  constructor(
    private router: Router,
<<<<<<< HEAD
    private internshipService: InternshipService,
    private authService: AuthService,
    private chatService: ChatService,
    private userService: UserService
=======
    private authService: AuthService,
    private chatService: ChatService,
    private userService: UserService,
    private internshipService: InternshipService,
    private assignmentService: AssignmentService
>>>>>>> friend/master
  ) {}

  ngOnInit() {
    this.loadCurrentUser();
<<<<<<< HEAD
    this.loadInternships();
=======
>>>>>>> friend/master
    this.loadTeachers();
  }

  loadCurrentUser() {
    const token = this.authService.getToken();
    if (token) {
      const payload = JSON.parse(atob(token.split('.')[1]));
      this.loggedInName = payload.firstName + ' ' + payload.lastName;
      this.currentUserId = payload.sub;
      this.currentUserName = payload.firstName + ' ' + payload.lastName;
      this.profile = {
        firstName: payload.firstName,
        lastName: payload.lastName,
        email: payload.sub,
        role: payload.role,
<<<<<<< HEAD
        class: payload.class || 'Not assigned yet',
        department: payload.department || 'Not assigned yet'
      };
=======
        department: payload.department || 'Not assigned yet',
        class: payload.className || 'DSI1'
      };
      this.studentClass = payload.className || 'DSI1';
>>>>>>> friend/master
      this.chatService.connect(this.currentUserId);
      this.chatService.getMessages().subscribe((message) => {
        const key = message.senderId === this.currentUserId ? message.receiverId : message.senderId;
        if (this.selectedTeacher === key || message.senderId === this.currentUserId) {
          this.currentMessages = [...this.currentMessages, message];
        }
      });
<<<<<<< HEAD
=======
      this.loadAssignments();
      this.loadInternships();
>>>>>>> friend/master
    }
  }

  loadTeachers() {
    this.userService.getTeachers().subscribe({
<<<<<<< HEAD
      next: (data) => {
        this.teachers = data;
      },
=======
      next: (data) => { this.teachers = data; },
>>>>>>> friend/master
      error: (err) => console.error('Error loading teachers:', err)
    });
  }

<<<<<<< HEAD
  loadInternships() {
    const token = this.authService.getToken();
    if (token) {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const studentEmail = payload.sub;
      this.internshipService.getInternshipsByStudent(studentEmail).subscribe({
        next: (data) => {
          this.internshipRequests = data;
        },
        error: (err) => console.error('Error loading internships:', err)
      });
    }
  }

=======
>>>>>>> friend/master
  setSection(section: string) {
    this.activeSection = section;
    if (section === 'chat' && this.selectedTeacher) {
      this.loadConversation();
    }
  }

  getSectionTitle(): string {
    switch (this.activeSection) {
      case 'timetable': return 'My Timetable';
      case 'classroom': return 'Virtual Classroom';
<<<<<<< HEAD
      case 'internship': return 'Internship Request';
      case 'chat': return 'Text My Teacher';
=======
      case 'internship': return 'Internship Requests';
      case 'chat': return 'Chat with Teachers';
>>>>>>> friend/master
      case 'profile': return 'My Profile';
      default: return 'Dashboard';
    }
  }

<<<<<<< HEAD
  // Assignments
  submitAssignment(id: number) {
    const assignment = this.assignments.find(a => a.id === id);
    if (assignment) assignment.status = 'submitted';
  }

  getPendingAssignments(): number {
    return this.assignments.filter(a => a.status === 'pending').length;
  }

  getSubmittedAssignments(): number {
    return this.assignments.filter(a => a.status === 'submitted').length;
  }

  // Internships
  openInternshipModal() {
=======
  // ─── VIRTUAL CLASSROOM ───

  loadAssignments() {
    this.assignmentService.getAssignmentsByClass(this.studentClass).subscribe({
      next: (data) => { this.assignments = data; },
      error: (err) => console.error('Error loading assignments:', err)
    });
  }

  hasSubmitted(assignment: any): boolean {
    return assignment.submissions?.some((s: any) => s.studentId === this.currentUserId);
  }

  getMySubmission(assignment: any): any {
    return assignment.submissions?.find((s: any) => s.studentId === this.currentUserId);
  }

  openSubmitModal(assignment: any) {
    this.selectedAssignment = assignment;
    this.submissionFile = { fileName: '', fileData: '', fileType: '' };
    this.showSubmitModal = true;
  }

  closeSubmitModal() {
    this.showSubmitModal = false;
    this.selectedAssignment = null;
  }

  onSubmissionFileSelected(event: any) {
    const file = event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const base64 = (reader.result as string).split(',')[1];
      this.submissionFile.fileData = base64;
      this.submissionFile.fileName = file.name;
      this.submissionFile.fileType = file.name.endsWith('.pdf') ? 'pdf' : 'docx';
    };
    reader.readAsDataURL(file);
  }

  submitAssignment() {
    if (!this.submissionFile.fileData) return;
    const submission = {
      studentId: this.currentUserId,
      studentName: this.currentUserName,
      fileName: this.submissionFile.fileName,
      fileData: this.submissionFile.fileData,
      fileType: this.submissionFile.fileType
    };
    this.assignmentService.submitAssignment(this.selectedAssignment.id, submission).subscribe({
      next: () => {
        this.loadAssignments();
        this.closeSubmitModal();
      },
      error: (err) => console.error('Error submitting assignment:', err)
    });
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

  // ─── INTERNSHIP ───

  loadInternships() {
    this.internshipService.getInternshipsByStudent(this.currentUserId).subscribe({
      next: (data) => { this.internships = data; },
      error: (err) => console.error('Error loading internships:', err)
    });
  }

  openInternshipModal() {
    this.newInternship = { company: '', duration: '', startDate: '', description: '' };
>>>>>>> friend/master
    this.showInternshipModal = true;
  }

  closeInternshipModal() {
    this.showInternshipModal = false;
<<<<<<< HEAD
    this.newInternship = { company: '', duration: '', startDate: '' };
  }

  submitInternshipRequest() {
    if (!this.newInternship.company || !this.newInternship.duration || !this.newInternship.startDate) {
      return;
    }
    const token = this.authService.getToken();
    const payload = JSON.parse(atob(token!.split('.')[1]));
    const internship = {
      studentId: payload.sub,
      studentName: payload.firstName + ' ' + payload.lastName,
      company: this.newInternship.company,
      duration: this.newInternship.duration,
      startDate: this.newInternship.startDate
    };
    this.internshipService.submitInternship(internship).subscribe({
=======
  }

  submitInternship() {
    if (!this.newInternship.company || !this.newInternship.duration) return;
    const payload = {
      ...this.newInternship,
      studentId: this.currentUserId,
      studentName: this.currentUserName
    };
    this.internshipService.submitInternship(payload).subscribe({
>>>>>>> friend/master
      next: () => {
        this.loadInternships();
        this.closeInternshipModal();
      },
      error: (err) => console.error('Error submitting internship:', err)
    });
  }

<<<<<<< HEAD
  getApprovedInternships(): number {
    return this.internshipRequests.filter(r => r.status === 'APPROVED').length;
  }

  // Chat
=======
  // ─── CHAT ───

>>>>>>> friend/master
  getChatMessages(): any[] {
    return this.currentMessages;
  }

<<<<<<< HEAD
  onTeacherSelected() {
    this.loadConversation();
  }

  loadConversation() {
    if (!this.selectedTeacher) return;
    this.chatService.getConversation(this.currentUserId, this.selectedTeacher).subscribe({
      next: (messages) => {
        this.currentMessages = messages;
      },
      error: (err) => console.error('Error loading conversation:', err)
    });
  }

=======
>>>>>>> friend/master
  sendMessage() {
    if (!this.newMessage.trim() || !this.selectedTeacher) return;
    const message = {
      senderId: this.currentUserId,
      senderName: this.currentUserName,
      receiverId: this.selectedTeacher,
      receiverName: this.selectedTeacher,
      content: this.newMessage.trim()
    };
    this.chatService.sendMessage(message);
    this.newMessage = '';
  }

<<<<<<< HEAD
  logout() {
    this.authService.logout();
  }
}
=======
  onTeacherSelected() {
    this.loadConversation();
  }

  loadConversation() {
    if (!this.selectedTeacher) return;
    this.chatService.getConversation(this.currentUserId, this.selectedTeacher).subscribe({
      next: (messages) => { this.currentMessages = messages; },
      error: (err) => console.error('Error loading conversation:', err)
    });
  }

  logout() {
    this.authService.logout();
  }
  getSubmittedCount(): number {
  return this.assignments.filter(a => this.hasSubmitted(a)).length;
}

getPendingCount(): number {
  return this.assignments.filter(a => !this.hasSubmitted(a)).length;
}

getApprovedInternships(): number {
  return this.internships.filter(i => i.status === 'APPROVED').length;
}
}
>>>>>>> friend/master
