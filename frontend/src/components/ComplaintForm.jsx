import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import toast from 'react-hot-toast';
import api from '../api/client.js';
import { buttonTap, fadeInUp } from '../utils/motion.js';

const MAX_FILE_SIZE = 2 * 1024 * 1024;
const initialState = {
  location: '',
  description: '',
  image: ''
};

const ComplaintForm = ({ onCreated, disabled }) => {
  const [form, setForm] = useState(initialState);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [fileName, setFileName] = useState('');

  const validate = () => {
    const nextErrors = {};

    if (!form.location.trim()) {
      nextErrors.location = 'Location is required.';
    }

    if (!form.description.trim()) {
      nextErrors.description = 'Description is required.';
    }

    if (form.image && !/^data:image\//i.test(form.image) && !/^https?:\/\//i.test(form.image)) {
      nextErrors.image = 'Image must be uploaded from your device or be a valid image URL.';
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const handleFileChange = (event) => {
    const file = event.target.files?.[0];

    if (!file) {
      setFileName('');
      setForm((current) => ({ ...current, image: '' }));
      return;
    }

    if (!file.type.startsWith('image/')) {
      setErrors((current) => ({ ...current, image: 'Please upload an image file.' }));
      event.target.value = '';
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      setErrors((current) => ({ ...current, image: 'Image must be smaller than 2 MB.' }));
      event.target.value = '';
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setForm((current) => ({ ...current, image: reader.result }));
      setFileName(file.name);
      setErrors((current) => ({ ...current, image: '' }));
    };
    reader.readAsDataURL(file);
  };

  const clearImage = () => {
    setForm((current) => ({ ...current, image: '' }));
    setFileName('');
    setErrors((current) => ({ ...current, image: '' }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!validate()) {
      return;
    }

    setSubmitting(true);
    try {
      const { data } = await api.post('/complaints', form);
      toast.success(`Complaint submitted with ${data.priority.toLowerCase()} priority.`);
      setForm(initialState);
      setErrors({});
      setFileName('');
      onCreated?.();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Unable to submit complaint.');
    } finally {
      setSubmitting(false);
    }
  };

  const inputClassName =
    'mt-2 w-full rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-3 text-sm text-white outline-none transition-all duration-200 focus:border-brand-500 focus:ring-1 focus:ring-brand-500/30';

  return (
    <motion.form
      onSubmit={handleSubmit}
      variants={fadeInUp}
      initial="hidden"
      animate="visible"
      className="rounded-[1.5rem] border border-white/10 bg-white/5 p-5 backdrop-blur sm:rounded-[2rem] sm:p-6"
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
        <div>
          <h2 className="text-lg font-semibold text-white sm:text-xl">Report a Waste Issue</h2>
          <p className="mt-1.5 text-sm text-slate-300 sm:mt-2">
            Submit a complaint with location details. The backend will auto-classify urgency.
          </p>
        </div>
        <motion.div
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          className="w-fit rounded-full bg-brand-500/15 px-3 py-1 text-xs text-brand-100 ring-1 ring-brand-400/30"
        >
          AI Prioritization
        </motion.div>
      </div>

      <div className="mt-5 grid gap-4 sm:mt-6 sm:gap-5">
        <label className="text-sm text-slate-200">
          Location
          <input
            name="location"
            value={form.location}
            onChange={handleChange}
            placeholder="Ex: Near City Hospital, Sector 5"
            className={inputClassName}
            disabled={disabled || submitting}
          />
          <AnimatePresence>
            {errors.location && (
              <motion.span
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                className="mt-1 block text-xs text-red-300"
              >
                {errors.location}
              </motion.span>
            )}
          </AnimatePresence>
        </label>

        <label className="text-sm text-slate-200">
          Description
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            rows="4"
            placeholder="Describe the issue, smell, overflow, risk level, nearby landmarks, and urgency."
            className={inputClassName}
            disabled={disabled || submitting}
          />
          <AnimatePresence>
            {errors.description && (
              <motion.span
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                className="mt-1 block text-xs text-red-300"
              >
                {errors.description}
              </motion.span>
            )}
          </AnimatePresence>
        </label>

        <div className="text-sm text-slate-200">
          <label className="block">
            Upload Image (optional)
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="mt-2 block w-full rounded-2xl border border-dashed border-white/15 bg-slate-950/40 px-3 py-3 text-sm text-slate-300 file:mr-3 file:rounded-full file:border-0 file:bg-brand-500 file:px-3 file:py-1.5 file:text-xs file:font-semibold file:text-white sm:px-4 sm:file:mr-4 sm:file:px-4 sm:file:py-2 sm:file:text-sm"
              disabled={disabled || submitting}
            />
          </label>

          <p className="mt-2 text-xs text-slate-400">Supported image files up to 2 MB. Stored as a data URL in this MVP.</p>
          {fileName && <p className="mt-2 text-xs text-brand-100">Selected: {fileName}</p>}
          <AnimatePresence>
            {errors.image && (
              <motion.span
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                className="mt-1 block text-xs text-red-300"
              >
                {errors.image}
              </motion.span>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {form.image && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="mt-4 overflow-hidden rounded-3xl border border-white/10 bg-slate-950/50 p-3"
              >
                <img src={form.image} alt="Preview" className="h-40 w-full rounded-2xl object-cover sm:h-56" />
                <div className="mt-3 flex justify-end">
                  <motion.button
                    type="button"
                    onClick={clearImage}
                    whileHover={{ scale: 1.04 }}
                    whileTap={buttonTap}
                    className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs text-white transition hover:bg-white/10"
                    disabled={disabled || submitting}
                  >
                    Remove Image
                  </motion.button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <div className="mt-5 flex flex-col gap-3 sm:mt-6 sm:flex-row sm:flex-wrap sm:items-center">
        <motion.button
          type="submit"
          disabled={disabled || submitting}
          whileHover={{ scale: 1.03 }}
          whileTap={buttonTap}
          className="w-full rounded-full bg-brand-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-brand-600 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
        >
          {submitting ? 'Submitting...' : 'Submit Complaint'}
        </motion.button>
        <p className="text-center text-xs text-slate-400 sm:text-left">Map picker ready for future Google Maps integration.</p>
      </div>
    </motion.form>
  );
};

export default ComplaintForm;
