import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { articles } from "@/lib/data/articles";

const siteUrl = "https://www.frpboy.in";
type PageProps = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return articles.map((item) => ({ slug: item.slug }));
}

const scrobblixArticle = articles.find((item) => item.slug === "scrobblix-unknown-submissions");

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const item = articles.find((article) => article.slug === slug);
  if (!item) return { title: "Article not found" };
  const url = siteUrl + "/writing/" + item.slug;
  return {
    title: item.title,
    description: item.excerpt,
    alternates: { canonical: "/writing/" + item.slug },
    openGraph: {
      type: "article",
      url,
      title: item.title,
      description: item.excerpt,
      publishedTime: item.publishedAt,
      modifiedTime: item.updatedAt,
      authors: ["https://www.frpboy.in/about"],
      tags: item.tags,
    },
  };
}

function ScrobblixUnknownSubmissionsArticle() {
  return (
    <>
      <p className="text-lg leading-8 text-white/75">
        A scrobble is more than an HTTP request. It is a record of a listening event, and a trustworthy client has to explain what happened when delivery is interrupted. The difficult case is not a clear success or a clear rejection. It is the request that may have reached Last.fm even though the app never received—or never saved—the acknowledgement.
      </p>

      <section className="mt-10 space-y-4">
        <h2 className="text-2xl font-bold text-white">The dangerous assumption behind automatic retries</h2>
        <p className="leading-8 text-white/70">
          Imagine the app sends a scrobble, the provider accepts it, and the process exits before the local database records the response. When the app starts again, the local queue still looks unfinished. Retrying immediately may submit the same listening event twice.
        </p>
        <p className="leading-8 text-white/70">
          A timeout or a lost response does not prove that the provider rejected the request. The remote action and the local record can disagree for a short period. Treating every missing response as a transient failure quietly turns a recovery mechanism into a duplicate generator.
        </p>
        <p className="leading-8 text-white/70">
          Scrobblix therefore models an unknown submission outcome as its own state. The goal is not to make ambiguity disappear; it is to keep that ambiguity visible until there is enough evidence to act safely.
        </p>
      </section>

      <section className="mt-10 space-y-4">
        <h2 className="text-2xl font-bold text-white">Local idempotency is not provider-side idempotency</h2>
        <p className="leading-8 text-white/70">
          Before delivery, Scrobblix builds a stable local action key from the provider, account, action type, and play ID. Each part is length-prefixed before concatenation, so identifiers containing the same separator characters cannot accidentally produce the same composite string.
        </p>
        <pre className="overflow-x-auto border border-white/10 bg-black/50 p-4 text-xs leading-6 text-system-green"><code>{"Encode(provider) + Encode(accountId) + Encode(actionType) + Encode(playId)"}</code></pre>
        <p className="leading-8 text-white/70">
          That key helps deduplicate actions in the local queue. It does not make Last.fm&apos;s API idempotent, and it cannot tell the client whether a request was accepted remotely. Those are separate guarantees; confusing them is the root of many unsafe retry designs.
        </p>
        <p className="leading-8 text-white/70">
          Source: <a className="text-system-green underline underline-offset-4" href="https://github.com/frpboy/Scrobblix/blob/main/src/Scrobblix.Domain/Queue/ProviderActionIdempotencyKey.cs" target="_blank" rel="noopener noreferrer">ProviderActionIdempotencyKey.cs</a>.
        </p>
      </section>

      <section className="mt-10 space-y-4">
        <h2 className="text-2xl font-bold text-white">Lease the work, then classify the result</h2>
        <p className="leading-8 text-white/70">
          The SQLite store claims one due action inside a transaction, marks it <code className="text-system-green">InFlight</code>, increments its attempt count, and assigns a one-minute lease to the worker. The processor then submits the action and persists a classified outcome: provider accepted, provider ignored, authentication blocked, retry scheduled, retry exhausted, permanent failure, or submission outcome unknown.
        </p>
        <p className="leading-8 text-white/70">
          The lease makes worker ownership explicit. If the process disappears and the lease expires, recovery treats a scrobble differently from an ephemeral action: a scrobble becomes <code className="text-system-green">SubmissionOutcomeUnknown</code>, while other action types can be returned to the retry path. This is deliberately conservative because scrobble duplication is harder to undo than a missed transient update.
        </p>
        <p className="leading-8 text-white/70">
          Now-playing updates have a different lifetime again. They describe the current listening state, not a permanent history event, so stale queued now-playing actions are cancelled after the five-minute freshness window instead of being replayed much later.
        </p>
        <p className="leading-8 text-white/70">
          Sources: <a className="text-system-green underline underline-offset-4" href="https://github.com/frpboy/Scrobblix/blob/main/src/Scrobblix.Infrastructure/Storage/SqliteProviderActionStore.cs" target="_blank" rel="noopener noreferrer">SqliteProviderActionStore.cs</a> and <a className="text-system-green underline underline-offset-4" href="https://github.com/frpboy/Scrobblix/blob/main/src/Scrobblix.Application/Queue/ProviderActionProcessor.cs" target="_blank" rel="noopener noreferrer">ProviderActionProcessor.cs</a>.
        </p>
      </section>

      <section className="mt-10 space-y-4">
        <h2 className="text-2xl font-bold text-white">Bound retries instead of retrying forever</h2>
        <p className="leading-8 text-white/70">
          For transient outcomes, the processor honours a positive provider retry hint but caps it at 24 hours. When there is no usable hint, it applies exponential backoff: one, two, four, eight, sixteen, thirty-two, then sixty minutes. Automatic delivery is bounded at eight attempts; after that, the item becomes <code className="text-system-green">RetryExhausted</code> and needs attention.
        </p>
        <p className="leading-8 text-white/70">
          Authentication failure is not treated as a normal network retry. It moves the action into an authentication-blocked state so the account can be repaired before those actions resume. Provider-declared ignored events and permanent failures are also recorded as distinct outcomes, rather than being folded into a generic red error.
        </p>
      </section>

      <section className="mt-10 space-y-4">
        <h2 className="text-2xl font-bold text-white">Recovery needs evidence, not a guess</h2>
        <p className="leading-8 text-white/70">
          The queue presenter deliberately separates three meanings that can otherwise look like the same green “success” label: accepted by the provider, confirmed locally by the user, and a legacy accepted state whose evidence is unspecified. A local confirmation records what the user checked; it does not make a new request to Last.fm or manufacture a provider acknowledgement.
        </p>
        <p className="leading-8 text-white/70">
          The confirmation guidance asks for the exact play: match its start time, artist, and track on the user&apos;s Last.fm profile. Seeing the same song earlier is not proof that this particular play was delivered. The interface also shows the original play start separately from the queue due time, because a retry schedule can move while the listening event&apos;s timestamp must not.
        </p>
        <p className="leading-8 text-white/70">
          The domain test suite uses a synthetic play to assert these distinctions, including unknown outcome, provider acceptance, local confirmation, unspecified legacy evidence, missing play-start time, and the difference between play-start and queue-due labels. These are deterministic tests of the state and presentation rules, not a real-account delivery soak test.
        </p>
        <p className="leading-8 text-white/70">
          Sources: <a className="text-system-green underline underline-offset-4" href="https://github.com/frpboy/Scrobblix/blob/main/src/Scrobblix.Application/ReadModels/QueueActionPresenter.cs" target="_blank" rel="noopener noreferrer">QueueActionPresenter.cs</a> and <a className="text-system-green underline underline-offset-4" href="https://github.com/frpboy/Scrobblix/blob/main/tests/Scrobblix.Domain.Tests/Program.cs" target="_blank" rel="noopener noreferrer">Scrobblix.Domain.Tests</a>.
        </p>
      </section>

      <section className="mt-10 space-y-4">
        <h2 className="text-2xl font-bold text-white">What the current release does—and does not—prove</h2>
        <p className="leading-8 text-white/70">
          The Windows beta 11 preview, published on 11 November 2026, improves how the queue displays the original play time, mutable queue due time, provider-versus-local acceptance evidence, and unknown-outcome guidance. Its release notes explicitly say the update does not clear, retry, or reconcile queue rows. It is an evidence-clarity change, not a new claim that uncertain submissions have been delivered.
        </p>
        <p className="leading-8 text-white/70">
          Scrobblix remains a development-preview project. The Windows beta 11 installer is unsigned and manually updated; Android has a separate alpha release track. Real-account/device soak, credential migration, interrupted-upgrade rollback, and other release gates remain distinct from the synthetic state-machine tests.
        </p>
        <p className="leading-8 text-white/70">
          See the <a className="text-system-green underline underline-offset-4" href="https://github.com/frpboy/Scrobblix/releases/tag/windows-v0.1.0-beta.11" target="_blank" rel="noopener noreferrer">Windows beta 11 release notes</a>, the <a className="text-system-green underline underline-offset-4" href="https://github.com/frpboy/Scrobblix/blob/main/docs/RELEASE_PROCESS.md" target="_blank" rel="noopener noreferrer">release process</a>, and the <Link className="text-system-green underline underline-offset-4" href="/projects/scrobblix">Scrobblix project page</Link> for the current evidence and limitations.
        </p>
      </section>

      <blockquote className="mt-12 border-l-2 border-system-green/50 pl-5 text-base leading-8 text-white/70">
        A durable queue should never convert “I don&apos;t know whether the provider received it” into “send it again.” Unknown is a real state, and a useful interface gives the user enough evidence to decide what happens next.
      </blockquote>
    </>
  );
}

