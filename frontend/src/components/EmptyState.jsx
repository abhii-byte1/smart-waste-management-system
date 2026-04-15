const EmptyState = ({ title, description }) => (
  <div className="rounded-3xl border border-dashed border-white/15 bg-white/5 p-8 text-center">
    <h3 className="text-lg font-semibold text-white">{title}</h3>
    <p className="mt-2 text-sm text-slate-300">{description}</p>
  </div>
);

export default EmptyState;
