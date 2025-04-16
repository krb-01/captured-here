import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../functions/firebase';
import { LocationSearch } from '../../components/location-search';
import Link from 'next/link';

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
  // Add other fields as necessary
}

const BookDetail: React.FC = () => {
  const router = useRouter();
  const { isbn } = router.query;
  const [book, setBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [generatingDescription, setGeneratingDescription] = useState(false);

  useEffect(() => {
    if (isbn) {
      fetchBook(isbn as string);
    }
  }, [isbn]);

  const fetchBook = async (isbn: string) => {
    setLoading(true);
    setError(null);
    try {
      const docRef = doc(db, 'books', isbn);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setBook(docSnap.data() as Book);
      } else {
        setError('Book not found');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to fetch book');
    } finally {
      setLoading(false);
    }
  };

  const generateDescription = async () => {
    if (!book) return;

    setGeneratingDescription(true);
    try {
      // Call your Firebase Function here to generate the description
      // Example:
      // const response = await fetch(`/api/generate-description?isbn=${book.isbn}`);
      // const data = await response.json();
      // if (data.description) {
      //   // Assuming your function updates the Firestore document
      //   fetchBook(book.isbn); // Re-fetch the book data
      // } else {
      //   setError('Failed to generate description');
      // }
      // Placeholder for the function call:
      console.log(`Calling function to generate description for ISBN: ${book.isbn}`);
      // After implementing the function, remove the placeholder and uncomment the above code.
      // For now, we simulate a successful call:
      setTimeout(() => {
        fetchBook(book.isbn);
      }, 2000); 
      
    } catch (err: any) {
      setError(err.message || 'Failed to generate description');
    } finally {
      setGeneratingDescription(false);
    }
  };

  if (loading) {
    return <p>Loading book details...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  if (!book) {
    return <p>Book not found.</p>; 
  }

  return (
    <div className="container mx-auto py-8">
      <Link href="/" className="block mb-4 text-blue-500 hover:underline">
        Back to Main
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Book Details */}
        <div>
          <img
            src={book.image_urls[0]}
            alt={book.title}
            className="w-full h-auto object-cover rounded-lg mb-4"
          />
          <h1 className="text-3xl font-bold mb-2">{book.title}</h1>
          <p className="text-gray-700 mb-1">Author: {book.author}</p>
          <p className="text-gray-700 mb-1">Published Year: {book.published_on}</p>
          <p className="text-gray-700 mb-1">Country: {book.country}</p>
          <p className="text-gray-700 mb-4">Division: {book.division_name}</p>
          {book.description ? (
            <p className="text-gray-800">{book.description}</p>
          ) : (
            <div className="mt-4">
              <p className="text-gray-600 italic">Description not available.</p>
              <button
                onClick={generateDescription}
                disabled={generatingDescription}
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-2 disabled:opacity-50"
              >
                {generatingDescription ? 'Generating...' : 'Generate Description'}
              </button>
            </div>
          )}
        </div>

        {/* Related Books (Placeholder) */}
        <div>
          <h2 className="text-2xl font-semibold mb-4">Related Books</h2>
          {/* Implement related books logic here.  This is just a placeholder. */}
          <p>Coming soon: Related books from the same region and different years, and by the same author from different regions.</p>
          {/* You can optionally include the LocationSearch component here for filtering or context */}
          {/* <LocationSearch /> */}
        </div>
      </div>
    </div>
  );
};

export default BookDetail;