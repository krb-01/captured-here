import booksData from '@/lib/books.json';

const BookList = () => {
  const sortedBooks = [...booksData].sort(
    (a, b) => new Date(a.published_on).getTime() - new Date(b.published_on).getTime()
  );
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-4">
      {sortedBooks.map((book) => (
        <div
          key={book.isbn}
          className="rounded-lg bg-white p-4 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all"
        >
          {book.image_url ? (
            <img
              src={book.image_url}
              alt={book.title}
              className="w-full h-48 object-cover rounded-md mb-2"
            />
          ) : (
            <div className="w-full h-48 bg-gray-200 rounded-md mb-2 flex justify-center items-center">
              <p className="text-gray-500">No image available</p>
            </div>
          )}
          <div className="mb-2">
            <a href={`/book/${book.isbn}`} className="block">
              <p className="font-bold text-black">{book.title}</p>
            </a>
            <p className="text-sm text-black">by {book.author}</p>
            <p className="text-xs text-black mt-1">
              Published: {new Date(book.published_on).getFullYear()}
            </p>
          </div>
          

        </div>
      ))}
    </div>
  );
};

export default BookList;