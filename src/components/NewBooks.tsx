import booksData from "@/lib/books.json";

const NewBooks = () => {
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

export default NewBooks;