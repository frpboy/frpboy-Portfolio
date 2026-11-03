import Link from "next/link";

function getBookingUrl(): string | null {
  const value = process.env.CALCOM_BOOKING_URL;
  if (!value) return null;

  try {
    const url = new URL(value);
    return url.protocol === "https:" ? url.toString() : null;
  } catch {
    return null;
  }
}

export default function BookPage() {
  const bookingUrl = getBookingUrl();

  return (
    <section className="mx-auto flex w-full max-w-3xl flex-1 flex-col justify-center px-5 py-20 sm:px-8">
      <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-system-green">Scheduling / Cal.com</p>
      <h1 className="mt-4 text-4xl font-black uppercase tracking-tight text-white sm:text-6xl">
        Let&apos;s talk<span className="text-system-green">.</span>
      </h1>
      <p className="mt-5 max-w-xl text-sm leading-relaxed text-white/55 sm:text-base">
        Choose a suitable time for a conversation about development, automation, or a technical project.
      </p>

      {bookingUrl ? (
        <div className="mt-10 border border-system-green/25 bg-system-green/[0.04] p-5 sm:p-7">
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-system-green">Cal.com booking</p>
          <p className="mt-3 text-sm leading-relaxed text-white/65">
            The secure booking calendar opens on Cal.com. Your selected time and confirmation are managed there.
          </p>
          <a
            href={bookingUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 inline-flex min-h-12 items-center border border-system-green/50 bg-system-green/10 px-5 font-mono text-[10px] uppercase tracking-wider text-system-green transition-colors hover:bg-system-green/15"
          >
            Open booking calendar
          </a>
        </div>
      ) : (
        <div className="mt-10 border border-white/10 bg-white/[0.03] p-5 sm:p-7">
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/45">Calendar configuration pending</p>
          <p className="mt-3 text-sm leading-relaxed text-white/65">
            Online scheduling is being connected. Use email to arrange a conversation in the meantime.
          </p>
          <a
            href="mailto:hi@frpboy.in?subject=Schedule%20a%20conversation"
            className="mt-6 inline-flex min-h-12 items-center border border-system-green/50 px-5 font-mono text-[10px] uppercase tracking-wider text-system-green hover:bg-system-green/10"
          >
            Contact by email
          </a>
        </div>
      )}

      <Link href="/" className="mt-8 w-fit font-mono text-[10px] uppercase tracking-wider text-white/45 hover:text-system-green">
        ← Return to portfolio
      </Link>
    </section>
  );
}
