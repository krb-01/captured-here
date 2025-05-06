"use client"
import React, { useState, ChangeEvent, useEffect } from "react";
import { continentCountries } from "@/utils/continentCountries";

type ContinentCountries = typeof continentCountries;
const selectClassName = "w-full p-2 border border-gray-200 rounded-lg";
type SearchUIProps = {
  setSelectedCountry: (country: string | null) => void;
  clickedCountryName: string | null;
  selectedContinent: string | null;
  setSelectedContinent: (continent: string | null) => void;
  onCountryClick: (country: string | null) => void;
};
const SearchUI: React.FC<SearchUIProps> = ({ setSelectedCountry, selectedContinent, setSelectedContinent, onCountryClick }) => {
  const [localSelectedCountry, setLocalSelectedCountry] = useState<string | null>(null);
  const [isCountrySelectDisabled, setIsCountrySelectDisabled] = useState<boolean>(true);
  const [countries, setCountries] = useState<string[]>([]);

    const localSetSelectedCountry = (country: string | null) => {
      setLocalSelectedCountry(country);
    };
  const continents: string[] = Object.keys(continentCountries);
  const [clickedCountryName, setClickedCountryName] = useState<string | null>(null);
  

  const handleContinentChange = (event: ChangeEvent<HTMLSelectElement>) => {
    setSelectedContinent(event.target.value);
    setSelectedCountry(null)
    setLocalSelectedCountry(null);
  };
  useEffect(()=>{
    setIsCountrySelectDisabled(!selectedContinent || selectedContinent === "Antarctica");
  },[selectedContinent])
  
  const handleCountryChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const selectedCountry = event.target.value;
     setLocalSelectedCountry(selectedCountry === "" ? null : selectedCountry);
    if(setSelectedCountry){
      setSelectedCountry(selectedCountry === "" ? null : selectedCountry);
    }
  };

  useEffect(() => {
    onCountryClick(localSelectedCountry)
  }, [localSelectedCountry])

  useEffect(() => {
    if (selectedContinent && selectedContinent !== "") {
      setCountries(continentCountries[selectedContinent as keyof ContinentCountries]);
      if (localSelectedCountry === null && selectedContinent !== "Antarctica") {
        setSelectedCountry(null);
      }
    } else {
      setCountries([]);
    }
  }, [selectedContinent]);
  
  useEffect(() => {
    if (clickedCountryName) {
      const clickedCountryContinent = Object.keys(continentCountries).find(continent => {
        return continentCountries[continent as keyof ContinentCountries].includes(clickedCountryName ?? "")
      });
      if (clickedCountryContinent) {
         if(setSelectedCountry){
           setSelectedCountry(clickedCountryName);
         }
      }
      if (setSelectedContinent) {
        setSelectedContinent(clickedCountryContinent ?? null)
      }
    }
  }, [clickedCountryName, countries])

  const description = (<div className="text-center mt-4 mb-4">
    Select a continent and country to discover curated art photography monographs and regional works.
  </div>);
  
  return (
    <div className="w-full text-black border border-gray-200 rounded-lg p-4 mt-2 mb-2 ">
       {description}
      <div className="flex flex-col gap-2 mb-4 w-full ">
        <div className="mb-4"><select
            className={`${selectClassName}`}
            value={selectedContinent ?? ""}
              onChange={handleContinentChange}
          >
            <option value="">Select Continent</option>            
            {continents.map((continent) => (              
              <option key={continent} value={continent}>
                {continent}
              </option>
            ))}
          </select> </div>
        <div>
          <select
              value={localSelectedCountry ?? ""}
              onChange={handleCountryChange}
              className={`${selectClassName} ${isCountrySelectDisabled ? "opacity-50 cursor-not-allowed" : ""}`}
              disabled={isCountrySelectDisabled}
            >
              {selectedContinent !== "" && 
                <option value="">
                  {selectedContinent === "Antarctica" ? "-" : "Select Country"}
                </option>
              }


              {countries.map((country) => (
                <option key={country} value={country}>{country}</option>
              ))}
          </select>
        </div>
      </div>
    </div>
  );
};
export default SearchUI;