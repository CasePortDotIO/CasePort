import { useEffect } from 'react';

/**
 * Hook to inject JSON-LD schema markup into the page head
 * Supports multiple schemas per page for comprehensive AEO coverage
 */
export const useSchemaMarkup = (schemas: Record<string, any> | Record<string, any>[]) => {
  useEffect(() => {
    // Normalize schemas to array
    const schemaArray = Array.isArray(schemas) ? schemas : Object.values(schemas);

    // Create and inject script tags for each schema
    const scriptTags = schemaArray.map((schema) => {
      const script = document.createElement('script');
      script.type = 'application/ld+json';
      script.textContent = JSON.stringify(schema);
      document.head.appendChild(script);
      return script;
    });

    // Cleanup: remove scripts on unmount
    return () => {
      scriptTags.forEach((script) => script.remove());
    };
  }, [schemas]);
};

/**
 * Hook to inject a single schema markup
 */
export const useSingleSchemaMarkup = (schema: Record<string, any> | null) => {
  useEffect(() => {
    if (!schema) return;

    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify(schema);
    document.head.appendChild(script);

    return () => {
      script.remove();
    };
  }, [schema]);
};
