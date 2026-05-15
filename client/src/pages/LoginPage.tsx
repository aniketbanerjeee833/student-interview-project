import { useNavigate } from 'react-router-dom';
import { LoginForm } from '../components/forms/LoginForm';

export default function LoginPage() {
  const navigate = useNavigate();

  return (
    <section className="page page-center">
      <div className="card" style={{ maxWidth: 420 }}>
        <div className="login-logo">🎓</div>
        <h1 style={{ fontSize: '1.4rem' }}>Welcome back</h1>
        <p className="page-description">
          Sign in to your account to manage student records.
        </p>
        <div className="divider" style={{ margin: '0 0 1.5rem' }} />
        <LoginForm onSuccess={() => navigate('/students')} />
        <p
          style={{
            marginTop: '1.5rem',
            fontSize: '0.78rem',
            color: 'var(--text3)',
            textAlign: 'center',
          }}
        >
          Don't have an account?{' '}
          <a
            href="/register"
            style={{ color: 'var(--accent2)', textDecoration: 'none' }}
          >
            Register here
          </a>
        </p>
      </div>
    </section>
  );
}