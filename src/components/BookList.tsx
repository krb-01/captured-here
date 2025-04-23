tsx
// src/components/BookList.tsx
import booksData from "@/lib/books.json";

const BookList = () => {
  return (
    <div className="border p-4">
      {booksData.map((book) => (
        <div key={book.isbn}>
          <p className="mb-2">
            {book.title} by {book.author}
          </p>
        </div>
      ))}
    </div>
  );
};

export default BookList;