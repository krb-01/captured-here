import React, { useState, useEffect } from 'react'; // useCallback removed
import continentsFromFile from '@/lib/continentCoordinates.json';
import allBooks from "@/lib/books.json";
import { getContinentByCountry } from "@/utils/continentCountries";

interface SearchUIProps {
  selectedContinent: string | null;
  selectedCountry: string | null;
  onSelectionChange: (country: string | null, continent: string | null) => void;
  isSearchUIDisabled?: boolean;
}

const SearchUI: React.FC<SearchUIProps> = ({
  selectedContinent,
  selectedCountry,
  onSelectionChange,
  isSearchUIDisabled,
}) => {
  const [countries, setCountries] = useState<string[]>([]);
  const [isCountrySelectDisabled, setIsCountrySelectDisabled] = useState(true);
  const [currentSelectedCountry, setCurrentSelectedCountry] = useState<string | null>(null);

  useEffect(() => {
    if (selectedContinent === "Antarctica") { 
      setCountries([]);
      setIsCountrySelectDisabled(true); 
    } else if (selectedContinent) {
      const countryList = allBooks
        .filter((book) => getContinentByCountry(book.country) === selectedContinent)
        .map((book) => book.country)
        .filter((value, index, self) => self.indexOf(value) === index)
        .sort();
      setCountries(countryList);
      setIsCountrySelectDisabled(false);
    } else {
      setCountries([]);
      setIsCountrySelectDisabled(true);
    }
    setCurrentSelectedCountry(null); 
  }, [selectedContinent]);

  useEffect(() => {
    setCurrentSelectedCountry(selectedCountry);
  }, [selectedCountry]);

  const handleContinentChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newContinent = event.target.value || null;
    onSelectionChange(null, newContinent); 
  };

  const handleCountryChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newCountry = event.target.value || null;
    if (selectedContinent) { 
      onSelectionChange(newCountry, selectedContinent);
    }
  };

  const placeholderTextColorClass = "text-gray-400";

  return (
    <div className={`p-2 rounded-lg bg-white border border-gray-300 ${isSearchUIDisabled ? 'opacity-50 cursor-not-allowed' : ''}`}>
      <div className="hyphens-auto mt-2 mb-4 p-2 text-sm text-gray-600">
        Select a continent and country to discover curated art photography
        monographs and regional works.
      </div>
      <div className="mb-4">
        <label htmlFor="continent-select" className="block text-sm font-medium text-gray-700 mb-1">
          CONTINENT
        </label>
        <select
          id="continent-select"
          value={selectedContinent || ""}
          onChange={handleContinentChange}
          className={`block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-white ${
            selectedContinent === null ? placeholderTextColorClass : "text-gray-900"
          }`}
          disabled={isSearchUIDisabled}
        >
          <option value="">Select Continent</option>
          {Object.keys(continentsFromFile).map((continentName) => (
            <option key={continentName} value={continentName}>
              {continentName}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label htmlFor="country-select" className="block text-sm font-medium text-gray-700 mb-1">
          COUNTRY
        </label>
        <select
          id="country-select"
          value={currentSelectedCountry || ""}
          onChange={handleCountryChange}
          className={`block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-white ${
            (currentSelectedCountry === null || currentSelectedCountry === "") ? placeholderTextColorClass : "text-gray-900"
          }`}
          disabled={isSearchUIDisabled || isCountrySelectDisabled}
        >
          <option value="">
            {isCountrySelectDisabled
              ? (selectedContinent === "Antarctica" ? "-" : "Select Continent First") 
              : "Select Country"
            }
          </option>
          {countries.map((countryName) => (
            <option key={countryName} value={countryName}>
              {countryName}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default React.memo(SearchUI);
