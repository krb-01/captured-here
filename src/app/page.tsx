import Layout from "@/components/Layout";
import NewBooksClient from '@/components/NewBooksClient';
import InteractiveClientSections from "@/components/InteractiveClientSections";
import booksDataFromFile from '@/lib/books.json';
import { getContinentByCountry } from "@/utils/continentCountries";

interface Book {
  isbn: string;
  title: string;
  author: string;
  published_on: string;
  image_url?: string;
  region: string;
  country: string;
  description: string;
  created_at: string;
  updated_at: string;
  hasError?: boolean;
  continent?: string;
}

// Helper function for image check with caching
async function checkImage(
  url: string,
  cache: Map<string, boolean>, // URL -> hasError status
  logPrefix: string = ""
): Promise<boolean> {
  if (!url) { // Handles undefined, null, or empty string URLs
    // console.log(`${logPrefix}: No image_url provided.`); // Optional: log if no URL
    return true; 
  }
  if (cache.has(url)) {
    return cache.get(url)!;
  }

  let hasError = false;
  try {
    const response = await fetch(url, { method: 'HEAD', signal: AbortSignal.timeout(7000) });
    if (!response.ok) {
      console.warn(`${logPrefix}: Image HEAD request failed for ${url} with status: ${response.status}`);
      hasError = true;
    }
  } catch (error: any) {
    if (error.name === 'TimeoutError') {
      console.warn(`${logPrefix}: Image HEAD request timed out for ${url}`);
    } else {
      console.error(`${logPrefix}: Error fetching image HEAD for ${url}:`, error);
    }
    hasError = true;
  }
  cache.set(url, hasError);
  return hasError;
}

async function getProcessedNewBooks(): Promise<Book[]> {
  const typedBooksData = booksDataFromFile as Array<Omit<Book, 'continent' | 'hasError'>>;
  const sortedNewBooks = [...typedBooksData]
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 12);

  const imageCheckCache = new Map<string, boolean>(); 

  const booksWithImageStatus = await Promise.all(
    sortedNewBooks.map(async (book) => {
      const hasError = await checkImage(book.image_url || "", imageCheckCache, "NewBooks");
      return { ...book, hasError, continent: undefined } as Book;
    })
  );
  return booksWithImageStatus;
}

async function getProcessedBookListData(): Promise<Book[]> {
  const typedBooksData = booksDataFromFile as Array<Omit<Book, 'continent' | 'hasError'>>;
  const imageCheckCache = new Map<string, boolean>();

  const booksWithContinent = typedBooksData.map(book => ({
    ...book,
    continent: getContinentByCountry(book.country) || undefined,
  }));

  const booksWithImageStatus = await Promise.all(
    booksWithContinent.map(async (book) => {
      const hasError = await checkImage(book.image_url || "", imageCheckCache, "BookList");
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
