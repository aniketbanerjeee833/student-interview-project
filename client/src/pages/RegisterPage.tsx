import { useNavigate } from 'react-router-dom';
import { registerStudent } from '../lib/api';
import { StudentForm } from '../components/forms/StudentForm';
import type { StudentCreateFormValues, StudentUpdateFormValues } from '../lib/schemas';

export default function RegisterPage() {
  const navigate = useNavigate();

  async function handleRegister(values: StudentCreateFormValues | StudentUpdateFormValues) {
    await registerStudent(values as StudentCreateFormValues);
    navigate('/students');
  }

  return (
    <section className="page page-left">
      <div className="card">
        <h1>Register Student</h1>
        <p className="page-description">Create a new student profile with secure encryption before sending to the backend.</p>
        <StudentForm submitLabel="Register Student" onSubmit={handleRegister} />
      </div>
    </section>
  );
}
