import ComplaintCard from './ComplaintCard.jsx';
import EmptyState from './EmptyState.jsx';

const ComplaintList = ({ complaints }) => {
  if (!complaints.length) {
    return (
      <EmptyState
        title="No complaints yet"
        description="Once complaints are submitted, they will appear here with live status and priority indicators."
      />
    );
  }

  return (
    <div className="grid gap-4">
      {complaints.map((complaint) => (
        <ComplaintCard key={complaint._id} complaint={complaint} />
      ))}
    </div>
  );
};

export default ComplaintList;
