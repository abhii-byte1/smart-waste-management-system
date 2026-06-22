import Loader from './Loader.jsx';

const PageLoader = ({ text = 'Loading page...' }) => (
  <div
    className="flex min-h-[50vh] items-center justify-center bg-slate-950"
    role="status"
    aria-live="polite"
    aria-busy="true"
  >
    <Loader text={text} />
  </div>
);

export default PageLoader;
