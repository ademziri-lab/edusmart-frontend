import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { ChatService } from '../services/chat.service';
import { UserService } from '../services/user.service';
import { InternshipService } from '../services/internship.service';
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
  studentClass: string = '';
  mongoUserId: string = '';

  profile = {
    firstName: '',
    lastName: '',
    email: '',
    role: '',
    department: '',
    class: ''
  };

  // Timetable
  timetables: { [key: string]: any[] } = {
    'DSI1': [
      { time: '08:00 - 10:00', monday: 'Algorithms', tuesday: '—', wednesday: 'Data Structures', thursday: '—', friday: 'Databases' },
      { time: '10:00 - 12:00', monday: '—', tuesday: 'Web Development', wednesday: '—', thursday: 'Algorithms', friday: '—' },
      { time: '14:00 - 16:00', monday: 'Databases', tuesday: '—', wednesday: 'Web Development', thursday: '—', friday: 'Data Structures' },
      { time: '16:00 - 18:00', monday: '—', tuesday: 'Data Structures', wednesday: '—', thursday: 'Web Development', friday: '—' },
    ],
    'DSI2': [
      { time: '08:00 - 10:00', monday: 'Software Engineering', tuesday: '—', wednesday: 'Networks', thursday: '—', friday: 'Algorithms' },
      { time: '10:00 - 12:00', monday: '—', tuesday: 'Algorithms', wednesday: '—', thursday: 'Software Engineering', friday: '—' },
      { time: '14:00 - 16:00', monday: 'Networks', tuesday: '—', wednesday: 'Databases', thursday: '—', friday: 'Software Engineering' },
      { time: '16:00 - 18:00', monday: '—', tuesday: 'Databases', wednesday: '—', thursday: 'Networks', friday: '—' },
    ],
    'DSI3': [
      { time: '08:00 - 10:00', monday: 'AI', tuesday: '—', wednesday: 'Cloud Computing', thursday: '—', friday: 'Security' },
      { time: '10:00 - 12:00', monday: '—', tuesday: 'Security', wednesday: '—', thursday: 'AI', friday: '—' },
      { time: '14:00 - 16:00', monday: 'Cloud Computing', tuesday: '—', wednesday: 'AI', thursday: '—', friday: 'Cloud Computing' },
      { time: '16:00 - 18:00', monday: '—', tuesday: 'Cloud Computing', wednesday: '—', thursday: 'Security', friday: '—' },
    ],
    'GL1': [
      { time: '08:00 - 10:00', monday: 'UML', tuesday: '—', wednesday: 'Java EE', thursday: '—', friday: 'Design Patterns' },
      { time: '10:00 - 12:00', monday: '—', tuesday: 'Design Patterns', wednesday: '—', thursday: 'UML', friday: '—' },
      { time: '14:00 - 16:00', monday: 'Java EE', tuesday: '—', wednesday: 'UML', thursday: '—', friday: 'Java EE' },
      { time: '16:00 - 18:00', monday: '—', tuesday: 'Java EE', wednesday: '—', thursday: 'Design Patterns', friday: '—' },
    ]
  };

  getCurrentTimetable(): any[] {
    if (!this.selectedTimetableClass) return [];
    return this.timetables[this.selectedTimetableClass] || [];
  }
  // Attendance
attendanceSummary: any[] = [];
  // Classes
  classes: any[] = [];
  selectedTimetableDepartment: string = '';
  selectedTimetableClass: string = '';

  get timetableDepartments(): string[] {
    return [...new Set(this.classes.map((c: any) => c.department))];
  }

  get filteredTimetableClasses(): any[] {
    if (!this.selectedTimetableDepartment) return this.classes;
    return this.classes.filter((c: any) => c.department === this.selectedTimetableDepartment);
  }

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
  showInternshipModal: boolean = false;
  newInternship = {
    company: '',
    duration: '',
    startDate: '',
    description: ''
  };

  // Chat
  teachers: any[] = [];
  selectedTeacher: string = '';
  newMessage: string = '';
  currentMessages: any[] = [];

  // AI Assistant
