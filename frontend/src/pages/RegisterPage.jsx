import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthForm from '../components/AuthForm.jsx';
import { useAuth } from '../context/AuthContext.jsx';

const initialState = {
  name: '',
  email: '',
  password: ''
};

const RegisterPage = () => {
  const [form, setForm] = useState(initialState);
  const { register, authLoading } = useAuth();
  const navigate = useNavigate();

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const user = await register(form);
      navigate(user.role === 'admin' ? '/dashboard' : '/');
    } catch {
      // Toast is handled in auth context.
    }
  };

  return (
    <section className="flex min-h-[60vh] items-center justify-center px-4 sm:min-h-[75vh]">
      <AuthForm
        title="Create Account"
        subtitle="Start reporting waste issues in your area with real-time tracking."
        fields={[
          { name: 'name', label: 'Name', type: 'text', placeholder: 'Your full name' },
          { name: 'email', label: 'Email', type: 'email', placeholder: 'you@example.com' },
          { name: 'password', label: 'Password', type: 'password', placeholder: 'Minimum 6 characters' }
        ]}
        values={form}
        onChange={handleChange}
        onSubmit={handleSubmit}
        loading={authLoading}
        submitLabel="Register"
        footerText="Already have an account?"
        footerLink="/login"
        footerLabel="Login"
      />
    </section>
  );
};

export default RegisterPage;
