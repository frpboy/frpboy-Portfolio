// Instant skeleton while a video page loads, so tapping a video never
// looks stuck on the listing.
export default function VideoLoading() {
  return (
    <article className="mx-auto w-full max-w-4xl flex-1 px-6 py-16 sm:py-24" aria-busy="true">
      <p className="font-mono text-[10px] uppercase tracking-wider text-white/45">
        Portfolio / Videos / <span className="text-system-green">Loading</span>
      </p>
      <div className="mt-8 border-b border-white/10 pb-8">
        <div className="h-3 w-40 animate-pulse bg-white/10" />
        <div className="mt-5 h-10 w-4/5 animate-pulse bg-white/10" />
        <div className="mt-3 h-10 w-3/5 animate-pulse bg-white/10" />
        <div className="mt-6 h-4 w-2/3 animate-pulse bg-white/10" />
      </div>
      <div className="mx-auto mt-8 aspect-[9/16] w-full max-w-sm animate-pulse border border-white/10 bg-white/5 sm:aspect-video sm:max-w-none" />
      <p className="mt-5 font-mono text-[10px] uppercase tracking-wider text-white/40">Loading video...</p>
    </article>
  );
}
