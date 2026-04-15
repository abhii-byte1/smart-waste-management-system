import { useState } from 'react';
import toast from 'react-hot-toast';
import api from '../api/client.js';

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
    'mt-2 w-full rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-3 text-sm text-white outline-none transition focus:border-brand-500';

  return (
    <form onSubmit={handleSubmit} className="rounded-[2rem] border border-white/10 bg-white/5 p-6 backdrop-blur">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold text-white">Report a Waste Issue</h2>
          <p className="mt-2 text-sm text-slate-300">
            Submit a complaint with location details. The backend will auto-classify urgency.
          </p>
        </div>
        <div className="rounded-full bg-brand-500/15 px-3 py-1 text-xs text-brand-100 ring-1 ring-brand-400/30">
          AI Prioritization
        </div>
      </div>

      <div className="mt-6 grid gap-5">
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
          {errors.location && <span className="mt-1 block text-xs text-red-300">{errors.location}</span>}
        </label>

        <label className="text-sm text-slate-200">
          Description
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            rows="5"
            placeholder="Describe the issue, smell, overflow, risk level, nearby landmarks, and urgency."
            className={inputClassName}
            disabled={disabled || submitting}
          />
          {errors.description && <span className="mt-1 block text-xs text-red-300">{errors.description}</span>}
        </label>

        <div className="text-sm text-slate-200">
          <label className="block">
            Upload Image (optional)
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="mt-2 block w-full rounded-2xl border border-dashed border-white/15 bg-slate-950/40 px-4 py-3 text-sm text-slate-300 file:mr-4 file:rounded-full file:border-0 file:bg-brand-500 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white"
              disabled={disabled || submitting}
            />
          </label>

          <p className="mt-2 text-xs text-slate-400">Supported image files up to 2 MB. Stored as a data URL in this MVP.</p>
          {fileName && <p className="mt-2 text-xs text-brand-100">Selected: {fileName}</p>}
          {errors.image && <span className="mt-1 block text-xs text-red-300">{errors.image}</span>}

          {form.image && (
            <div className="mt-4 overflow-hidden rounded-3xl border border-white/10 bg-slate-950/50 p-3">
              <img src={form.image} alt="Preview" className="h-56 w-full rounded-2xl object-cover" />
              <div className="mt-3 flex justify-end">
                <button
                  type="button"
                  onClick={clearImage}
                  className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs text-white transition hover:bg-white/10"
                  disabled={disabled || submitting}
                >
                  Remove Image
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="mt-6 flex flex-wrap items-center gap-3">
        <button
          type="submit"
          disabled={disabled || submitting}
          className="rounded-full bg-brand-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-brand-600 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {submitting ? 'Submitting...' : 'Submit Complaint'}
        </button>
        <p className="text-xs text-slate-400">Map picker ready for future Google Maps integration.</p>
      </div>
    </form>
  );
};

export default ComplaintForm;
