// import Layout from "@/components/Layout"; // Already removed
import NewBooksClient from '@/components/NewBooksClient';
import InteractiveClientSections from "@/components/InteractiveClientSections";
import booksDataFromFile from '@/lib/books.json';
import { getContinentByCountry } from "@/utils/continentCountries";

interface Book {
  isbn: string;
  title: string;
  author: string;
  image_url?: string;
  region: string;
  country: string;
  description: string;
  created_at: string;
  updated_at: string;
  continent?: string;
  // published_on and hasError are fully removed from this type if not in books.json
}

// checkImage helper function is now completely removed

async function getProcessedNewBooks(): Promise<Book[]> {
  // Assuming booksDataFromFile items match Omit<Book, 'continent' | 'image_url'>
  // If books.json items might have extra fields like published_on or hasError not in the final Book type,
  // they need to be destructured/omitted carefully.
  const typedBooksData = booksDataFromFile as Array<Omit<Book, 'continent' | 'image_url'> >;
  const sortedNewBooks = [...typedBooksData]
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 12);

  // .map is now synchronous as checkImage is removed
  const booksWithDetails = sortedNewBooks.map((bookInput) => {
    const imageUrl = bookInput.isbn ? `https://images-na.ssl-images-amazon.com/images/P/${bookInput.isbn}.09_THUMBZZZ.jpg` : "";
    // Ensure that the spread bookInput does not accidentally carry over fields not in the target Book type.
    // If bookInput has fields like published_on or hasError, they should be explicitly handled or omitted.
    const { region, country, description, created_at, updated_at, isbn, title, author } = bookInput as any;
    return { 
        isbn, title, author, region, country, description, created_at, updated_at, // Fields from bookInput that are in Book type
        image_url: imageUrl, 
        continent: undefined 
    } as Book;
  });
  return booksWithDetails; 
}

async function getProcessedBookListData(): Promise<Book[]> {
  const typedBooksData = booksDataFromFile as Array<Omit<Book, 'continent' | 'image_url'> >;

  // .map is now synchronous
  const booksWithDetails = typedBooksData.map((bookInput) => {
    const imageUrl = bookInput.isbn ? `https://images-na.ssl-images-amazon.com/images/P/${bookInput.isbn}.09_THUMBZZZ.jpg` : "";
    const continent = getContinentByCountry(bookInput.country) || undefined;
    const { region, country, description, created_at, updated_at, isbn, title, author } = bookInput as any;
    return { 
        isbn, title, author, region, country, description, created_at, updated_at, // Fields from bookInput
        image_url: imageUrl, 
        continent 
    } as Book;
  });
  // Sorting by published_on was already removed
  return booksWithDetails; 
}

export default async function Home() {
    // These functions are still async because they might perform other async operations in the future (e.g., DB access)
    const newBooksData = await getProcessedNewBooks(); 
    const bookListData = await getProcessedBookListData();

    return (
      <>
        <InteractiveClientSections key="interactive-sections-main" allBooks={bookListData} />
        <section className="w-full bg-gray-100">
          <div className="max-w-[1280px] mx-auto px-4 py-8">
            <NewBooksClient initialBooks={newBooksData} />
          </div>
        </section>
      </>
  );
}
