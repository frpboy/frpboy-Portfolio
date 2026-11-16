import type { MDXComponents } from "mdx/types";

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    h2: (props) => <h2 className="mt-10 text-2xl font-bold text-white" {...props} />,
    h3: (props) => <h3 className="mt-8 text-xl font-bold text-white" {...props} />,
    p: (props) => <p className="mt-4 leading-8 text-white/70" {...props} />,
    a: (props) => <a className="text-system-green underline underline-offset-4" {...props} />,
    ul: (props) => <ul className="mt-4 list-disc space-y-2 pl-6 leading-8 text-white/70" {...props} />,
    ol: (props) => <ol className="mt-4 list-decimal space-y-2 pl-6 leading-8 text-white/70" {...props} />,
    blockquote: (props) => <blockquote className="mt-8 border-l-2 border-system-green/50 pl-5 leading-8 text-white/70" {...props} />,
    code: (props) => <code className="text-system-green" {...props} />,
    pre: (props) => <pre className="mt-4 overflow-x-auto border border-white/10 bg-black/50 p-4 text-xs leading-6 text-system-green" {...props} />,
    hr: () => <hr className="my-10 border-white/10" />,
    ...components,
  };
}
