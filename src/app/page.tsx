
"use client"

import React, { useState, useCallback } from "react";
import BookList from "@/components/BookList";
import Map from "@/components/Map";
import SearchUI from "@/components/SearchUI";
import NewBooks from "@/components/NewBooks";
import Link from "next/link";

import { getContinentByCountry } from '@/utils/continentCountries';


export default function Home() {
    const [selectedCountry, setLocalSelectedCountry] = useState<string | null>(null);
    const [selectedContinent, setSelectedContinent] = useState<string | null>(null);

    const localSetSelectedCountry = useCallback((country: string | null) => {
      setLocalSelectedCountry(country);
      const continent = getContinentByCountry(country ?? "");
      setSelectedContinent(continent);
    }, []);
    
    return (<><div className="flex flex-col bg-white">

        <header className="w-full text-white sticky top-0 z-50 p-4 bg-[#212121]">
          <Link href="/" className="flex flex-col inline-block">
              <div className="text-5xl font-bold ">CAPTURED HERE</div>
              <div className="text-sm">Explore the World Through Photography Art Books</div>
          </Link>
        </header>
        <section className="flex gap-4 p-4 items-start ">
            <div className="w-4/5  mt-8 mb-8">
                <Map selectedCountry={selectedCountry} onCountryClick={localSetSelectedCountry} />
            </div>
            <div className="w-1/5  mt-8 mb-8 mr-[7vw]">
                <SearchUI setSelectedCountry={localSetSelectedCountry} clickedCountryName={selectedCountry} selectedContinent={selectedContinent} setSelectedContinent={setSelectedContinent} />
            </div>
        </section>
      <main className="min-h-screen text-black">

          <section className="w-full bg-[#212121]">
            <div className="max-w-[1280px] mx-auto">
                <BookList />
            </div>
        </section>

          <section className="w-full bg-gray-100">
            <div className="max-w-[1280px] mx-auto">
              <NewBooks />
            </div>
          </section>

      </main>
      <footer className="w-full text-white text-sm p-4 bg-[#212121]">
        <div className="flex flex-col items-center">
              <div className="flex gap-4 mb-2">
                  <Link className="hover:underline" href="/about">About</Link>
                  <Link className="hover:underline" href="/privacy-policy">Privacy Policy</Link>
              </div>
              <div className="text-xs">
                  © {new Date().getFullYear()} CAPTURED HERE. All rights reserved.
              </div>
          </div>
        </footer>
      </div></>
  );
}
