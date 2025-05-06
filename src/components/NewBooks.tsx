import booksData from '@/lib/books.json';
import { useState, useEffect } from 'react';

const NewBooks = () => {
  const [newBooks, setNewBooks] = useState(
    booksData.slice(0, 4).map((book) => ({ ...book, hasError: false }))
  );

  useEffect(() => {
    const checkImages = async () => { 
        const updatedBooks = await Promise.all(
          newBooks.map(async (book) => {
            if (book.image_url) {
              // Check if the image URL is the specific example URL
              if (book.image_url.includes("example.com/images/book1.jpg")) {
                return { ...book, hasError: true };
              }
              try {
                const response = await fetch(book.image_url);
                if (!response.ok) {
                  console.error(`Image load failed: ${book.image_url}`);
                  return { ...book, hasError: true };
                }
              } catch (error) {
                console.error(`Image load failed: ${book.image_url}`, error);
                return { ...book, hasError: true };
              }
            }
            return book;
          })
        );
        setNewBooks(updatedBooks);
      };
  
      checkImages();
    }, []);



  return (
    <div className="pb-16">
      <h2 className="text-2xl font-bold pt-8 mb-8 text-black">New Arrivals</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-4">
        {newBooks.map((book) => (
          <div
            key={book.isbn}
            className="relative rounded-lg p-4 border border-gray-300 flex flex-col justify-between h-full bg-white"
          >
            <div className="mb-4">
              {book.image_url && !book.hasError ? (
                <img
                  src={book.image_url}
                  alt={book.title}
                  className="w-full aspect-square object-contain rounded-md"
                  onError={() => {
                    setNewBooks((prevBooks) =>
                      prevBooks.map((b) => (b.isbn === book.isbn ? { ...b, hasError: true } : b))
                    );
                  }}
                />
                ) : book.image_url ? (
                  <img
                    src="/window.svg"
                    alt="Fallback"
                    className="w-full aspect-square object-contain rounded-md"
                  />
                ) : (
                  <div className="w-full h-48 bg-gray-200 rounded-md mb-2 flex justify-center items-center"><p className="text-gray-500">No image available</p></div>
                
              )}
            </div>
            <div className="mb-2 flex-1 ">
              <p className="font-bold text-black">{book.title}</p>
              <p className="text-sm text-black">by {book.author}</p>
              <p className="text-xs text-black mt-1">
                Published: {new Date(book.published_on).getFullYear()}
              </p>
            </div>         
 <div className="grid grid-cols-2 gap-2 mt-4">
              <button
                className="bg-black text-white px-4 py-2 rounded text-xs hover:scale-105 transition-all duration-200"
              >
                EXPLORE
              </button>
              <button
                className="bg-[#FF9900] text-white px-4 py-2 rounded text-xs hover:scale-105 transition-all duration-200"
              >
                AVAILABLE ON AMAZON
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NewBooks;
