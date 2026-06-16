import { useState } from 'react';
import api from '../api/client.js';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { Mail, MapPin, Phone } from 'lucide-react';
import { buttonTap, fadeInUp, staggerContainer, staggerItem } from '../utils/motion.js';

const ContactPage = () => {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.post('/feedback', { type: 'contact', ...form });
      toast.success('Message sent! We will get back to you soon.');
      setForm({ name: '', email: '', message: '' });
    } catch (error) {
      toast.error('Failed to send message. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const inputClass = 'mt-2 w-full rounded-xl border border-white/10 bg-ink px-4 py-3 text-sm text-white outline-none transition-all duration-200 focus:border-brand-500 focus:ring-1 focus:ring-brand-500/30';

  return (
    <div className="mx-auto max-w-5xl space-y-8 py-8">
      <motion.div variants={fadeInUp} initial="hidden" animate="visible" className="text-center">
        <p className="text-sm uppercase tracking-[0.3em] text-brand-400">Get in Touch</p>
        <h1 className="mt-4 text-3xl font-bold text-white sm:text-5xl">Contact Us</h1>
        <p className="mx-auto mt-4 max-w-2xl text-sm text-slate-400 sm:text-base">
          Have a question about the platform or need to report a critical issue directly? Reach out to our support team.
        </p>
      </motion.div>

      <div className="grid gap-8 lg:grid-cols-2">
        <motion.div variants={staggerContainer(0.1)} initial="hidden" animate="visible" className="space-y-4">
          <motion.div variants={staggerItem} className="flex items-center gap-4 rounded-3xl border border-white/[0.06] bg-surface/50 p-6 backdrop-blur">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-brand-500/15 ring-1 ring-brand-500/30">
              <Mail className="h-6 w-6 text-brand-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white">Email Us</h3>
              <p className="mt-1 text-sm text-slate-400">support@smartwaste.com</p>
            </div>
          </motion.div>

          <motion.div variants={staggerItem} className="flex items-center gap-4 rounded-3xl border border-white/[0.06] bg-surface/50 p-6 backdrop-blur">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-brand-500/15 ring-1 ring-brand-500/30">
              <Phone className="h-6 w-6 text-brand-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white">Call Us</h3>
              <p className="mt-1 text-sm text-slate-400">+1 (555) 123-4567 (Mon-Fri, 9am-5pm)</p>
            </div>
          </motion.div>

          <motion.div variants={staggerItem} className="flex items-center gap-4 rounded-3xl border border-white/[0.06] bg-surface/50 p-6 backdrop-blur">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-brand-500/15 ring-1 ring-brand-500/30">
              <MapPin className="h-6 w-6 text-brand-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white">Office</h3>
              <p className="mt-1 text-sm text-slate-400">123 Green City Blvd, Innovation District</p>
            </div>
          </motion.div>
        </motion.div>

        <motion.form
          onSubmit={handleSubmit}
          variants={fadeInUp}
          initial="hidden"
          animate="visible"
          className="rounded-3xl border border-white/[0.06] bg-surface/50 p-6 backdrop-blur sm:p-8"
        >
          <h2 className="text-xl font-bold text-white">Send a Message</h2>
          <div className="mt-6 space-y-4">
            <label className="block text-sm text-slate-300">
              Name
              <input type="text" name="name" value={form.name} onChange={handleChange} required className={inputClass} placeholder="John Doe" />
            </label>
            <label className="block text-sm text-slate-300">
              Email
              <input type="email" name="email" value={form.email} onChange={handleChange} required className={inputClass} placeholder="john@example.com" />
            </label>
            <label className="block text-sm text-slate-300">
              Message
              <textarea name="message" value={form.message} onChange={handleChange} required rows="4" className={inputClass} placeholder="How can we help?" />
            </label>
          </div>
          <motion.button
            type="submit"
            disabled={submitting}
            whileHover={{ scale: 1.02 }}
            whileTap={buttonTap}
            className="mt-6 w-full rounded-xl bg-brand-500 py-3 text-sm font-semibold text-white transition hover:bg-brand-600 disabled:opacity-50"
          >
            {submitting ? 'Sending...' : 'Send Message'}
          </motion.button>
        </motion.form>
      </div>
    </div>
  );
};

export default ContactPage;
