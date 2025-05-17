"use client";

import React, { useState, useCallback, useEffect } from "react";
import BookList from "@/components/BookList";
import SearchUI from "@/components/SearchUI"; 
import { getContinentByCountry } from '@/utils/continentCountries';
import dynamic from 'next/dynamic';

interface Book {
  isbn: string;
  title: string;
  author: string;
  published_on: string;
  image_url?: string;
  region: string;
  country: string;
  description: string;
  created_at: string;
  updated_at: string;
  hasError?: boolean;
  continent?: string;
}

interface InteractiveClientSectionsProps {
  allBooks: Book[];
}

// It's better to ensure Map component type is correctly inferred or imported for DynamicMap
const DynamicMap = dynamic(() => import('@/components/Map'), { 
    loading: () => (
        <div className="w-full flex justify-center items-center h-[600px] bg-gray-200 rounded">
            <p className="text-gray-500">Loading Map...</p>
        </div>
    ),
    ssr: false
});

export default function InteractiveClientSections({ allBooks }: InteractiveClientSectionsProps) { 
    const [selectedCountry, setSelectedCountry] = useState<string | null>(null);
    const [selectedContinent, setSelectedContinent] = useState<string | null>(null);
    const [isMapInteractive, setIsMapInteractive] = useState(false); // Map readiness state
    const handleMapCountryClick = useCallback((country: string | null, continentFromMap: string | null) => {
        if (country && country === "Antarctica") {
            setSelectedCountry("Antarctica");
            setSelectedContinent("Antarctica");
        } else if (country && country !== "Unknown") {
            const newContinent = getContinentByCountry(country);
            setSelectedCountry(country);
            setSelectedContinent(newContinent);
        } else {
             console.warn("InteractiveClientSections: Map click on unknown, invalid, or non-country area. State not changed.");
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

    const handleMapReady = useCallback(() => { 
        setIsMapInteractive(true);
    }, []);

    return (
        <>
            <section className="flex gap-4 p-4 items-start bg-white">
                <div className="w-4/5 mt-4 mb-4">
                    <DynamicMap
                        selectedCountry={selectedCountry}
                        selectedContinent={selectedContinent}
                        onCountryClick={handleMapCountryClick}
                        onMapReady={handleMapReady} // Pass the callback to DynamicMap
                    />
                </div>
                <div className="w-1/5 mt-4 mb-4">
                    <SearchUI
                        selectedCountry={selectedCountry}
                        selectedContinent={selectedContinent}
                        onSelectionChange={handleSearchSelection}
                        isSearchUIDisabled={!isMapInteractive} // Disable SearchUI until map is ready
                    />
                </div>
            </section>

            <section className="w-full bg-[#212121]">
              <div className="max-w-[1280px] mx-auto px-4 py-8">
                 <BookList
                   initialBooks={allBooks} 
                   continent={selectedContinent}
                   country={selectedCountry}
                 />
              </div>
            </section>
        </>
    );
}
