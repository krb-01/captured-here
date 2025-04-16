import {Book} from '@/types/book';
import { format } from 'date-fns';
export interface BookListProps {
  books: Book[];
  isLoading: boolean;
  error: Error | null;
}
export function BookList({ books, isLoading, error }: BookListProps) {
  if (isLoading) {
    return <div>Loading...</div>;
  }
  if (error) {
    return <div>Error: {error.message}</div>;
  }
  if (!books || books.length === 0) {
    return <div>No books found.</div>
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {books.map((book) => (
        <div key={book.isbn} className="bg-card rounded-md shadow-sm overflow-hidden">
          {book.image_urls && book.image_urls.length > 0 && (
            <img
              src={book.image_urls[0]}
              alt={book.title}
              className="w-full h-48 object-cover"
            />
          )}
          {!book.image_urls || book.image_urls.length === 0 &&(
            <div className="w-full h-48 bg-muted" >
            </div>
          )}
          <div className="p-4">
            <h2 className="text-lg font-semibold">{book.title}</h2>
            <p className="text-sm text-muted-foreground">
              Author: {book.author}
            </p>
            <p className="text-sm text-muted-foreground">
              Year:{book.published_on}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}

