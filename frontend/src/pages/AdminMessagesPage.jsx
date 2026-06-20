import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Search } from 'lucide-react';
import api from '../api/client.js';
import Loader from '../components/Loader.jsx';
import { fadeInUp, staggerContainer, staggerItem } from '../utils/motion.js';

const AdminMessagesPage = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const { data } = await api.get('/feedback?type=contact');
        setMessages(data);
      } catch (error) {
        console.error('Failed to fetch messages:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchMessages();
  }, []);

  // Filter messages by name, email, or message content
  const filteredMessages = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return messages;
    return messages.filter(
      (msg) =>
        msg.name?.toLowerCase().includes(q) ||
        msg.email?.toLowerCase().includes(q) ||
        msg.message?.toLowerCase().includes(q)
    );
  }, [messages, searchQuery]);

  return (
    <div className="space-y-6 sm:space-y-8">
      <motion.div variants={fadeInUp} initial="hidden" animate="visible" className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white sm:text-3xl">Inbox Messages</h1>
          <p className="mt-1.5 text-sm text-slate-400">
            View contact inquiries from citizens.{' '}
            {!loading && (
              <span className="font-medium text-brand-400">
                {filteredMessages.length} of {messages.length} shown
              </span>
            )}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name, email, message..."
              className="h-10 w-64 rounded-xl border border-white/10 bg-white/5 pl-9 pr-4 text-sm text-white outline-none transition focus:border-brand-500 focus:ring-1 focus:ring-brand-500/30"
            />
          </div>
        </div>
      </motion.div>

      {loading ? (
        <Loader text="Loading messages..." />
      ) : filteredMessages.length === 0 ? (
        <motion.div variants={fadeInUp} initial="hidden" animate="visible" className="flex flex-col items-center justify-center rounded-3xl border border-white/10 bg-surface/50 py-20 text-center backdrop-blur">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/5">
            <Mail className="h-8 w-8 text-slate-400" />
          </div>
          <h3 className="mt-4 text-lg font-medium text-white">
            {searchQuery ? 'No messages match your search' : 'No messages yet'}
          </h3>
          <p className="mt-2 text-sm text-slate-400">
            {searchQuery ? 'Try a different keyword.' : 'Your inbox is completely clear.'}
          </p>
        </motion.div>
      ) : (
        <motion.div variants={staggerContainer(0.1)} initial="hidden" animate="visible" className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredMessages.map((msg) => (
            <motion.div key={msg._id} variants={staggerItem} className="flex flex-col rounded-2xl border border-white/[0.06] bg-surface/50 p-5 backdrop-blur">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="font-semibold text-white">{msg.name}</h3>
                  <p className="text-xs text-brand-400">{msg.email}</p>
                </div>
                <span className="text-[10px] text-slate-400">{new Date(msg.createdAt).toLocaleDateString()}</span>
              </div>
              <div className="mt-4 flex-1">
                <p className="text-sm leading-relaxed text-slate-300">{msg.message}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
};

export default AdminMessagesPage;

