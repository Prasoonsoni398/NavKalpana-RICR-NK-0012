export interface Assignment {
  id: string;
  title: string;
  courseName: string;
  dueDate: string;
  status: "submitted" | "pending" | "late";
}