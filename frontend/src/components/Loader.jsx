const Loader = ({ text = 'Loading...' }) => (
  <div className="flex min-h-[120px] items-center justify-center">
    <div className="flex items-center gap-3 rounded-full border border-white/10 bg-white/5 px-5 py-3 text-sm text-slate-200 backdrop-blur">
      <span className="h-3 w-3 animate-pulse rounded-full bg-brand-500" />
      {text}
    </div>
  </div>
);

export default Loader;
