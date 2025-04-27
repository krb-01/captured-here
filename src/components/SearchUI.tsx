"use client";
import React, { useState, ChangeEvent } from "react";
import { continentCountries } from "@/utils/continentCountries";

type ContinentCountries = typeof continentCountries;

const SearchUI = () => {
  const [selectedContinent, setSelectedContinent] = useState<string | null>(null);
  const [selectedCountry, setSelectedCountry] = useState<string | null>("-");

  const getContinentByCountry = (country: string): string | null => {
    for (const [continent, countries] of Object.entries(continentCountries)) {
      if (countries.includes(country)) {
        return continent;
      }
    }
    return null;
  };

  const handleContinentChange = (event: ChangeEvent<HTMLSelectElement>) => {
    setSelectedContinent(event.target.value);
    setSelectedCountry("-"); // 大陸が変わったら国をリセット
  };

  const handleCountryChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const country: string = event.target.value;
    setSelectedCountry(country);
    if (!selectedContinent) {
      const continent = getContinentByCountry(country);
      if (continent) {
        setSelectedContinent(continent as string | null);
      }
    }
  };

  const continents = Object.keys(continentCountries);
  const countries = selectedContinent === "antarctica" || !selectedContinent ? ["-"] : continentCountries[selectedContinent as keyof ContinentCountries];

  return (
    <div className="w-full">
      <div className="mb-4 text-black">Search by Region</div>

      {/* 大陸プルダウン */}
      <div className="mb-4">
        <select
          value={selectedContinent || ""}
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

      {/* 国プルダウン */}
      <div>
        <select
          value={selectedCountry || "-"}
          onChange={handleCountryChange}
          className={`w-full p-2 border border-gray-300 rounded-md ${selectedContinent === "antarctica" || !selectedContinent ? 'opacity-50 cursor-not-allowed' : ''}`}
          disabled={selectedContinent === "antarctica" || !selectedContinent}
        >
          {countries.map((country: string) => (
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

