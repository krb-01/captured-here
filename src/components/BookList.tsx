import booksData from '@/lib/books.json';

const BookList = () => {
  const sortedBooks = [...booksData].sort(
    (a, b) => new Date(a.published_on).getTime() - new Date(b.published_on).getTime()
  );
  return (
    <div className="pb-16"><h2 className="text-2xl font-bold text-white pt-8 mb-8">Book List</h2>
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-4">
      {sortedBooks.map((book) => (
        <div key={book.isbn} className="relative flex flex-col justify-between rounded-lg bg-white p-4 shadow-sm cursor-pointer">
        <div className="h-full flex-1 bg-white">

          <div className="mb-4">
          {book.image_url ? (
            <img 
              src={book.image_url}
              alt={book.title}              
              className="w-full aspect-square object-contain rounded-md"
              onError={(e: any) => {
                e.target.onerror = null;
                e.target.src = "/file.svg"; 
              }}            
            />
            ) : (
            <div className="w-full aspect-square bg-gray-200 rounded-md flex justify-center items-center mb-2">
              <p className="text-gray-500">No image available</p>
            </div>
          )}
          </div>
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
          <div className="grid grid-cols-2 gap-2 mt-4 ">

            <button className="text-xs hover:scale-105 transition-all duration-200 bg-[#212121] text-white px-4 py-2 rounded ">EXPLORE</button>
            <button className="text-xs hover:scale-105 transition-all duration-200 bg-[#FF9900] text-white px-4 py-2 rounded">AVAILABLE ON AMAZON</button>
          </div>


        </div>
      ))}
    </div>
    </div>
  );
};

export default BookList;