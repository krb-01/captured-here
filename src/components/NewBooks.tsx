import booksData from "@/lib/books.json";

const NewBooks = () => {
  const newBooks = booksData.slice(0, 4);
  return (
    <div>
      <h2 className="text-xl font-bold mb-4 text-black">New Arrivals</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-4">
        {newBooks.map((book) => (
          <div
            key={book.isbn}
            className="relative rounded-lg bg-white p-4 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all"
          >
            <div className="absolute top-0 right-0 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-bl-lg rounded-tr-lg">NEW</div>
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
              <p className="font-bold text-black">{book.title}</p>
              <p className="text-sm text-black">by {book.author}</p>
              <p className="text-xs text-black mt-1">Published: {new Date(book.published_on).getFullYear()}</p>
            </div>
          </div>
        ))}
        </div>
      
    </div>
  );
};

export default NewBooks;