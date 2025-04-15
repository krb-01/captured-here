'use client';

import {Book} from '@/services/amazon';
import {getNewBooks} from '@/services/amazon';
import {useEffect, useState} from 'react';

export function BookList() {
  const [books, setBooks] = useState<Book[]>([]);

  useEffect(() => {
    async function loadBooks() {
      const newBooks = await getNewBooks();
      setBooks(newBooks);
    }
    loadBooks();
  }, []);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {books.map((book) => (
        <div key={book.isbn} className="bg-white rounded-lg shadow-md overflow-hidden">
          <img src={book.imageUrl} alt={book.title} className="w-full h-48 object-cover" />
          <div className="p-4">
            <h2 className="text-lg font-semibold">{book.title}</h2>
            <p className="text-gray-600">Author: {book.author}</p>
            <p className="text-gray-600">Year: {book.publicationYear}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
