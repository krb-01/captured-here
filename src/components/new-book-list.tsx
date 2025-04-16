import React from 'react';

interface Book {
  isbn: string;
  title: string;
  author: string;
  published_on: number;
  image_urls: string[];
  region: string;
  country: string;
  division_name: string;
  description: string;
  created_at: any; // Assuming timestamp type from Firestore
  updated_at: any; // Assuming timestamp type from Firestore
}

interface NewBookListProps {
  books: Book[];
  isLoading: boolean;
  error: Error | null;
}

const NewBookList: React.FC<NewBookListProps> = ({ books, isLoading, error }) => {
  if (isLoading) {
    return <div>Loading new books...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {books.map((book) => (
        <div key={book.isbn} className="border rounded-lg p-4">
          <img
            src={book.image_urls[0]}
            alt={book.title}
            className="w-full h-48 object-cover rounded-md mb-2"
          />
          <h3 className="text-lg font-semibold">{book.title}</h3>
          <p className="text-gray-600">{book.author}</p>
          <p className="text-gray-500 text-sm">Published: {book.published_on}</p>
        </div>
      ))}
    </div>
  );
};

export default NewBookList;