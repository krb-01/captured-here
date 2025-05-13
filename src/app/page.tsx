"use client"

import React, { useState, useCallback } from "react";
import BookList from "@/components/BookList";
import Map from "@/components/Map";
import SearchUI from "@/components/SearchUI";
import NewBooks from "@/components/NewBooks";
import Layout from "@/components/Layout"; 
import { getContinentByCountry } from '@/utils/continentCountries';

export default function Home() {
    const [selectedCountry, setSelectedCountry] = useState<string | null>(null);
    const [selectedContinent, setSelectedContinent] = useState<string | null>(null);

    const handleMapCountryClick = useCallback((country: string | null, continentFromMap: string | null) => {
        if (country && country === "Antarctica") { 
            setSelectedCountry("Antarctica"); 
            setSelectedContinent("Antarctica");
        } else if (country && country !== "Unknown") { 
            const newContinent = getContinentByCountry(country);
            setSelectedCountry(country);
            setSelectedContinent(newContinent); 
        } else {
             console.warn("page.tsx: Map click on unknown, invalid, or non-country area. State not changed.");
        }
    }, []);

    const handleSearchSelection = useCallback((country: string | null, continent: string | null) => {
        if (continent === "Antarctica") {
            setSelectedCountry("Antarctica"); 
            setSelectedContinent("Antarctica");
        } else if (country && country !== "Unknown") { 
            setSelectedCountry(country);
            setSelectedContinent(getContinentByCountry(country)); 
        } else { 
            setSelectedCountry(null);
            setSelectedContinent(continent);
        }
    }, []);

    return (
      <Layout>
        {/* MapとSearchUIセクション: 背景色を白に */}
        <section className="flex gap-4 p-4 items-start bg-white">
            <div className="w-4/5 mt-4 mb-4">
                <Map 
                    selectedCountry={selectedCountry} 
                    selectedContinent={selectedContinent} 
                    onCountryClick={handleMapCountryClick} 
                />
            </div>
            <div className="w-1/5 mt-4 mb-4">
                <SearchUI 
                    selectedCountry={selectedCountry} 
                    selectedContinent={selectedContinent} 
                    onSelectionChange={handleSearchSelection} 
                />
            </div>
        </section>

        {/* BookListセクション: 背景色は全幅、コンテンツは中央揃え */}
        <section className="w-full bg-[#212121]">
          <div className="max-w-[1280px] mx-auto px-4 py-8">
             <BookList continent={selectedContinent} country={selectedCountry}/>
          </div>
        </section>

        {/* NewBooksセクション: 背景色は全幅、コンテンツは中央揃え */}
        <section className="w-full bg-gray-100">
          <div className="max-w-[1280px] mx-auto px-4 py-8">
            <NewBooks />
          </div>
        </section>
      </Layout>
  );
}
