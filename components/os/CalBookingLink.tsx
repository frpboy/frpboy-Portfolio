function getBookingUrl(): string | null {
  const value = process.env.CALCOM_BOOKING_URL;
  if (!value) return null;

  try {
    const url = new URL(value);
    if (url.protocol !== "https:") return null;
    return url.toString();
  } catch {
    return null;
  }
}

export default function CalBookingLink() {
  const bookingUrl = getBookingUrl();
  if (!bookingUrl) return null;

  return (
    <a
      href={bookingUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex min-h-11 items-center border border-system-green/35 bg-system-green/[0.06] px-4 py-3 font-mono text-[10px] uppercase tracking-wide text-system-green transition-colors hover:border-system-green hover:bg-system-green/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-system-green"
    >
      Schedule a call
    </a>
  );
}
