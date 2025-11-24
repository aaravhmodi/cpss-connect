export type UserRole = 'student' | 'alumni' | 'teacher'

export interface User {
  uid: string
  email: string
  role: UserRole
  fullName: string
  username?: string // Unique username
  bio?: string
  linkedinUrl?: string // LinkedIn profile URL
  suspended?: boolean // User suspension status
  createdAt: any
  updatedAt: any
  // Student fields
  gradYear?: number
  gradMonth?: number
  interestedPrograms?: string[]
  // Alumni fields
  classOf?: number // High school graduation year
  universityClassOf?: number // University graduation year
  university?: string
  program?: string // University program/major
  jobTitle?: string // Current career/job title
  // Teacher fields
  subject?: string // What subject/class they teach
}

export interface Post {
  id: string
  authorId: string
  authorRole: UserRole
  content: string
  createdAt: any
  updatedAt?: any
}

export interface Conversation {
  id: string
  participantIds: string[]
  lastMessage?: string
  lastMessageAt?: any
  createdAt: any
  updatedAt: any
}

export interface Message {
  id: string
  conversationId: string
  senderId: string
  content: string
  createdAt: any
}

