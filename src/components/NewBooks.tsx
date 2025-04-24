import booksData from "@/lib/books.json";

const NewBooks = () => {
  const newBooks = booksData.slice(0, 4);
  return (
    <div>
      <h2 className="text-xl font-bold mb-4 text-black">New Arrivals</h2>
      <div className="grid grid-cols-4 gap-4 mt-4">
        {newBooks.map((book) => (
          <div key={book.isbn} className="relative rounded-lg bg-white p-4 shadow-sm">
            <div className="absolute top-0 right-0 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-bl-lg rounded-tr-lg">
              NEW
            </div>

          


            
            <img src={book.image_url} alt={book.title} className="mb-2 w-full" />
            <p className="font-bold mb-1 truncate text-black">{book.title}</p>
            <p className="text-sm text-black">
              by {book.author}
            </p>
          </div>
        ))}
        </div>
      
    </div>
  );
};

export default NewBooks;