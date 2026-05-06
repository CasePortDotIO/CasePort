'use client'

import { $getSelection, $isRangeSelection, $insertNodes } from 'lexical'
import { $createParagraphNode } from 'lexical'
import {
  createClientFeature,
  slashMenuBasicGroupWithItems,
  toolbarTextDropdownGroupWithItems,
} from '@payloadcms/richtext-lexical/client'
import { CTAButtonNode, $createCTAButtonNode, $isCTAButtonNode } from '@/nodes/CTAButtonNode'

console.log('[CTAButton] Feature client loaded')

const insertCTAButton = ({ editor }: { editor: any }) => {
  console.log('[CTAButton] insertCTAButton called')
  const heading = window.prompt('Enter CTA heading:', 'Ready to Speak with an Attorney?')
  if (!heading) return
  const subHeading = window.prompt('Enter CTA sub-heading:', 'If you or a loved one has been seriously injured, we can help.')
  if (!subHeading) return
  const buttonText = window.prompt('Enter button text:', 'Get Free Consultation')
  if (!buttonText) return
  const buttonUrl = window.prompt('Enter button URL:')
  if (!buttonUrl) return

  editor.update(() => {
    const selection = $getSelection()
    if ($isRangeSelection(selection)) {
      const ctaNode = $createCTAButtonNode(heading, subHeading, buttonText, buttonUrl)
      $insertNodes([ctaNode])
      const paragraph = $createParagraphNode()
      ctaNode.insertAfter(paragraph)
      paragraph.selectEnd()
    }
  })
}

const isActiveCTANode = ({ selection }: { selection: any }) => {
  if (!$isRangeSelection(selection)) return false
  for (const node of selection.getNodes()) {
    if ($isCTAButtonNode(node)) return true
  }
  return false
}

const toolbarGroups = [
  toolbarTextDropdownGroupWithItems([
    {
      ChildComponent: () => (
        <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
          <rect x={3} y={8} width={18} height={8} rx={4} />
          <line x1={8} y1={12} x2={16} y2={12} />
        </svg>
      ),
      isActive: isActiveCTANode,
      key: 'cta-button',
      label: () => 'Insert CTA Button',
      onSelect: insertCTAButton,
      order: 30,
    },
  ]),
]

export const CTAButtonFeatureClient = createClientFeature({
  nodes: [CTAButtonNode],
  slashMenu: {
    groups: [
      slashMenuBasicGroupWithItems([
        {
          Icon: () => (
            <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
              <rect x={3} y={8} width={18} height={8} rx={4} />
              <line x1={8} y1={12} x2={16} y2={12} />
            </svg>
          ),
          key: 'cta-button',
          keywords: ['cta', 'button', 'call to action'],
          label: () => 'CTA Button',
          onSelect: insertCTAButton,
        },
      ]),
    ],
  },
  toolbarFixed: {
    groups: toolbarGroups,
  },
  toolbarInline: {
    groups: toolbarGroups,
  },
})

console.log('[CTAButton] CTAButtonFeatureClient created')
