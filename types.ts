
export interface User {
  id: string;
  name: string;
  role: 'student' | 'teacher' | 'admin' | 'leader' | 'president';
  grade?: number;
}

export interface Notice {
  id: string;
  title: string;
  content: string;
  date: string;
  author: string;
  category: 'worship' | 'event' | 'info';
  imageUrl?: string;
}

export interface AppNotification {
  id: string;
  type: 'notice' | 'community';
  title: string;
  message: string;
  link: string;
  createdAt: string;
  isRead: boolean;
}

export interface Participation {
  id: string;
  noticeId: string;
  noticeTitle: string;
  userId: string;
  userName: string;
  userRole: string;
  appliedAt: string;
  isRead: boolean;
}

export interface Comment {
  id: string;
  authorName: string;
  content: string;
  createdAt: string;
}

export interface Post {
  id: string;
  title: string;
  content: string;
  authorId: string;
  authorName: string;
  category: 'talk' | 'prayer';
  createdAt: string;
  likes: number;
  comments: Comment[];
}

export interface AttendanceRecord {
  id: string;
  userId: string;
  userName: string;
  date: string;
  status: 'present' | 'absent' | 'late';
}

export interface BibleVerse {
  reference: string;
  text: string;
}
