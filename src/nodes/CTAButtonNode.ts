import { ElementNode, LexicalNode, SerializedElementNode } from 'lexical'

export type SerializedCTAButtonNode = SerializedElementNode & {
  type: 'cta-button'
  heading: string
  subHeading: string
  buttonText: string
  buttonUrl: string
}

export class CTAButtonNode extends ElementNode {
  __heading: string
  __subHeading: string
  __buttonText: string
  __buttonUrl: string

  static getType(): 'cta-button' {
    return 'cta-button'
  }

  static clone(node: CTAButtonNode): CTAButtonNode {
    return new CTAButtonNode(
      node.__heading,
      node.__subHeading,
      node.__buttonText,
      node.__buttonUrl,
      node.__key,
    )
  }

  static importJSON(data: SerializedCTAButtonNode): CTAButtonNode {
    return new CTAButtonNode(
      data.heading || '',
      data.subHeading || '',
      data.buttonText || '',
      data.buttonUrl || '',
    )
  }

  constructor(
    heading: string,
    subHeading: string,
    buttonText: string,
    buttonUrl: string,
    key?: LexicalNode['__key'],
  ) {
    super(key)
    this.__heading = heading
    this.__subHeading = subHeading
    this.__buttonText = buttonText
    this.__buttonUrl = buttonUrl
  }

  getHeading(): string {
    return this.__heading
  }

  setHeading(heading: string): void {
    const writable = this.getWritable()
    writable.__heading = heading
  }

  getSubHeading(): string {
    return this.__subHeading
  }

  setSubHeading(subHeading: string): void {
    const writable = this.getWritable()
    writable.__subHeading = subHeading
  }

  getButtonText(): string {
    return this.__buttonText
  }

  setButtonText(text: string): void {
    const writable = this.getWritable()
    writable.__buttonText = text
  }

  getButtonUrl(): string {
    return this.__buttonUrl
  }

  setButtonUrl(url: string): void {
    const writable = this.getWritable()
    writable.__buttonUrl = url
  }

  createDOM(): HTMLDivElement {
    const dom = document.createElement('div')
    dom.className = 'cta-button-node'
    dom.style.cssText = `
      border: 2px dashed #3b82f6;
      border-radius: 12px;
      padding: 20px;
      margin: 16px 0;
      background: linear-gradient(to right, #1e3a5f, #0f172a);
      color: white;
      text-align: center;
      font-family: system-ui, sans-serif;
      min-height: 80px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
    `
    dom.innerHTML = `
      <div style="max-width: 400px;">
        <h4 style="margin: 0 0 8px 0; font-size: 18px; font-weight: bold; color: white;">${this.__heading || 'CTA Heading'}</h4>
        <p style="margin: 0 0 12px 0; font-size: 14px; opacity: 0.9; color: #cbd5e1;">${this.__subHeading || 'CTA sub-heading'}</p>
        <a href="${this.__buttonUrl || '#'}" style="
          display: inline-block;
          padding: 10px 24px;
          background: #3b82f6;
          color: white;
          border-radius: 8px;
          text-decoration: none;
          font-weight: 600;
          font-size: 14px;
        " target="_blank" rel="noopener noreferrer">${this.__buttonText || 'Button'}</a>
      </div>
    `
    return dom
  }

  updateDOM(_prevNode: CTAButtonNode): boolean {
    return true
  }

  exportJSON(): SerializedCTAButtonNode {
    return {
      ...super.exportJSON(),
      type: 'cta-button' as const,
      heading: this.__heading,
      subHeading: this.__subHeading,
      buttonText: this.__buttonText,
      buttonUrl: this.__buttonUrl,
      version: 1,
    }
  }

  importJSON(data: SerializedCTAButtonNode): CTAButtonNode {
    return new CTAButtonNode(
      data.heading || '',
      data.subHeading || '',
      data.buttonText || '',
      data.buttonUrl || '',
    )
  }
}

export function $createCTAButtonNode(
  heading: string,
  subHeading: string,
  buttonText: string,
  buttonUrl: string,
): CTAButtonNode {
  return new CTAButtonNode(heading, subHeading, buttonText, buttonUrl)
}

export function $isCTAButtonNode(node: LexicalNode | null | undefined): boolean {
  return node instanceof CTAButtonNode
}
