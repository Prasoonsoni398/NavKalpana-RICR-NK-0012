import StudentSidebar from '@/components/Sidebar/StudentSidebar';

export default function StudentLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ display: 'flex' }}>
      <StudentSidebar />
      <main style={{ flex: 1 }}>{children}</main>
    </div>
  );
}