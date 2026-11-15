import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Website terms | Rahul Muraleedharan (FrpBoy)",
  description: "Terms for using frpboy.in and the FrpBoy project websites.",
  alternates: { canonical: "/terms" },
};

const sections: { heading: string; paragraphs: string[] }[] = [
  {
    "heading": "About these sites",
    "paragraphs": [
      "These sites are maintained by Rahul Muraleedharan, known as FrpBoy, based in Kerala, India. They describe independent software projects and link to project pages, downloads, support and external services. For questions about these terms, contact frpboy12@gmail.com."
    ]
  },
  {
    "heading": "Information and downloads",
    "paragraphs": [
      "Features, screenshots and development plans describe the version or preview identified on the page. A preview is not a promise that a feature is available in the current public release. Check release notes, supported platforms and installation instructions before installing software. Downloaded software is governed by its own license and applicable app terms."
    ]
  },
  {
    "heading": "Use of the sites",
    "paragraphs": [
      "Do not use these sites to break the law, interfere with their operation, distribute malware, impersonate someone, access information without permission, or infringe another person's privacy or intellectual-property rights. These rules do not restrict lawful security research carried out with permission or rights granted under a software license."
    ]
  },
  {
    "heading": "Copyright and software rights",
    "paragraphs": [
      "Original site material is protected by applicable copyright law. Third-party material, project code, fonts, icons, media and other components retain their own owners and licenses. A software license, including an open-source license, controls the rights it grants; these website terms do not take those rights away. Contact us if you need permission not already granted by law or a stated license."
    ]
  },
  {
    "heading": "External services and privacy",
    "paragraphs": [
      "External services operate under their own terms and privacy notices. Following a download, support, donation, booking or retailer link may take you to another service. Read the privacy notice for the site or app you actually use. An app privacy policy does not automatically describe the website that introduces it."
    ]
  },
  {
    "heading": "Availability, legal rights and changes",
    "paragraphs": [
      "We do not promise uninterrupted availability or that all information is free from errors. Nothing in these terms excludes a right, remedy or liability that applicable law does not allow to be excluded. These terms are intended to operate under applicable Indian law without taking away mandatory protections or access to competent courts or statutory forums. Material updates will be identified on this page with their revision date."
    ]
  }
];

export default function TermsPage() {
  return (
    <article className="mx-auto w-full max-w-3xl flex-1 px-6 pb-32 pt-16 sm:py-24">
      <p className="font-mono text-xs uppercase tracking-[0.3em] text-system-green">LEGAL // FRPBOY.IN</p>
      <h1 className="mt-5 text-4xl font-black tracking-tight text-white sm:text-5xl">Website terms</h1>
      <p className="mt-4 text-base text-white/60">Last updated 15 November 2026.</p>
      {sections.map((section) => (
        <section key={section.heading}>
          <h2 className="mt-12 text-2xl font-bold text-white">{section.heading}</h2>
          {section.paragraphs.map((paragraph) => (
            <p key={paragraph} className="mt-4 text-base leading-8 text-white/70">
              {paragraph.split("frpboy12@gmail.com").flatMap((part, index, parts) =>
                index < parts.length - 1
                  ? [part, <a key={index} href="mailto:frpboy12@gmail.com" className="text-system-green underline">frpboy12@gmail.com</a>]
                  : [part],
              )}
            </p>
          ))}
        </section>
      ))}
    </article>
  );
}