export default async function WritingArticlePage({ params }: PageProps) {
  const { slug } = await params;
  const item = articles.find((article) => article.slug === slug);
  if (!item) notFound();
  if (!scrobblixArticle || item.slug !== scrobblixArticle.slug) notFound();

  const url = siteUrl + "/writing/" + item.slug;
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "TechArticle",
    headline: item.title,
    description: item.excerpt,
    datePublished: item.publishedAt,
    dateModified: item.updatedAt,
    author: {
      "@type": "Person",
      name: "Rahul Muraleedharan",
      url: siteUrl + "/about",
      sameAs: ["https://github.com/frpboy", "https://www.linkedin.com/in/rahul-muraleedharan-it/"],
    },
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    keywords: item.tags.join(", "),
  };

  return (
    <article className="mx-auto w-full max-w-4xl flex-1 px-6 py-16 sm:py-24">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData).replace(/</g, "\\u003c") }} />
      <nav aria-label="Breadcrumb" className="font-mono text-[10px] uppercase tracking-wider text-white/45">
        <Link href="/" className="transition-colors hover:text-system-green">Portfolio</Link>
        <span aria-hidden="true"> / </span>
        <Link href="/writing" className="transition-colors hover:text-system-green">Writing</Link>
        <span aria-hidden="true"> / </span>
        <span className="text-system-green">Scrobblix</span>
      </nav>
      <header className="mt-8 border-b border-white/10 pb-8">
        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-system-green">Case study // reliable software</p>
        <h1 className="mt-5 text-3xl font-black leading-tight tracking-tight text-white sm:text-5xl">{item.title}</h1>
        <p className="mt-6 max-w-3xl text-base leading-8 text-white/65">{item.excerpt}</p>
        <div className="mt-5 flex flex-wrap gap-4 font-mono text-[9px] uppercase tracking-wider text-white/45">
          <time dateTime={item.publishedAt}>{item.dateLabel}</time>
          <span>{item.readingMinutes} min read</span>
          <span>By Rahul Muraleedharan</span>
        </div>
        <ul aria-label="Article topics" className="mt-5 flex flex-wrap gap-2">
          {item.tags.map((tag) => <li key={tag} className="border border-white/10 px-2 py-1 font-mono text-[9px] text-white/45">{tag}</li>)}
        </ul>
      </header>
      <div className="mt-10 max-w-none">
        <ScrobblixUnknownSubmissionsArticle />
      </div>
      <footer className="mt-14 border-t border-white/10 pt-6">
        <p className="text-sm leading-7 text-white/55">
          Source-first engineering notes by Rahul Muraleedharan. Claims in this article link to Scrobblix source, tests, or published release notes; no user counts, delivery rates, or performance results are inferred.
        </p>
        <nav aria-label="Related resources" className="mt-6 flex flex-wrap gap-5 font-mono text-[10px] uppercase tracking-wider">
          <Link href="/projects/scrobblix" className="text-system-green underline underline-offset-4">Scrobblix project</Link>
          <Link href="/open-source" className="text-white/60 underline decoration-white/20 underline-offset-4 hover:text-white">Open-source work</Link>
          <Link href="/writing" className="text-white/60 underline decoration-white/20 underline-offset-4 hover:text-white">All writing</Link>
        </nav>
      </footer>
    </article>
  );
}
