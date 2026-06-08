'use client'

import { useEffect } from 'react'

interface SchemaMarkup {
  faq?: object
  organization?: object
  website?: object
  breadcrumb?: object
}

export function useSchemaMarkup(schemas: SchemaMarkup) {
  useEffect(() => {
    // Schema injection handled in parent component
  }, [])
}