
export interface User {
  id: string;
  name: string;
  role: 'student' | 'teacher' | 'admin' | 'leader';
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
