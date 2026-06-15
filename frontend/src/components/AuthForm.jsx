import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { fadeInUp, staggerContainer, staggerItem, buttonTap } from '../utils/motion.js';

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
    'mt-2 w-full rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-3 text-sm text-white outline-none transition focus:border-brand-500 focus:ring-1 focus:ring-brand-500/30';

  return (
    <motion.div
      variants={fadeInUp}
      initial="hidden"
      animate="visible"
      className="mx-auto w-full max-w-md rounded-[2rem] border border-white/10 bg-white/5 p-6 shadow-glow backdrop-blur sm:p-8"
    >
      <h1 className="text-2xl font-semibold text-white sm:text-3xl">{title}</h1>
      <p className="mt-2 text-sm text-slate-300 sm:mt-3">{subtitle}</p>

      <motion.form
        onSubmit={onSubmit}
        className="mt-6 space-y-4 sm:mt-8 sm:space-y-5"
        variants={staggerContainer(0.1)}
        initial="hidden"
        animate="visible"
      >
        {fields.map((field) => (
          <motion.label key={field.name} variants={staggerItem} className="block text-sm text-slate-200">
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
          </motion.label>
        ))}

        <motion.button
          type="submit"
          disabled={loading}
          whileHover={{ scale: 1.02 }}
          whileTap={buttonTap}
          className="w-full rounded-full bg-brand-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-brand-600 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? 'Please wait...' : submitLabel}
        </motion.button>
      </motion.form>

      <p className="mt-5 text-sm text-slate-400 sm:mt-6">
        {footerText}{' '}
        <Link to={footerLink} className="font-medium text-brand-200 transition-colors hover:text-brand-100">
          {footerLabel}
        </Link>
      </p>
    </motion.div>
  );
};

export default AuthForm;
