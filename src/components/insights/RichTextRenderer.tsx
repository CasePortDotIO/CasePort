import { RichText, defaultJSXConverters } from '@payloadcms/richtext-lexical/react'

const jsxConverters: any = {
  ...defaultJSXConverters,
  heading: ({ node, nodesToJSX }: { node: any; nodesToJSX: any }) => {
    if (node.tag === 'h2') {
      const id = node.children[0]?.text?.toLowerCase().replace(/\s+/g, '-')
      return (
        <h2
          id={id}
          data-section
          className="text-4xl lg:text-5xl font-bold text-slate-900 mb-12 opacity-100 translate-y-0"
        >
          {nodesToJSX({ nodes: node.children })}
        </h2>
      )
    }
    return <node.tag>{nodesToJSX({ nodes: node.children })}</node.tag>
  },
  paragraph: ({ node, nodesToJSX }: { node: any; nodesToJSX: any }) => {
    return (
      <p className="text-lg text-slate-700 leading-[2] mb-12">
        {nodesToJSX({ nodes: node.children })}
      </p>
    )
  },
  quote: ({ node, nodesToJSX }: { node: any; nodesToJSX: any }) => {
    return (
      <blockquote className="my-24 lg:my-32 pl-8 border-l-4 border-cyan-400 bg-gradient-to-r from-cyan-50 to-transparent py-8 pr-8 rounded-r-lg">
        <p className="text-2xl font-semibold text-slate-900 italic">
          {nodesToJSX({ nodes: node.children })}
        </p>
      </blockquote>
    )
  },
}

export const CustomRichText = ({ content }: { content: any }) => {
  if (!content) return null
  return <RichText data={content} converters={jsxConverters} />
}

export function extractHeaders(content: any) {
  if (!content?.root?.children) return []
  return content.root.children
    .filter((n: any) => n.type === 'heading' && n.tag === 'h2')
    .map((n: any) => n.children[0]?.text || '')
}
