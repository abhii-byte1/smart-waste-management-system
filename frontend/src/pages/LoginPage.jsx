import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthForm from '../components/AuthForm.jsx';
import { useAuth } from '../context/AuthContext.jsx';

const initialState = {
  email: '',
  password: ''
};

const LoginPage = () => {
  const [form, setForm] = useState(initialState);
  const { login, authLoading } = useAuth();
  const navigate = useNavigate();

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const user = await login(form);
      navigate(user.role === 'admin' ? '/admin/dashboard' : '/');
    } catch {
      // Toast is handled in auth context.
    }
  };

  return (
    <section className="flex min-h-[60vh] items-center justify-center px-4 sm:min-h-[70vh]">
      <AuthForm
        title="Welcome Back"
        subtitle="Log in as a citizen or admin to continue managing complaints."
        fields={[
          { name: 'email', label: 'Email', type: 'email', placeholder: 'you@example.com' },
          { name: 'password', label: 'Password', type: 'password', placeholder: 'Enter your password' }
        ]}
        values={form}
        onChange={handleChange}
        onSubmit={handleSubmit}
        loading={authLoading}
        submitLabel="Login"
        footerText="Need an account?"
        footerLink="/register"
        footerLabel="Register"
      />
    </section>
  );
};

export default LoginPage;
