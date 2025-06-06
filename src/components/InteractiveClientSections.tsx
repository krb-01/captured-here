"use client";

import React, { useState, useCallback, useEffect } from "react";
import BookList from "@/components/BookList";
import SearchUI from "@/components/SearchUI"; 
import { getContinentByCountry } from '@/utils/continentCountries';
import dynamic from 'next/dynamic';

// Updated Book interface to match page.tsx
interface Book {
  id?: string; 
  // isbn?: string; // Removed
  title: string;
  author: string;
  image_url?: string;
  region: string; 
  country: string; 
  description: string;
  created_at: string; 
  updated_at: string; 
  continent?: string[]; // Array of continent names
  amazon_url?: string; 
}

interface InteractiveClientSectionsProps {
  allBooks: Book[];
}

const DynamicMap = dynamic(() => import('@/components/Map'), { 
    loading: () => (
        <div className="w-full h-full flex justify-center items-center bg-gray-200 rounded">
            <p className="text-gray-500">Loading Map...</p>
        </div>
    ),
    ssr: false
});

export default function InteractiveClientSections({ allBooks }: InteractiveClientSectionsProps) { 
    const [selectedCountry, setSelectedCountry] = useState<string | null>(null);
    const [selectedContinent, setSelectedContinent] = useState<string | null>(null);
    const [isMapInteractive, setIsMapInteractive] = useState(false);

    useEffect(() => {
      // console.log("InteractiveClientSections MOUNTED"); // Debug log removed
      return () => {
        // console.log("InteractiveClientSections UNMOUNTED"); // Debug log removed
      };
    }, []);

    const handleMapCountryClick = useCallback((country: string | null, continentFromMap: string | null) => {
        if (country && country === "Antarctica") {
            setSelectedCountry("Antarctica");
            setSelectedContinent("Antarctica");
        } else if (country && country !== "Unknown") {
            // Assuming getContinentByCountry can still be used if needed for map interaction, 
            // but primary continent data comes from allBooks.
            const newContinent = getContinentByCountry(country); // This might need re-evaluation based on how continents are handled
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
            // When a country is selected in SearchUI, we might need to find its primary continent
            // or adjust how selectedContinent is set if a country can belong to multiple.
            // For now, keep using getContinentByCountry for the selected continent display if SearchUI drives it.
            setSelectedContinent(getContinentByCountry(country)); 
        } else { // Only continent is selected, or both are cleared
            setSelectedCountry(null);
            setSelectedContinent(continent);
        }
    }, []);

    const handleMapReady = useCallback(() => { 
        setIsMapInteractive(true);
        // console.log("Map is ready and interactive!"); // Debug log removed
    }, []);

    // console.log("InteractiveClientSections re-render. Continent:", selectedContinent, "Country:", selectedCountry, "MapInteractive:", isMapInteractive); // Debug log removed

    return (
        <>
            <section className="flex flex-col lg:flex-row gap-4 p-4 items-start bg-white">
                <div className="w-full lg:w-4/5 lg:mt-4 lg:mb-4 h-[42vw] lg:h-[32vw] order-2 md:order-1">
                    <DynamicMap
                        selectedCountry={selectedCountry}
                        selectedContinent={selectedContinent} // This selectedContinent is a single string
                        onCountryClick={handleMapCountryClick}
                        onMapReady={handleMapReady}
                    />
                </div>
                <div className="w-full lg:w-1/5 lg:mt-4 lg:mb-4 flex flex-col lg:self-stretch order-1 md:order-2">
                    <SearchUI
                        selectedCountry={selectedCountry}
                        selectedContinent={selectedContinent} // This selectedContinent is a single string
                        onSelectionChange={handleSearchSelection}
                        isSearchUIDisabled={!isMapInteractive}
                    />
                </div>
            </section>

            <section className="w-full bg-[#212121]">
              <div className="max-w-[1280px] mx-auto px-4 py-8">
                 <BookList
                   initialBooks={allBooks} 
                   continent={selectedContinent} // This selectedContinent is a single string for filtering
                   country={selectedCountry}
                 />
              </div>
            </section>
        </>
    );
}
