/** @format */

"use client";
import React, { useState, ChangeEvent, useEffect } from "react";
import { continentCountries, getContinentByCountry } from "@/utils/continentCountries";

type ContinentCountries = typeof continentCountries;
const selectClassName = "w-full p-2 border border-gray-200 rounded-lg";

type SearchUIProps = {
  selectedCountry: string | null;
  selectedContinent: string | null;
  onSelectionChange: (country: string | null, continent: string | null) => void;
};

const SearchUI: React.FC<SearchUIProps> = ({ selectedCountry, selectedContinent, onSelectionChange }) => {
  const [isCountrySelectDisabled, setIsCountrySelectDisabled] = useState<boolean>(true);
  const [countries, setCountries] = useState<string[]>([]);

  const continents: string[] = Object.keys(continentCountries);

  // 大陸プルダウンの変更ハンドラ
  const handleContinentChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const newContinent = event.target.value === "" ? null : event.target.value;
    // 国の選択をリセットし、新しい大陸を通知
    onSelectionChange(null, newContinent);
  };

  // 国プルダウンの変更ハンドラ
  const handleCountryChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const newCountry = event.target.value === "" ? null : event.target.value;
    if (newCountry) {
      // 国が選択された場合、その国と対応する大陸を通知
      const continentForSelectedCountry = getContinentByCountry(newCountry);
      onSelectionChange(newCountry, continentForSelectedCountry);
    } else {
      // 国の選択が解除された場合（例: "Select Country"が選択された）、
      // 国をnullにし、現在の大陸選択は維持する
      onSelectionChange(null, selectedContinent);
    }
  };

  // selectedContinent prop の変更に応じて、国リストとプルダウンの有効/無効状態を更新
  useEffect(() => {
    if (
      selectedContinent &&
      selectedContinent !== "" &&
      selectedContinent !== "Antarctica"
    ) {
      setCountries(
        continentCountries[selectedContinent as keyof ContinentCountries]
      );
      setIsCountrySelectDisabled(false);
    } else {
      setCountries([]); // 大陸が選択されていないか南極なら国リストを空にする
      setIsCountrySelectDisabled(true);
    }
  }, [selectedContinent]);

  const description = (
    <div className="text-center mt-4 mb-4">
      Select a continent and country to discover curated art photography
      monographs and regional works.
    </div>
  );

  return (
    <div className="w-full text-black border border-gray-200 rounded-lg p-4 mb-2 ">
      {description}
      <div className="flex flex-col gap-2 mb-4 w-full ">
        <div className="mb-4">
          <select
            className={`${selectClassName}`}
            value={selectedContinent ?? ""} // page.tsx から渡される selectedContinent を使用
            onChange={handleContinentChange}
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
            value={selectedCountry ?? ""} // page.tsx から渡される selectedCountry を使用
            onChange={handleCountryChange}
            className={`${selectClassName} ${isCountrySelectDisabled ? "opacity-50 cursor-not-allowed" : ""}`}
            disabled={isCountrySelectDisabled}
          >
            {/* 国選択の初期オプション表示ロジック */}
            {
              selectedContinent &&
                selectedContinent !== "" &&
                selectedContinent !== "Antarctica" && (
                <option value="">Select Country</option>
              )
            }
            {selectedContinent === "Antarctica" && <option value="">-</option>}
            {
              !selectedContinent &&
              countries.length === 0 && // 大陸未選択時は国リストも空のはず
                <option value="">Select Continent First</option>
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
