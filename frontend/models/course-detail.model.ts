// types/course-detail.ts

export interface Resource {
  id: number;
  type: 'video' | 'notes' | 'quiz' | 'codelab' | string;
  title: string;
  url?: string | null;
  metadata?: any; // You can type more specifically if you know the structure
}

export interface Lesson {
  id: number;
  title: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  completed: boolean;
  resources: Resource[];
}

export interface Module {
  id: string;
  title: string;
  position: number;
  progress: number; // optional if needed
  lessons: Lesson[];
}

export interface CourseDetail {
  id: number;
  title: string;
  description: string;
  instructorName: string;
  thumbnailUrl?: string | null;
  isPublished: boolean;
  progress: number; // overall course progress
  modules: Module[];
}

// For creating a course via API
export interface CreateCourseRequest {
  title: string;
  description: string;
  instructorName: string;
  thumbnailUrl?: string;
  isPublished?: boolean;
}