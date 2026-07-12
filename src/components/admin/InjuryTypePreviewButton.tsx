'use client'

export default function InjuryTypePreviewButton() {
  const handlePreview = () => {
    const pathParts = window.location.pathname.split('/').filter(Boolean)
    const docId = pathParts[pathParts.length - 1]
    if (docId && docId !== 'collections') {
      const previewUrl = `/api/preview?id=${docId}&collection=injuryTypes`
      window.open(previewUrl, '_blank')
    } else {
      alert('Could not find page ID. URL: ' + window.location.pathname)
    }
  }

  return (
    <div style={{ paddingBottom: '12px' }}>
      <button
        type="button"
        onClick={handlePreview}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '8px',
          padding: '10px 16px',
          background: 'linear-gradient(to right, #00B4D8, #5BB6C9, #7C5CFF)',
          color: 'white',
          border: 'none',
          borderRadius: '6px',
          fontSize: '13px',
          fontWeight: 600,
          cursor: 'pointer',
          width: '100%',
          boxShadow: '0 0 24px rgba(0,212,255,0.2)',
          transition: 'box-shadow 0.2s',
        }}
        onMouseOver={(e) => (e.currentTarget.style.boxShadow = '0 0 32px rgba(0,212,255,0.3)')}
        onMouseOut={(e) => (e.currentTarget.style.boxShadow = '0 0 24px rgba(0,212,255,0.2)')}
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
          <circle cx="12" cy="12" r="3" />
        </svg>
        Preview Injury Type
      </button>
    </div>
  )
}
