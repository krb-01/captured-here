"use client"
import React, { useState, ChangeEvent, useEffect } from "react";
import { continentCountries } from "@/utils/continentCountries";

type ContinentCountries = typeof continentCountries;

type SearchUIProps = {
  setSelectedCountry: (country: string | null) => void;
  clickedCountryName: string | null;
  selectedContinent: string | null;
  setSelectedContinent: (continent: string | null) => void;
};

const SearchUI: React.FC<SearchUIProps> = ({ setSelectedCountry, clickedCountryName, selectedContinent, setSelectedContinent }: SearchUIProps) => {
  
  const [localSelectedCountry, setLocalSelectedCountry] = useState<string | null>(null);

  useEffect(() => {
    if (clickedCountryName) setLocalSelectedCountry(clickedCountryName)
  }, [clickedCountryName])


  const handleContinentChange = (event: ChangeEvent<HTMLSelectElement>) => {
    setSelectedContinent(event.target.value);
    setLocalSelectedCountry(null)
  };

    const handleCountryChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const country: string | null = event.target.value;
    setLocalSelectedCountry(country)
    setSelectedCountry(country);
  }

  const continents = Object.keys(continentCountries);
  let countries = selectedContinent ? continentCountries[selectedContinent as keyof typeof continentCountries] : [];

  const isCountrySelectDisabled = selectedContinent === "antarctica" || !selectedContinent;

  return (
    <div className="w-full">
      <div className="mb-4 text-black">Search by Region</div>

      <div className="mb-4">
        <select
          value={selectedContinent ?? ""}
          onChange={handleContinentChange}
          className="w-full p-2 border border-gray-300 rounded-md"
        >
          <option value="">Select Continent</option>
          {continents.map((continent) => (
            <option key={continent} value={continent}>
              {continent}
            </option>
          ))}
        </select>
      </div>
      <div>
        <select
          value={localSelectedCountry ?? ""}
          onChange={handleCountryChange}
          className={`w-full p-2 border border-gray-300 rounded-md ${isCountrySelectDisabled ? "opacity-50 cursor-not-allowed" : ""}`}
          disabled={isCountrySelectDisabled}
        >
          <option value="-">Select Country</option>{countries.map((country) => (
            <option key={country} value={country}>
              {country}
            </option>
          ))}
          {countries.length === 0 && <option value="">-</option>}
        </select>
      </div>
    </div>
  );
};
export default SearchUI;