import { useEffect, useState } from 'react'

import useLocationSearch from '../hooks/useLocationSearch'
import './LocationInput.css'

type LocationInputProps = {
  onLocationSelect: (location: { latitude: number; longitude: number }) => void
}

const LocationInput: React.FC<LocationInputProps> = ({ onLocationSelect }) => {
  const [query, setQuery] = useState('')
  const { suggestions, error, isLoading, searchLocation, clearSearch } =
    useLocationSearch()

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value)
  }

  useEffect(() => {
    if (!query.trim()) {
      clearSearch()
      return
    }

    const timerId = setTimeout(() => {
      void searchLocation(query)
    }, 350)

    return () => {
      clearTimeout(timerId)
    }
  }, [query, searchLocation, clearSearch])

  const handleSelectResult = (latitude: number, longitude: number, displayName: string) => {
    onLocationSelect({ latitude, longitude })
    setQuery(displayName)
    clearSearch()
  }

  const handleSearch = async () => {
    await searchLocation(query)
  }

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch()
    }
  }

  return (
    <div className="location-input">
      <div className="location-input__search-box">
        <input
          type="text"
          className="location-input__input"
          placeholder="Busca tu ciudad o provincia..."
          value={query}
          onChange={handleInputChange}
          onKeyDown={handleKeyPress}
          disabled={isLoading}
        />
        <button
          className="location-input__search-button"
          onClick={handleSearch}
          disabled={isLoading || !query.trim()}
        >
          {isLoading ? 'Buscando...' : 'Buscar'}
        </button>
      </div>

      {error && <p className="location-input__error">{error}</p>}

      {suggestions.length > 0 && (
        <ul className="location-input__results" role="listbox">
          {suggestions.map((option) => (
            <li key={option.id} className="location-input__result-item">
              <button
                type="button"
                className="location-input__select-button"
                onClick={() =>
                  handleSelectResult(
                    option.latitude,
                    option.longitude,
                    option.displayName
                  )
                }
              >
                {option.displayName}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default LocationInput