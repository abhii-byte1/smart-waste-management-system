import { AnimatePresence, motion } from 'framer-motion';
import ComplaintCard from './ComplaintCard.jsx';
import EmptyState from './EmptyState.jsx';
import { staggerContainer } from '../utils/motion.js';

const ComplaintList = ({ complaints, onRowClick, selectedId }) => {
  if (!complaints.length) {
    return (
      <EmptyState
        title="No complaints yet"
        description="Once complaints are submitted, they will appear here with live status and priority indicators."
      />
    );
  }

  return (
    <motion.div
      className="grid gap-3 sm:gap-4"
      variants={staggerContainer(0.08)}
      initial="hidden"
      animate="visible"
    >
      <AnimatePresence mode="popLayout">
        {complaints.map((complaint) => (
          <ComplaintCard 
            key={complaint._id} 
            complaint={complaint} 
            onClick={onRowClick}
            isSelected={selectedId === complaint._id}
          />
        ))}
      </AnimatePresence>
    </motion.div>
  );
};

export default ComplaintList;
