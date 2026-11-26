// Instant skeleton while /videos loads its YouTube feed, so navigating
// to the section never looks frozen on the previous page.
export default function VideosLoading() {
  return (
    <article className="mx-auto w-full max-w-6xl flex-1 px-6 py-16 sm:py-24" aria-busy="true">
      <p className="font-mono text-[10px] uppercase tracking-wider text-white/45">
        Portfolio / <span className="text-system-green">Videos</span>
      </p>
      <div className="mt-7 max-w-3xl">
        <p className="font-mono text-xs uppercase tracking-[0.3em] text-system-green">Watch // FRPBOY on YouTube</p>
        <h1 className="mt-4 text-4xl font-black tracking-tight text-white sm:text-6xl">Videos</h1>
        <p className="mt-6 font-mono text-[10px] uppercase tracking-wider text-white/40">Loading the latest from YouTube...</p>
      </div>
      <div className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
        {Array.from({ length: 10 }).map((_, index) => (
          <div key={index} className="border border-white/10 bg-white/[0.02] p-4">
            <div className="aspect-[9/16] w-full animate-pulse bg-white/10" />
            <div className="mt-4 h-3 w-3/4 animate-pulse bg-white/10" />
            <div className="mt-2 h-3 w-1/2 animate-pulse bg-white/10" />
          </div>
        ))}
      </div>
    </article>
  );
}
