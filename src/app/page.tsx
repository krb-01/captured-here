'use client'

import {BookList} from '@/components/book-list';
import {LocationSearch} from '@/components/location-search';

export default function Home() {
  return (
    <div className="container mx-auto p-4">
      <header className="mb-6">
        <h1 className="text-2xl font-bold">Captured Here</h1>
      </header>
      <LocationSearch />
      <BookList />
    </div>
  );
}


