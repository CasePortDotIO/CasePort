import { RichText, defaultJSXConverters } from '@payloadcms/richtext-lexical/react'

const jsxConverters: any = {
  ...defaultJSXConverters,
  'cta-button': ({ node }: { node: any }) => {
    const { heading, subHeading, buttonText, buttonUrl } = node
    return (
      <div className="cta-block my-12 py-8 px-6 lg:my-16 lg:py-12 lg:px-10 rounded-xl text-left bg-linear-to-br from-slate-900 via-slate-800 to-slate-900 shadow-xl">
        <h3 className="text-xl lg:text-2xl font-bold text-white mb-2">
          {heading || 'Ready to Speak with an Attorney?'}
        </h3>
        <p className="text-slate-300 text-base lg:text-lg mb-6">
          {subHeading || 'Get the legal help you deserve today.'}
        </p>
        <a
          href={buttonUrl || '#'}
          target="_blank"
          rel="noopener noreferrer"
          className="cta-button cta-button--primary inline-block px-6 py-3 rounded-lg font-bold text-left transition-all cursor-pointer text-base lg:text-lg"
          style={{ background: 'linear-gradient(to right, #00b5dd, #2684ff)', color: 'white' }}
        >
          {buttonText || 'Get Free Consultation'}
        </a>
      </div>
    )
  },
  heading: ({ node, nodesToJSX }: { node: any; nodesToJSX: any }) => {
    if (node.tag === 'h2') {
      const id = node.children[0]?.text?.toLowerCase().replace(/\s+/g, '-')
      return (
        <h2
          id={id}
          data-section
          className="text-4xl lg:text-5xl font-bold text-slate-900 mb-12 mt-16 opacity-100 translate-y-0"
        >
          {nodesToJSX({ nodes: node.children })}
        </h2>
      )
    }
    if (node.tag === 'h3') {
      return (
        <h3 className="text-2xl lg:text-3xl font-bold text-slate-900 mb-6 mt-12">
          {nodesToJSX({ nodes: node.children })}
        </h3>
      )
    }
    if (node.tag === 'h4') {
      return (
        <h4 className="text-xl lg:text-2xl font-bold text-slate-900 mb-4 mt-8">
          {nodesToJSX({ nodes: node.children })}
        </h4>
      )
    }
    if (node.tag === 'h5' || node.tag === 'h6') {
      return (
        <node.tag className="text-lg lg:text-xl font-bold text-slate-900 mb-4 mt-6">
          {nodesToJSX({ nodes: node.children })}
        </node.tag>
      )
    }
    return (
      <node.tag className="font-bold text-slate-900 mb-4 mt-6">
        {nodesToJSX({ nodes: node.children })}
      </node.tag>
    )
  },
  paragraph: ({ node, nodesToJSX }: { node: any; nodesToJSX: any }) => {
    return (
      <p className="text-lg text-slate-800 leading-relaxed mb-8">
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
  list: ({ node, nodesToJSX }: { node: any; nodesToJSX: any }) => {
    const Tag = node.tag === 'ul' ? 'ul' : 'ol'
    return (
      <Tag className="text-lg text-slate-800 mb-8 ml-6 list-disc list-outside space-y-2">
        {nodesToJSX({ nodes: node.children })}
      </Tag>
    )
  },
  listitem: ({ node, nodesToJSX }: { node: any; nodesToJSX: any }) => {
    return (
      <li className="text-slate-800 leading-relaxed">{nodesToJSX({ nodes: node.children })}</li>
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
