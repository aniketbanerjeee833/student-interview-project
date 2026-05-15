import type { StudentData } from '../lib/api';
import { Button } from './ui/button';

interface StudentTableProps {
  students: StudentData[];
  onEdit: (student: StudentData) => void;
  onDelete: (studentId: string) => void;
}

function getInitials(name: string) {
  return name
    .split(' ')
    .map((n) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();
}

function formatDate(dateStr: string) {
  if (!dateStr) return '—';
  try {
    return new Date(dateStr).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  } catch {
    return dateStr;
  }
}

export function StudentTable({ students, onEdit, onDelete }: StudentTableProps) {
  if (students.length === 0) {
    return (
      <div className="empty-state">
        <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🎓</div>
        <p>No students found.</p>
        <p style={{ fontSize: '0.8rem', marginTop: '0.25rem', opacity: 0.6 }}>
          Register the first student using the form.
        </p>
      </div>
    );
  }

  return (
    <div className="table-wrapper">
      <table className="student-table">
        <thead>
          <tr>
            <th>Student</th>
            <th>Phone</th>
            <th>DOB</th>
            <th>Gender</th>
            <th>Course</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {students.map((student) => (
            <tr key={student._id}>
              <td>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                  <div className="avatar">{getInitials(student.fullName)}</div>
                  <div>
                    <div style={{ fontWeight: 500, lineHeight: 1.3 }}>{student.fullName}</div>
                    <div
                      style={{
                        fontSize: '0.75rem',
                        color: 'var(--text3)',
                        fontFamily: 'var(--mono)',
                        marginTop: '0.1rem',
                      }}
                    >
                      {student.email}
                    </div>
                  </div>
                </div>
              </td>
              <td style={{ color: 'var(--text2)', fontFamily: 'var(--mono)', fontSize: '0.82rem' }}>
                {student.phone || '—'}
              </td>
              <td style={{ color: 'var(--text2)', fontSize: '0.85rem' }}>
                {formatDate(student.dateOfBirth)}
              </td>
              <td>
                <span className="badge">{student.gender}</span>
              </td>
              <td style={{ color: 'var(--text)', fontSize: '0.875rem' }}>
                {student.courseEnrolled}
              </td>
              <td className="table-actions">
                <Button type="button" variant="secondary" onClick={() => onEdit(student)}>
                  Edit
                </Button>
                <Button
                  type="button"
                  variant="danger"
                  onClick={() => onDelete(student._id)}
                >
                  Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}