aiMessages: { role: string; content: string }[] = [];
aiInput: string = '';
aiLoading: boolean = false;
uploadedPdfBase64: string = '';
uploadedPdfName: string = '';

  constructor(
    private router: Router,
    private authService: AuthService,
    private chatService: ChatService,
    private userService: UserService,
    private internshipService: InternshipService,
    private assignmentService: AssignmentService,
    private classService: CollegeClassService,
    private attendanceService: AttendanceService
  ) {}

  ngOnInit() {
    this.loadCurrentUser();
    this.loadTeachers();
  }

  loadCurrentUser() {
    const token = this.authService.getToken();
    if (token) {
      const payload = JSON.parse(atob(token.split('.')[1]));
      this.loggedInName = payload.firstName + ' ' + payload.lastName;
      this.currentUserId = payload.sub;
      this.currentUserName = payload.firstName + ' ' + payload.lastName;
      this.studentClass = payload.className || '';
      this.profile = {
        firstName: payload.firstName,
        lastName: payload.lastName,
        email: payload.sub,
        role: payload.role,
        department: payload.department || 'Not assigned yet',
        class: payload.className || 'Not assigned yet'
      };
      this.chatService.connect(this.currentUserId);
      this.chatService.getMessages().subscribe((message) => {
        const key = message.senderId === this.currentUserId ? message.receiverId : message.senderId;
        if (this.selectedTeacher === key || message.senderId === this.currentUserId) {
          this.currentMessages = [...this.currentMessages, message];
        }
      });
      this.userService.getUserByEmail(this.currentUserId).subscribe({
  next: (user: any) => {
    this.mongoUserId = user.id;
    this.loadAttendanceSummary();
  },
  error: (err) => console.error('Error getting user id:', err)
});
      this.loadClasses();
      this.loadAssignments();

      this.loadInternships();
    }
  }

  loadClasses() {
    this.classService.getAllClasses().subscribe({
      next: (data: any[]) => {
        this.classes = data;
        if (this.studentClass) {
          const match = this.classes.find((c: any) => c.name === this.studentClass);
          if (match) {
            this.selectedTimetableDepartment = match.department;
            this.selectedTimetableClass = match.name;
          }
        }
      },
      error: (err: any) => console.error('Error loading classes:', err)
    });
  }

  loadTeachers() {
    this.userService.getTeachers().subscribe({
      next: (data) => { this.teachers = data; },
      error: (err) => console.error('Error loading teachers:', err)
    });
  }

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
      case 'internship': return 'Internship Requests';
      case 'chat': return 'Chat with Teachers';
      case 'profile': return 'My Profile';
      case 'ai': return 'AI Assistant';
      case 'attendance': return 'My Attendance';
      default: return 'Dashboard';
    }
  }
  // ─── ATTENDANCE ───
  hasThreeAbsenceWarning(): boolean {
  return this.attendanceSummary.some(s => s.absences === 3 && !s.eliminated);
}
loadAttendanceSummary() {
  if (!this.studentClass || !this.mongoUserId) return;
  this.attendanceService.getStudentSummary(this.mongoUserId, this.studentClass).subscribe({
    next: (data) => { this.attendanceSummary = data; },
    error: (err) => console.error('Error loading attendance summary:', err)
  });
}

getTotalAbsences(): number {
  return this.attendanceSummary.reduce((t, s) => t + s.absences, 0);
}

