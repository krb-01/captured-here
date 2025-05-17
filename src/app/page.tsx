import Layout from "@/components/Layout";
import NewBooksClient from '@/components/NewBooksClient';
import InteractiveClientSections from "@/components/InteractiveClientSections";
import booksDataFromFile from '@/lib/books.json';
import { getContinentByCountry } from "@/utils/continentCountries"; // Added import

// Book interface
interface Book {
  isbn: string;
  title: string;
  author: string;
  published_on: string;
  image_url?: string; // image_url is optional
  region: string;
  country: string;
  description: string;
  created_at: string;
  updated_at: string;
  hasError?: boolean;
  continent?: string; // Added for BookList
}

// getProcessedNewBooks - example.com check removed
async function getProcessedNewBooks(): Promise<Book[]> {
  const typedBooksData = booksDataFromFile as Array<Omit<Book, 'continent' | 'hasError'>>;
  const sortedNewBooks = [...typedBooksData]
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()) // Sort by created_at for new books
    .slice(0, 12);

  const booksWithImageStatus = await Promise.all(
    sortedNewBooks.map(async (book) => {
      let hasError = false;
      if (book.image_url) {
        try {
          const response = await fetch(book.image_url, { method: 'HEAD', signal: AbortSignal.timeout(5000) });
          if (!response.ok) hasError = true;
        } catch (error) {
          hasError = true;
        }
      } else {
        hasError = true;
      }
      // Explicitly cast to Book to ensure all fields are present or undefined
      return { ...book, hasError, continent: undefined } as Book; 
    })
  );
  return booksWithImageStatus;
}

// getProcessedBookListData - new function for all books for BookList
async function getProcessedBookListData(): Promise<Book[]> {
  const typedBooksData = booksDataFromFile as Array<Omit<Book, 'continent' | 'hasError'>>;

  const booksWithContinent = typedBooksData.map(book => ({
    ...book,
    continent: getContinentByCountry(book.country) || undefined,
  }));

  const booksWithImageStatus = await Promise.all(
    booksWithContinent.map(async (book) => {
      let hasError = false;
      if (book.image_url) {
        try {
          const response = await fetch(book.image_url, { method: 'HEAD', signal: AbortSignal.timeout(5000) });
          if (!response.ok) hasError = true;
        } catch (error) {
          hasError = true;
        }
      } else {
        hasError = true; 
      }
      return { ...book, hasError };
    })
  );

  return booksWithImageStatus.sort(
    (a, b) => new Date(a.published_on).getTime() - new Date(b.published_on).getTime()
  ) as Book[];
}


export default async function Home() {
    const newBooksData = await getProcessedNewBooks();
    const bookListData = await getProcessedBookListData();

    return (
      <Layout>
        <InteractiveClientSections key="interactive-sections-main" allBooks={bookListData} />
        <section className="w-full bg-gray-100">
          <div className="max-w-[1280px] mx-auto px-4 py-8">
            <NewBooksClient initialBooks={newBooksData} />
          </div>
        </section>
      </Layout>
  );
}
