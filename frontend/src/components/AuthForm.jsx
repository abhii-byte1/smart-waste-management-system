import { Link } from 'react-router-dom';

const AuthForm = ({
  title,
  subtitle,
  fields,
  values,
  onChange,
  onSubmit,
  loading,
  submitLabel,
  footerText,
  footerLink,
  footerLabel
}) => {
  const inputClassName =
    'mt-2 w-full rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-3 text-sm text-white outline-none transition focus:border-brand-500';

  return (
    <div className="mx-auto w-full max-w-md rounded-[2rem] border border-white/10 bg-white/5 p-8 shadow-glow backdrop-blur">
      <h1 className="text-3xl font-semibold text-white">{title}</h1>
      <p className="mt-3 text-sm text-slate-300">{subtitle}</p>

      <form onSubmit={onSubmit} className="mt-8 space-y-5">
        {fields.map((field) => (
          <label key={field.name} className="block text-sm text-slate-200">
            {field.label}
            <input
              type={field.type}
              name={field.name}
              value={values[field.name]}
              onChange={onChange}
              placeholder={field.placeholder}
              className={inputClassName}
              required
            />
          </label>
        ))}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-full bg-brand-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-brand-600 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? 'Please wait...' : submitLabel}
        </button>
      </form>

      <p className="mt-6 text-sm text-slate-400">
        {footerText}{' '}
        <Link to={footerLink} className="font-medium text-brand-200 hover:text-brand-100">
          {footerLabel}
        </Link>
      </p>
    </div>
  );
};

export default AuthForm;
