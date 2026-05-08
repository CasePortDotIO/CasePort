'use client'

export default function PreviewButton() {
  const handlePreview = () => {
    const pathParts = window.location.pathname.split('/').filter(Boolean)
    const docId = pathParts[pathParts.length - 1]
    if (docId && docId !== 'collections') {
      const previewUrl = `/api/preview?id=${docId}`
      window.open(previewUrl, '_blank')
    } else {
      alert('Could not find article ID. URL: ' + window.location.pathname)
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
          gap: '8px',
          padding: '10px 16px',
          backgroundColor: '#22c55e',
          color: 'white',
          border: 'none',
          borderRadius: '6px',
          fontSize: '14px',
          fontWeight: 500,
          cursor: 'pointer',
          transition: 'background-color 0.2s',
          width: '100%',
          justifyContent: 'center',
        }}
        onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#16a34a')}
        onMouseOut={(e) => (e.currentTarget.style.backgroundColor = '#22c55e')}
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
        Preview Article
      </button>
    </div>
  )
}