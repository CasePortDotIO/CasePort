'use client'

import { useField, useFormFields } from '@payloadcms/ui'

const CITIES_BY_STATE: Record<string, string[]> = {
  AL: ['Birmingham', 'Montgomery', 'Mobile', 'Huntsville'],
  AK: ['Anchorage', 'Fairbanks', 'Juneau'],
  AZ: ['Phoenix', 'Tucson', 'Mesa', 'Scottsdale'],
  AR: ['Little Rock', 'Fort Smith', 'Fayetteville'],
  CA: ['Los Angeles', 'San Diego', 'San Francisco', 'Riverside', 'Sacramento', 'San Jose', 'Fresno', 'Long Beach'],
  CO: ['Denver', 'Colorado Springs', 'Aurora', 'Boulder'],
  CT: ['Hartford', 'New Haven', 'Bridgeport', 'Stamford'],
  DE: ['Wilmington', 'Dover', 'Newark'],
  FL: ['Miami', 'Tampa', 'Orlando', 'Jacksonville', 'Fort Lauderdale', 'St. Petersburg', 'Tallahassee'],
  GA: ['Atlanta', 'Augusta', 'Savannah', 'Macon', 'Columbus'],
  HI: ['Honolulu', 'Hilo', 'Kailua'],
  ID: ['Boise', 'Nampa', 'Meridian'],
  IL: ['Chicago', 'Springfield', 'Rockford', 'Peoria', 'Aurora'],
  IN: ['Indianapolis', 'Fort Wayne', 'Evansville', 'South Bend'],
  IA: ['Des Moines', 'Cedar Rapids', 'Davenport'],
  KS: ['Wichita', 'Kansas City', 'Topeka', 'Olathe'],
  KY: ['Louisville', 'Lexington', 'Bowling Green', ' Owensboro'],
  LA: ['New Orleans', 'Baton Rouge', 'Shreveport', 'Lafayette'],
  ME: ['Portland', 'Lewiston', 'Bangor'],
  MD: ['Baltimore', 'Bethesda', 'Rockville', 'Annapolis'],
  MA: ['Boston', 'Worcester', 'Springfield', 'Cambridge'],
  MI: ['Detroit', 'Grand Rapids', 'Lansing', 'Ann Arbor'],
  MN: ['Minneapolis', 'St. Paul', 'Rochester', 'Duluth'],
  MS: ['Jackson', 'Gulfport', 'Southaven'],
  MO: ['Kansas City', 'St. Louis', 'Springfield', 'Columbia'],
  MT: ['Billings', 'Missoula', 'Great Falls'],
  NE: ['Omaha', 'Lincoln', 'Bellevue'],
  NV: ['Las Vegas', 'Reno', 'Henderson', 'Carson City'],
  NH: ['Manchester', 'Nashua', 'Concord'],
  NJ: ['Newark', 'Jersey City', 'Trenton', 'Camden', 'Edison'],
  NM: ['Albuquerque', 'Santa Fe', 'Las Cruces'],
  NY: ['New York', 'Brooklyn', 'Queens', 'Bronx', 'Albany', 'Rochester', 'Syracuse', 'Buffalo'],
  NC: ['Charlotte', 'Raleigh', 'Greensboro', 'Durham', 'Winston-Salem'],
  ND: ['Fargo', 'Bismarck', 'Grand Forks'],
  OH: ['Columbus', 'Cleveland', 'Cincinnati', 'Dayton', 'Toledo', 'Akron'],
  OK: ['Oklahoma City', 'Tulsa', 'Norman', 'Broken Arrow'],
  OR: ['Portland', 'Eugene', 'Salem', 'Bend'],
  PA: ['Philadelphia', 'Pittsburgh', 'Allentown', 'Harrisburg', 'Scranton', 'Reading'],
  RI: ['Providence', 'Warwick', 'Cranston'],
  SC: ['Charleston', 'Columbia', 'Greenville', 'Myrtle Beach'],
  SD: ['Sioux Falls', 'Rapid City', 'Aberdeen'],
  TN: ['Nashville', 'Memphis', 'Knoxville', 'Chattanooga', 'Clarksville'],
  TX: ['Houston', 'Dallas', 'Austin', 'San Antonio', 'Fort Worth', 'El Paso', 'Arlington', 'Corpus Christi'],
  UT: ['Salt Lake City', 'Provo', 'Ogden', 'St. George'],
  VT: ['Burlington', 'Rutland', 'South Burlington'],
  VA: ['Virginia Beach', 'Norfolk', 'Richmond', 'Arlington', 'Newport News'],
  WA: ['Seattle', 'Tacoma', 'Spokane', 'Bellevue', 'Vancouver'],
  WV: ['Charleston', 'Huntington', 'Morgantown'],
  WI: ['Milwaukee', 'Madison', 'Green Bay', 'Kenosha'],
  WY: ['Cheyenne', 'Casper', 'Laramie'],
}