getEliminatedCount(): number {
  return this.attendanceSummary.filter(s => s.eliminated).length;
}
  // ─── VIRTUAL CLASSROOM ───

  loadAssignments() {
    if (!this.studentClass) return;
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
    this.showInternshipModal = true;
  }

  closeInternshipModal() {
    this.showInternshipModal = false;
  }

  submitInternship() {
    if (!this.newInternship.company || !this.newInternship.duration) return;
    const payload = {
      ...this.newInternship,
      studentId: this.currentUserId,
      studentName: this.currentUserName
    };
    this.internshipService.submitInternship(payload).subscribe({
      next: () => {
        this.loadInternships();
        this.closeInternshipModal();
      },
      error: (err) => console.error('Error submitting internship:', err)
    });
  }

  // ─── CHAT ───

  getChatMessages(): any[] {
    return this.currentMessages;
  }

  sendMessage() {
  if (!this.newMessage.trim() || !this.selectedTeacher) return;
  const message = {
    senderId: this.currentUserId,
    senderName: this.currentUserName,
    receiverId: this.selectedTeacher,
    receiverName: this.selectedTeacher,
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

  async sendAiMessage() {
  if (!this.aiInput.trim() || this.aiLoading) return;

  const userMessage = this.aiInput.trim();
  this.aiInput = '';
  this.aiLoading = true;

  this.aiMessages = [...this.aiMessages, { role: 'user', content: userMessage }];

  const studentContext = `You are EduSmart AI Assistant, a helpful academic assistant for a student.
Here is the student's current data:

Student Name: ${this.currentUserName}
Class: ${this.studentClass || 'Not assigned yet'}
Department: ${this.profile.department || 'Not assigned yet'}

Assignments:
${this.assignments.length === 0 ? 'No assignments yet.' : this.assignments.map(a => `
- Title: ${a.title}
  Subject: ${a.subject}
  Due Date: ${a.dueDate}
  Status: ${this.hasSubmitted(a) ? 'Submitted' : 'Not Submitted'}
  Grade: ${this.getMySubmission(a)?.grade !== null && this.getMySubmission(a)?.grade !== undefined ? this.getMySubmission(a)?.grade + '/20' : 'Not graded yet'}
`).join('')}

Internship Requests:
${this.internships.length === 0 ? 'No internship requests yet.' : this.internships.map(i => `
- Company: ${i.company}, Duration: ${i.duration}, Status: ${i.status}
`).join('')}

Timetable for ${this.studentClass}:
${this.getCurrentTimetable().length === 0 ? 'No timetable available.' : this.getCurrentTimetable().map(slot => `
- ${slot.time}: Mon: ${slot.monday}, Tue: ${slot.tuesday}, Wed: ${slot.wednesday}, Thu: ${slot.thursday}, Fri: ${slot.friday}
`).join('')}

Answer the student's questions in English based on this data. Be friendly, concise and helpful.
Keep answers short and to the point.
If asked something not related to their academic data, still try to be helpful as an academic assistant.`;

  try {
    const token = localStorage.getItem('token');
    const response = await fetch('http://localhost:8080/api/ai/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
     body: JSON.stringify({
  system: studentContext,
  pdfBase64: this.uploadedPdfBase64,
  messages: this.aiMessages
    .filter(m => m.role === 'user' || m.role === 'assistant')
    .map(m => ({ role: m.role, content: m.content }))
})
    });

    const data = await response.json();
    const reply = data.content?.[0]?.text || 'Sorry, I could not generate a response.';
this.aiMessages = [...this.aiMessages, { role: 'assistant', content: reply }];
this.uploadedPdfBase64 = ''; // Clear PDF after response
this.uploadedPdfName = '';

  } catch (error) {
    this.aiMessages = [...this.aiMessages, {
      role: 'assistant',
      content: 'Sorry, I encountered an error. Please try again.'
    }];
  }

  this.aiLoading = false;
}
onAiFileSelected(event: any) {
  const file = event.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = () => {
    const base64 = (reader.result as string).split(',')[1];
    this.uploadedPdfBase64 = base64;
    this.uploadedPdfName = file.name;
    // Auto send a summarize message
    this.aiInput = 'Please summarize this document for me.';
    this.sendAiMessage();
  };
  reader.readAsDataURL(file);
}
}
