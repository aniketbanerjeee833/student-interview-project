import { useEffect, useState } from 'react';
import { deleteStudent, getStudents, registerStudent, updateStudent } from '../lib/api';
import type { StudentData } from '../lib/api';
import { StudentForm } from '../components/forms/StudentForm';
import { StudentTable } from '../components/StudentTable';
import { Button } from '../components/ui/button';
import type { StudentCreateFormValues, StudentUpdateFormValues } from '../lib/schemas';

export default function StudentsPage() {
  const [students, setStudents] = useState<StudentData[]>([]);
  const [selectedStudent, setSelectedStudent] = useState<StudentData | null>(null);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  async function loadStudents() {
    setLoading(true);
    setError('');
    try {
      const data = await getStudents();
      setStudents(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load student list');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { loadStudents(); }, []);

  async function handleCreate(values: StudentCreateFormValues | StudentUpdateFormValues) {
    setMessage(''); setError('');
    try {
      await registerStudent(values as StudentCreateFormValues);
      await loadStudents();
      setMessage('Student registered successfully.');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to register student');
    }
  }

  async function handleUpdate(values: StudentCreateFormValues | StudentUpdateFormValues) {
    if (!selectedStudent) return;
    setMessage(''); setError('');
    try {
      await updateStudent(selectedStudent._id, values);
      setSelectedStudent(null);
      await loadStudents();
      setMessage('Student record updated successfully.');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to update student');
    }
  }

  async function handleDelete(studentId: string) {
    if (!window.confirm('Delete this student record?')) return;
    setError(''); setMessage('');
    try {
      await deleteStudent(studentId);
      await loadStudents();
      setMessage('Student deleted successfully.');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to delete student');
    }
  }

  return (
    <section className="page page-full">
      <div className="students-grid">

        {/* ── Left: Table ── */}
        <div className="card card-tall">
          <div className="page-header">
            <div>
              <h1>Student Directory</h1>
              <p className="page-description" style={{ margin: 0 }}>
                {students.length > 0
                  ? `${students.length} student${students.length !== 1 ? 's' : ''} enrolled`
                  : 'No students yet'}
              </p>
            </div>
            <Button
              type="button"
              variant="secondary"
              onClick={() => setSelectedStudent(null)}
            >
              + New
            </Button>
          </div>

          {message && <p className="success-message">{message}</p>}
          {error && <p className="error-message">{error}</p>}

          {loading ? (
            <div className="empty-state">
              <p>Loading students…</p>
            </div>
          ) : (
            <StudentTable
              students={students}
              onEdit={(s) => {
                setSelectedStudent(s);
                setMessage('');
                setError('');
              }}
              onDelete={handleDelete}
            />
          )}
        </div>

        {/* ── Right: Form ── */}
        <div className="card card-tall">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
            <h2 style={{ margin: 0 }}>
              {selectedStudent ? 'Edit Student' : 'Register Student'}
            </h2>
            {selectedStudent && (
              <span className="badge" style={{ background: 'var(--accent-bg)', color: 'var(--accent2)', borderColor: 'var(--accent-border)' }}>
                Editing
              </span>
            )}
          </div>
          <StudentForm
            student={selectedStudent ?? undefined}
            submitLabel={selectedStudent ? 'Update Student' : 'Add Student'}
            onSubmit={selectedStudent ? handleUpdate : handleCreate}
            onCancel={selectedStudent ? () => setSelectedStudent(null) : undefined}
          />
        </div>

      </div>
    </section>
  );
}