import type { Metadata } from "next";
import Link from "next/link";
import CalInlineEmbed from "@/components/os/CalInlineEmbed";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Book a call",
  description: "Book a short call with Rahul Muraleedharan about development, automation, or a technical project.",
  alternates: { canonical: "/book" },
};

const DEFAULT_BOOKING_URL = "https://cal.com/frpboy/strategy";

function getCalLink(url: string): string | null {
  try {
    const u = new URL(url);
    if (u.hostname !== "cal.com" && u.hostname !== "www.cal.com" && u.hostname !== "app.cal.com") return null;
    const path = u.pathname.replace(/^\/+|\/+$/g, "");
    return path || null;
  } catch {
    return null;
  }
}

function getBookingUrl(): string | null {
  const value = process.env.CALCOM_BOOKING_URL || DEFAULT_BOOKING_URL;

  try {
    const url = new URL(value);
    return url.protocol === "https:" ? url.toString() : null;
  } catch {
    return null;
  }
}

export default function BookPage() {
  const bookingUrl = getBookingUrl();
  const calLink = bookingUrl ? getCalLink(bookingUrl) : null;

  return (
    <section className="mx-auto flex w-full max-w-3xl flex-1 flex-col justify-center px-5 py-20 sm:px-8">
      <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-system-green">Scheduling / Cal.com</p>
      <h1 className="mt-4 text-4xl font-black uppercase tracking-tight text-white sm:text-6xl">
        Let&apos;s talk<span className="text-system-green">.</span>
      </h1>
      <p className="mt-5 max-w-xl text-sm leading-relaxed text-white/55 sm:text-base">
        Book a short call about development, automation, or a technical project. Pick a time on Cal.com, or email me if that suits you better.
      </p>

      {bookingUrl ? (
        <div className="mt-10 border border-system-green/25 bg-system-green/[0.04] p-5 sm:p-7">
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-system-green">Cal.com booking</p>
          <p className="mt-3 text-sm leading-relaxed text-white/65">
            Pick a call length and a time below. The calendar is provided by Cal.com, which handles your booking and confirmation. If it does not load, use the links underneath.
          </p>
          {calLink ? <CalInlineEmbed calLink={calLink} /> : null}
          <div className="mt-6 flex flex-wrap gap-3">
          <a
            href={bookingUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-12 items-center border border-system-green/50 bg-system-green/10 px-5 font-mono text-[10px] uppercase tracking-wider text-system-green transition-colors hover:bg-system-green/15"
          >
            Open booking calendar
          </a>
          <a
            href="mailto:frpboy12@gmail.com?subject=Schedule%20a%20conversation"
            className="inline-flex min-h-12 items-center border border-white/20 px-5 font-mono text-[10px] uppercase tracking-wider text-white/70 transition-colors hover:border-white/45 hover:text-white"
          >
            Email instead
          </a>
          </div>
        </div>
      ) : (
        <div className="mt-10 border border-white/10 bg-white/[0.03] p-5 sm:p-7">
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/45">Calendar configuration pending</p>
          <p className="mt-3 text-sm leading-relaxed text-white/65">
            Online scheduling is being connected. Use email to arrange a conversation in the meantime.
          </p>
          <a
            href="mailto:frpboy12@gmail.com?subject=Schedule%20a%20conversation"
            className="inline-flex min-h-12 items-center border border-system-green/50 px-5 font-mono text-[10px] uppercase tracking-wider text-system-green hover:bg-system-green/10"
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
