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
  cache: Map<string, boolean>,
  logPrefix: string = ""
): Promise<boolean> {
  if (!url) {
    console.warn(`${logPrefix}: No image_url provided or empty.`);
    return true; 
  }
  if (cache.has(url)) {
    return cache.get(url)!;
  }

  let finalHasError = false;
  let headFailed = false;

  try {
    // console.log(`${logPrefix}: ==> Attempting HEAD for ${url}`);
    let response = await fetch(url, { method: 'HEAD', signal: AbortSignal.timeout(7000) });
    if (!response.ok) {
      console.warn(`${logPrefix}: Image HEAD request FAILED for ${url} with status: ${response.status}.`);
      headFailed = true;
    } else {
      // console.log(`${logPrefix}: Image HEAD request SUCCEEDED for ${url}.`);
      finalHasError = false; 
    }

    if (headFailed) {
      // console.log(`${logPrefix}: ==> Attempting GET for ${url} (due to HEAD failure)`);
      response = await fetch(url, { method: 'GET', signal: AbortSignal.timeout(7000) }); 
      if (!response.ok) {
        console.warn(`${logPrefix}: Image GET request FAILED for ${url} with status: ${response.status}`);
        finalHasError = true;
      } else {
        // console.log(`${logPrefix}: Image GET request SUCCEEDED for ${url}.`);
        finalHasError = false; 
      }
    }
  } catch (error: any) {
    const requestType = headFailed ? 'GET' : 'HEAD';
    if (error.name === 'TimeoutError') {
      console.warn(`${logPrefix}: Image ${requestType} request timed out for ${url}`);
    } else {
      console.error(`${logPrefix}: Error during ${requestType} request for ${url}:`, error.message);
    }
    finalHasError = true;
  }
  // console.log(`${logPrefix}: <== Final decision for ${url}. HasError: ${finalHasError}`);
  cache.set(url, finalHasError);
  return finalHasError;
}

async function getProcessedNewBooks(): Promise<Book[]> {
  const typedBooksData = booksDataFromFile as Array<Omit<Book, 'continent' | 'hasError' | 'image_url'>>;
  const sortedNewBooks = [...typedBooksData]
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 12);

  const imageCheckCache = new Map<string, boolean>(); 

  const booksWithImageStatus = await Promise.all(
    sortedNewBooks.map(async (bookInput) => {
      const imageUrl = bookInput.isbn ? `https://images-na.ssl-images-amazon.com/images/P/${bookInput.isbn}.09_THUMBZZZ.jpg` : "";
      // console.log(`NewBooks: Attempting new imageUrl: ${imageUrl} (ISBN: ${bookInput.isbn})`);
      const hasError = await checkImage(imageUrl, imageCheckCache, "NewBooks");
      return { ...bookInput, image_url: imageUrl, hasError, continent: undefined } as Book;
    })
  );
  return booksWithImageStatus;
}

async function getProcessedBookListData(): Promise<Book[]> {
  const typedBooksData = booksDataFromFile as Array<Omit<Book, 'continent' | 'hasError' | 'image_url'>>;
  const imageCheckCache = new Map<string, boolean>();

  const booksWithDetails = await Promise.all(
    typedBooksData.map(async (bookInput) => {
      const imageUrl = bookInput.isbn ? `https://images-na.ssl-images-amazon.com/images/P/${bookInput.isbn}.09_THUMBZZZ.jpg` : "";
      // console.log(`BookList: Attempting new imageUrl: ${imageUrl} (ISBN: ${bookInput.isbn})`);
      const hasError = await checkImage(imageUrl, imageCheckCache, "BookList");
      const continent = getContinentByCountry(bookInput.country) || undefined;
      return { ...bookInput, image_url: imageUrl, hasError, continent } as Book;
    })
  );

  return booksWithDetails.sort(
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
