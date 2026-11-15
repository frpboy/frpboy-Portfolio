import Link from "next/link";

export default function CalBookingLink() {
  return (
    <Link
      href="/book"
      className="inline-flex min-h-11 items-center border border-system-green bg-system-green/10 px-4 py-3 font-mono text-[10px] uppercase tracking-wide text-system-green transition-colors hover:bg-system-green/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-system-green"
    >
      Contact me
    </Link>
  );
}
