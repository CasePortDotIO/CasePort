import { createServerFeature } from '@payloadcms/richtext-lexical'

export const CTAButtonFeature = createServerFeature({
  feature: {
    ClientFeature: '@/features/CTAButton/client#CTAButtonFeatureClient',
    clientFeatureProps: null,
  },
  key: 'cta-button',
})
