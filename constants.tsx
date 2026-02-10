
import React from 'react';
import { Notice, Post, BibleVerse } from './types';

export const INITIAL_NOTICES: Notice[] = [
  {
    id: '1',
    title: '여름 수련회 "Deep Dive" 안내',
    content: '올해 여름 수련회는 8월 14일부터 16일까지 진행됩니다. 많은 기대 부탁드려요!',
    date: '2024-07-20',
    author: '김선생님',
    category: 'event'
  },
  {
    id: '2',
    title: '이번 주 주일 예배 안내',
    content: '장소: 지하 1층 청소년부실, 시간: 오전 10시 30분. 지각하지 마세요!',
    date: '2024-07-25',
    author: '박목사님',
    category: 'worship'
  }
];

export const INITIAL_POSTS: Post[] = [
  {
    id: '101',
    title: '오늘 시험 잘 보게 기도해주세요!',
    content: '수학 시험인데 너무 떨려요... 잘 볼 수 있게 응원해주세요!',
    authorId: 'u1',
    authorName: '이수진',
    category: 'prayer',
    createdAt: '2024-07-26T08:30:00Z',
    likes: 12,
    // Fix: Add missing comments property required by Post type
    comments: []
  },
  {
    id: '102',
    title: '편의점 신상 추천!',
    content: '이번에 나온 불닭볶음면 신메뉴 진짜 맛있어요 ㅋㅋㅋ 다들 드셔보셨나요?',
    authorId: 'u2',
    authorName: '최민수',
    category: 'talk',
    createdAt: '2024-07-26T12:00:00Z',
    likes: 5,
    // Fix: Add missing comments property required by Post type
    comments: []
  }
];

export const DAILY_VERSES: BibleVerse[] = [
  { reference: '빌립보서 4:13', text: '내게 능력 주시는 자 안에서 내가 모든 것을 할 수 있느니라' },
  { reference: '잠언 3:5', text: '너는 마음을 다하여 여호와를 신뢰하고 네 명철을 의지하지 말라' },
  { reference: '시편 23:1', text: '여호와는 나의 목자시니 내게 부족함이 없으리로다' }
];
