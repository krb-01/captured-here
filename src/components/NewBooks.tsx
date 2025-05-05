import booksData from "@/lib/books.json";

const NewBooks = () => {
  const newBooks = booksData.slice(0, 4);

  return (
    <div className="pb-16">
      <h2 className="text-2xl font-bold pt-8 mb-8 text-black">New Arrivals</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-4">
        {newBooks.map((book) => (
          <div key={book.isbn}>
            <div className="relative rounded-lg p-4 cursor-pointer border border-gray-300 flex flex-col justify-between h-full bg-white">
              {book.image_url ? (
                <div className="mb-4">
                  <img
                    src={book.image_url}
                    alt={book.title}
                    className="w-full aspect-square object-contain rounded-md"
                    onError={(e: any) => {
                      e.target.onerror = null; // prevent infinite loop
                      e.target.src = "/file.svg"; // replace with your default image
                      e.target.alt = "No image available";
                      if (e.target.alt === "No image available") {
                        e.target.className =
                          "w-full h-48 bg-gray-200 rounded-md mb-2 object-contain flex justify-center items-center";
                      }
                    }}
                  />
                </div>
              ) : (
                <div className="w-full h-48 bg-gray-200 rounded-md mb-2 flex justify-center items-center">
                  <p className="text-gray-500">No image available</p>
                </div>
              )}
              <div className="mb-2 flex-1 ">
                <p className="font-bold text-black">{book.title}</p>
                <p className="text-sm text-black">by {book.author}</p>
                <p className="text-xs text-black mt-1">
                  Published: {new Date(book.published_on).getFullYear()}
                </p>
              </div>
              <div className="grid grid-cols-2 gap-2 mt-4">
                <button className="bg-[#212121] text-white px-4 py-2 rounded text-xs hover:scale-105 transition-all duration-200">
                  EXPLORE
                </button>
                <button className="bg-[#FF9900] text-white px-4 py-2 rounded text-xs hover:scale-105 transition-all duration-200">
                  AVAILABLE ON AMAZON
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NewBooks;