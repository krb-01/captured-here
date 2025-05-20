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
      console.log("InteractiveClientSections MOUNTED");
      return () => {
        console.log("InteractiveClientSections UNMOUNTED");
      };
    }, []);

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
        console.log("Map is ready and interactive!");
    }, []);

    console.log("InteractiveClientSections re-render. Continent:", selectedContinent, "Country:", selectedCountry, "MapInteractive:", isMapInteractive);

    return (
        <>
            <section className="flex flex-col lg:flex-row gap-4 p-4 items-start bg-white">
                {/* Map wrapper: default order-2 (bottom in <md), md:order-1 (top in md-lg, left in lg+) */}
                <div className="w-full lg:w-4/5 lg:mt-4 lg:mb-4 h-[42vw] lg:h-[32vw] order-2 md:order-1">
                    <DynamicMap
                        selectedCountry={selectedCountry}
                        selectedContinent={selectedContinent}
                        onCountryClick={handleMapCountryClick}
                        onMapReady={handleMapReady}
                    />
                </div>
                {/* SearchUI wrapper: default order-1 (top in <md), md:order-2 (bottom in md-lg, right in lg+) */}
                <div className="w-full lg:w-1/5 lg:mt-4 lg:mb-4 flex flex-col lg:self-stretch order-1 md:order-2">
                    <SearchUI
                        selectedCountry={selectedCountry}
                        selectedContinent={selectedContinent}
                        onSelectionChange={handleSearchSelection}
                        isSearchUIDisabled={!isMapInteractive}
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
