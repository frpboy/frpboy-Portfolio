import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { projects } from "@/lib/data/projects";

const siteUrl = "https://www.frpboy.in";
type PageProps = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.id }));
}

function findProject(slug: string) {
  return projects.find((project) => project.id === slug);
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = findProject(slug);
  if (!project) return { title: "Project not found" };
  const url = siteUrl + "/projects/" + project.id;
  return {
    title: project.title + " — Projects",
    description: project.description,
    alternates: { canonical: "/projects/" + project.id },
    openGraph: {
      type: "article",
      url,
      title: project.title + " — Rahul Muraleedharan",
      description: project.description,
    },
  };
}

export default async function ProjectDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const project = findProject(slug);
  if (!project) notFound();

  const pageUrl = siteUrl + "/projects/" + project.id;
  const workType = project.links?.github ? "SoftwareSourceCode" : "CreativeWork";
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": pageUrl + "#page",
    url: pageUrl,
    name: project.title + " — Rahul Muraleedharan",
    description: project.description,
    mainEntity: {
      "@type": workType,
      "@id": pageUrl + "#work",
      name: project.title,
      description: project.description,
      url: pageUrl,
      ...(project.links?.github ? { codeRepository: project.links.github } : {}),
      ...(project.tech.length ? { programmingLanguage: project.tech } : {}),
    },
  };

  return (
    <article className="mx-auto w-full max-w-4xl flex-1 px-6 py-16 sm:py-24">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData).replace(/</g, "\\u003c") }} />
      <nav aria-label="Breadcrumb" className="font-mono text-[10px] uppercase tracking-wider text-white/45">
        <Link href="/" className="transition-colors hover:text-system-green">Portfolio</Link>
        <span aria-hidden="true"> / </span>
        <Link href="/projects" className="transition-colors hover:text-system-green">Projects</Link>
        <span aria-hidden="true"> / </span>
        <span className="text-system-green">{project.title}</span>
      </nav>
      <header className="mt-8 border-b border-white/10 pb-8">
        <div className="flex flex-wrap items-center gap-3 font-mono text-[9px] uppercase tracking-[0.2em]">
          <span className="text-system-green">{project.category}</span>
          <span className="text-white/25">/</span>
          <span className="text-white/45">{project.status}</span>
        </div>
        <h1 className="mt-5 text-4xl font-black tracking-tight text-white sm:text-6xl">{project.title}</h1>
        <p className="mt-4 text-lg text-white/55">{project.subtitle}</p>
        <p className="mt-6 max-w-3xl text-base leading-8 text-white/70">{project.description}</p>
        <p className="mt-5 font-mono text-[10px] uppercase tracking-wider text-white/45">Role: {project.role}</p>
      </header>

      {project.screenshots?.length ? (
        <section aria-label={project.title + " screenshots"} className="mt-10">
          <h2 className="text-xl font-bold text-white">Screenshots</h2>
          <div className="mt-5 grid gap-5 sm:grid-cols-2">
            {project.screenshots.map((screenshot) => (
              <figure key={screenshot.src} className="overflow-hidden border border-white/10 bg-white/[0.02] p-3">
                <Image src={screenshot.src} alt={screenshot.alt} width={screenshot.width} height={screenshot.height} unoptimized className="h-auto max-h-[32rem] w-full object-contain" />
                <figcaption className="mt-3 text-xs leading-6 text-white/55">{screenshot.alt}</figcaption>
              </figure>
            ))}
          </div>
        </section>
      ) : null}

      <div className="mt-10 space-y-10">
        <section>
          <h2 className="text-xl font-bold text-white">Problem</h2>
          <p className="mt-3 leading-8 text-white/65">{project.problem}</p>
        </section>
        <section>
          <h2 className="text-xl font-bold text-white">Approach</h2>
          <p className="mt-3 leading-8 text-white/65">{project.solution}</p>
        </section>
        <section>
          <h2 className="text-xl font-bold text-white">Contribution and attribution</h2>
          <p className="mt-3 leading-8 text-white/65">{project.contribution}</p>
        </section>
        <section>
          <h2 className="text-xl font-bold text-white">Implementation</h2>
          <p className="mt-3 leading-8 text-white/65">{project.architecture}</p>
          <ul aria-label="Technology stack" className="mt-5 flex flex-wrap gap-2">
            {project.tech.map((technology) => <li key={technology} className="border border-white/10 px-3 py-2 font-mono text-[10px] text-white/55">{technology}</li>)}
          </ul>
        </section>
        <section>
          <h2 className="text-xl font-bold text-white">Status and evidence</h2>
          <p className="mt-3 leading-8 text-white/65">{project.impact}</p>
          <p className="mt-4 border-l-2 border-system-green/40 pl-4 text-sm leading-7 text-white/50">{project.highlight}</p>
        </section>
      </div>

      {(project.links?.github || project.links?.live || project.links?.documentation || project.links?.pullRequest) && (
        <nav aria-label="Project resources" className="mt-12 flex flex-wrap gap-4 border-t border-white/10 pt-7 font-mono text-[10px] uppercase tracking-wider">
          {project.links?.github && <a href={project.links.github} target="_blank" rel="noopener noreferrer" className="text-system-green underline underline-offset-4">Source repository</a>}
          {project.links?.live && <a href={project.links.live} target="_blank" rel="noopener noreferrer" className="text-white/65 underline decoration-white/20 underline-offset-4 hover:text-white">{project.links.liveLabel || "Live website"}</a>}
          {project.links?.documentation && <a href={project.links.documentation} target="_blank" rel="noopener noreferrer" className="text-white/65 underline decoration-white/20 underline-offset-4 hover:text-white">Documentation</a>}
          {project.links?.pullRequest && <a href={project.links.pullRequest} target="_blank" rel="noopener noreferrer" className="text-white/65 underline decoration-white/20 underline-offset-4 hover:text-white">Upstream pull request</a>}
        </nav>
      )}
      <div className="mt-10 flex flex-wrap gap-5 border-t border-white/10 pt-6 font-mono text-[10px] uppercase tracking-wider">
        <Link href="/projects" className="text-system-green underline underline-offset-4">All projects</Link>
        <Link href="/open-source" className="text-white/55 underline decoration-white/20 underline-offset-4 hover:text-white">Open-source work</Link>
      </div>
    </article>
  );
}