type CityValue = { city: string; state: string }

// Helper to access nested form values
function useFormField(path: string) {
  return useFormFields((fields) => {
    // fields is a tuple: [FormState, Dispatch<FieldAction>]
    const formState = fields[0]
    if (!formState || typeof formState !== 'object') return null

    // Debug: log top-level keys
    console.log('Top-level field keys:', Object.keys(formState))

    // Navigate nested fields: geoOptimization.targetStates
    const parts = path.split('.')
    let value: unknown = formState
    for (const part of parts) {
      if (value && typeof value === 'object' && part in value) {
        value = (value as Record<string, unknown>)[part]
      } else {
        return null
      }
    }
    return value as { value?: unknown } | null
  })
}

export default function TargetCitiesField({ path }: { path: string }) {
  const { value, setValue } = useField<CityValue[]>({ path })

  // Get the targetStates value from geoOptimization group
  const targetStatesWrapper = useFormField('geoOptimization.targetStates')
  const selectedStates: string[] = Array.isArray(targetStatesWrapper?.value) ? targetStatesWrapper.value as string[] : []
  const selectedCities: CityValue[] = Array.isArray(value) ? value : []

  const availableCities: CityValue[] = []
  for (const state of selectedStates) {
    const stateCities = CITIES_BY_STATE[state] || []
    for (const city of stateCities) {
      availableCities.push({ city, state })
    }
  }

  const handleAddCity = (city: string, state: string) => {
    const newCity = { city, state }
    if (!selectedCities.some(c => c.city === city && c.state === state)) {
      setValue([...selectedCities, newCity])
    }
  }

  const handleRemoveCity = (city: string, state: string) => {
    setValue(selectedCities.filter(c => !(c.city === city && c.state === state)))
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
        <label className="field-label" style={{ fontWeight: 600, marginBottom: '0.25rem' }}>
          Target Cities
        </label>
        {selectedStates.length === 0 && (
          <p style={{ color: 'var(--theme-elevation-400)', fontSize: '0.85rem', margin: 0 }}>
            Select Target States first to see available cities.
          </p>
        )}
      </div>

      {availableCities.length > 0 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
          {availableCities.map(({ city, state }) => {
            const isSelected = selectedCities.some(c => c.city === city && c.state === state)
            return (
              <button
                key={`${city}-${state}`}
                type="button"
                onClick={() => isSelected ? handleRemoveCity(city, state) : handleAddCity(city, state)}
                style={{
                  padding: '0.35rem 0.75rem',
                  borderRadius: '6px',
                  border: '1px solid',
                  borderColor: isSelected ? 'var(--color-primary)' : 'var(--theme-elevation-200)',
                  background: isSelected ? 'var(--color-primary)' : 'transparent',
                  color: isSelected ? 'white' : 'var(--theme-elevation-800)',
                  cursor: 'pointer',
                  fontSize: '0.85rem',
                  fontWeight: 500,
                  transition: 'all 0.15s ease',
                }}
              >
                {city}, {state}
              </button>
            )
          })}
        </div>
      )}

      {selectedCities.length > 0 && (
        <div style={{ marginTop: '0.5rem', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
          <span style={{ fontSize: '0.8rem', color: 'var(--theme-elevation-500)', fontWeight: 500 }}>
            Selected ({selectedCities.length}):
          </span>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
            {selectedCities.map(({ city, state }) => (
              <span
                key={`${city}-${state}`}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.25rem',
                  padding: '0.25rem 0.6rem',
                  background: 'var(--theme-elevation-100)',
                  borderRadius: '4px',
                  fontSize: '0.85rem',
                }}
              >
                {city}, {state}
                <button
                  type="button"
                  onClick={() => handleRemoveCity(city, state)}
                  style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    padding: '0',
                    color: 'var(--theme-elevation-500)',
                    fontSize: '1rem',
                    lineHeight: 1,
                  }}
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}