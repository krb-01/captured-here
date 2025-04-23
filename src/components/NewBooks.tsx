tsx
// src/components/NewBooks.tsx
import booksData from "@/lib/books.json";

const NewBooks = () => {
  return (
    <div>
      {booksData.map((book, index) => (
        <p key={index}>
          {book.title} by {book.author}
        </p>
      ))}
    </div>
  );
};

export default NewBooks;
