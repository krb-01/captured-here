// import Layout from "@/components/Layout"; // Already removed
import NewBooksClient from '@/components/NewBooksClient';
import InteractiveClientSections from "@/components/InteractiveClientSections";
// import booksDataFromFile from '@/lib/books.json'; // No longer using local JSON
import { fetchAllBooksFromFirestore } from '@/lib/firebaseAdmin';
import { getContinentByCountry, continentCountries } from "@/utils/continentCountries"; // continentCountriesもインポート

// Updated Book interface
interface Book {
  id?: string; 
  // isbn?: string; // Removed
  title: string;
  author: string;
  image_url?: string;
  region: string; // Comma-separated string from Firestore
  country: string; // Comma-separated string from Firestore
  description: string;
  created_at: string; 
  updated_at: string; 
  continent?: string[]; // Array of continent names
  amazon_url?: string; 
}

// Interface for data structure from Firestore
interface FirestoreBookData {
  id?: string;
  author: string;
  country: string; 
  created_at: any; 
  description: string;
  image_url?: string; 
  region: string; 
  title: string;
  updated_at: any; 
  url: string; // Amazon URL
  // isbn is not expected from Firestore directly
}

// Helper to process a single book from Firestore data to Book type
function processFirestoreBook(bookInput: FirestoreBookData): Book {
  const imageUrl = bookInput.image_url || ""; // Use Firestore's image_url directly
  
  const countries = bookInput.country ? bookInput.country.split(',').map(c => c.trim()) : [];
  const uniqueContinents = new Set<string>();
  if (countries.length > 0) {
    countries.forEach(singleCountry => {
      const continentForCountry = getContinentByCountry(singleCountry);
      if (continentForCountry && continentForCountry !== "Unknown") { // Assuming "Unknown" is not a valid continent to add
        uniqueContinents.add(continentForCountry);
      }
    });
  }
  const continentsArray = uniqueContinents.size > 0 ? Array.from(uniqueContinents) : undefined;

  const createdAtString = bookInput.created_at?.toDate ? bookInput.created_at.toDate().toISOString() : new Date(bookInput.created_at).toISOString();
  const updatedAtString = bookInput.updated_at?.toDate ? bookInput.updated_at.toDate().toISOString() : new Date(bookInput.updated_at).toISOString();

  return {
    id: bookInput.id,
    title: bookInput.title,
    author: bookInput.author,
    image_url: imageUrl,
    region: bookInput.region, // Keep as comma-separated string
    country: bookInput.country, // Keep as comma-separated string
    description: bookInput.description,
    created_at: createdAtString,
    updated_at: updatedAtString,
    continent: continentsArray,
    amazon_url: bookInput.url,
  } as Book;
}

async function getProcessedNewBooks(): Promise<Book[]> {
  const allBooksFromFirestore = await fetchAllBooksFromFirestore();
  const typedBooksData = allBooksFromFirestore as FirestoreBookData[];

  const sortedNewBooks = [...typedBooksData]
    .sort((a, b) => {
        const dateA = a.created_at?.toDate ? a.created_at.toDate() : new Date(a.created_at);
        const dateB = b.created_at?.toDate ? b.created_at.toDate() : new Date(b.created_at);
        return dateB.getTime() - dateA.getTime();
    })
    .slice(0, 12);

  const booksWithDetails = sortedNewBooks.map(processFirestoreBook);
  return booksWithDetails;
}

async function getProcessedBookListData(): Promise<Book[]> {
  const allBooksFromFirestore = await fetchAllBooksFromFirestore();
  const typedBooksData = allBooksFromFirestore as FirestoreBookData[];

  const booksWithDetails = typedBooksData.map(processFirestoreBook);
  return booksWithDetails;
}

export default async function Home() {
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
