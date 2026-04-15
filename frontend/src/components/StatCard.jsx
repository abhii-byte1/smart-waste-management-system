const StatCard = ({ label, value, accent }) => (
  <div className="rounded-3xl border border-white/10 bg-white/5 p-5 shadow-glow backdrop-blur">
    <p className="text-sm text-slate-400">{label}</p>
    <p className={`mt-3 text-3xl font-semibold ${accent}`}>{value}</p>
  </div>
);

export default StatCard;
