export interface Student {
  id: string;
  name: string;
  email: string;
  joinedDate: string;
  enrolledCourses: number;
  status: "Active" | "Inactive";
}

export const STUDENTS_DATA: Student[] = [
  { id: "S1", name: "Rahul Sharma", email: "rahul@example.com", joinedDate: "2026-01-10", enrolledCourses: 3, status: "Active" },
  { id: "S2", name: "Anjali Gupta", email: "anjali@example.com", joinedDate: "2026-02-05", enrolledCourses: 1, status: "Active" },
  { id: "S3", name: "Vikram Singh", email: "vikram@example.com", joinedDate: "2026-02-15", enrolledCourses: 5, status: "Inactive" },
  { id: "S4", name: "Priya Joshi", email: "priya@example.com", joinedDate: "2026-03-20", enrolledCourses: 2, status: "Active" },
];