'use client'

import { useEffect, useState } from 'react';
import { BookList } from '@/components/book-list';
import NewBookList from '@/components/new-book-list';
import { LocationSearch } from '@/components/location-search';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, query, where, getDocs, orderBy } from 'firebase/firestore';

export default function Home() {
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);
  const [books, setBooks] = useState<any[]>([]);
  const [newBooks, setNewBooks] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<any>(null);

  const handleRegionChange = (region: string | null) => {
      setSelectedRegion(region);
      setSelectedCountry(null); // Reset country when region changes
  }; 

  const handleCountryChange = (country: string | null) => {
      setSelectedCountry(country);
  };
  
  useEffect(() => {
    const app = initializeApp({});
    const db = getFirestore(app);
    const fetchBooks = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const booksCollection = collection(db, 'books');
        let q = query(booksCollection);
        if (selectedRegion) {
          q = query(q, where('region', '==', selectedRegion));
        }
        if (selectedCountry) {
          q = query(q, where('country', '==', selectedCountry));
        }
        const querySnapshot = await getDocs(q);
        const fetchedBooks: any[] = [];
        querySnapshot.forEach((doc) => {
          fetchedBooks.push({ id: doc.id, ...doc.data() });
        });
        setBooks(fetchedBooks);
      } catch (err) {
        setError(err);
      } finally {
        setIsLoading(false);
      }
    };
    const fetchNewBooks = async () => {
      const booksCollection = collection(db, 'books');
        const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
        const q = query(booksCollection, where('created_at', '>=', sevenDaysAgo), orderBy('created_at', 'desc'));
        const querySnapshot = await getDocs(q);
        const fetchedBooks: any[] = [];
        querySnapshot.forEach((doc) => {
          fetchedBooks.push({ id: doc.id, ...doc.data() });
        });
        setNewBooks(fetchedBooks);
    }
    fetchBooks();
    fetchNewBooks();
  }, [selectedRegion, selectedCountry]);

  return (
    <div className="container mx-auto p-4 flex flex-col gap-4">
      <LocationSearch
        onRegionChange={handleRegionChange}
        onCountryChange={handleCountryChange}
      />
      <BookList books={books} isLoading={isLoading} error={error} />
      <h2 className="text-lg font-bold">New Books</h2>
      <NewBookList books={newBooks} isLoading={isLoading} error={error} />
    </div>
  );
}
