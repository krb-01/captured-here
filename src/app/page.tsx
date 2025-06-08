// import Layout from "@/components/Layout"; // Already removed
import NewBooksClient from '@/components/NewBooksClient';
import InteractiveClientSections from "@/components/InteractiveClientSections";
import { fetchAllBooksFromFirestore } from '@/lib/firebaseAdmin';
import { getContinentByCountry } from "@/utils/continentCountries";

// Updated Book interface
interface Book {
  id?: string; 
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

// Interface for Firestore Timestamp like objects (as received by Admin SDK)
interface FirestoreAdminTimestamp { 
  seconds: number;
  nanoseconds: number;
  toDate: () => Date;
}

// Interface for data structure from Firestore
interface FirestoreBookData {
  id?: string;
  author: string;
  country: string; 
  created_at: FirestoreAdminTimestamp | string | Date; // Removed 'any'
  description: string;
  image_url?: string; 
  region: string; 
  title: string;
  updated_at: FirestoreAdminTimestamp | string | Date; // Removed 'any'
  url: string; // Amazon URL
}

// Helper to process a single book from Firestore data to Book type
function processFirestoreBook(bookInput: FirestoreBookData): Book {
  const imageUrl = bookInput.image_url || ""; 
  
  const countries = bookInput.country ? bookInput.country.split(',').map(c => c.trim()) : [];
  const uniqueContinents = new Set<string>();
  if (countries.length > 0) {
    countries.forEach(singleCountry => {
      const continentForCountry = getContinentByCountry(singleCountry);
      if (continentForCountry && continentForCountry !== "Unknown") { 
        uniqueContinents.add(continentForCountry);
      }
    });
  }
  const continentsArray = uniqueContinents.size > 0 ? Array.from(uniqueContinents) : undefined;

  // Ensure created_at and updated_at are properly handled if they are Firestore Timestamps or already strings/Dates
  const createdAtString = typeof bookInput.created_at === 'string' ? bookInput.created_at :
                        (bookInput.created_at instanceof Date ? bookInput.created_at.toISOString() :
                        (bookInput.created_at && (bookInput.created_at as FirestoreAdminTimestamp).toDate) ? (bookInput.created_at as FirestoreAdminTimestamp).toDate().toISOString() : new Date().toISOString());
  
  const updatedAtString = typeof bookInput.updated_at === 'string' ? bookInput.updated_at :
                        (bookInput.updated_at instanceof Date ? bookInput.updated_at.toISOString() :
                        (bookInput.updated_at && (bookInput.updated_at as FirestoreAdminTimestamp).toDate) ? (bookInput.updated_at as FirestoreAdminTimestamp).toDate().toISOString() : new Date().toISOString());

  // Add associate ID to Amazon URL
  const associateId = process.env.NEXT_PUBLIC_AMAZON_ASSOCIATE_ID || 'kairikubooks-20'; // Fallback to your ID
  let finalAmazonUrl = bookInput.url;
  if (finalAmazonUrl) {
    try {
      const url = new URL(finalAmazonUrl);
      url.searchParams.set('tag', associateId);
      finalAmazonUrl = url.toString();
    } catch (error) {
      console.error(`Invalid Amazon URL found: ${finalAmazonUrl}`, error);
      // If URL is invalid, use the original URL
    }
  }

  return {
    id: bookInput.id,
    title: bookInput.title,
    author: bookInput.author,
    image_url: imageUrl,
    region: bookInput.region, 
    country: bookInput.country, 
    description: bookInput.description,
    created_at: createdAtString,
    updated_at: updatedAtString,
    continent: continentsArray,
    amazon_url: finalAmazonUrl, // Use the modified URL
  } as Book;
}

async function getProcessedNewBooks(): Promise<Book[]> {
  const allBooksFromFirestore = await fetchAllBooksFromFirestore();
  // Assuming fetchAllBooksFromFirestore now returns FirestoreBookData[] typed correctly from firebaseAdmin.ts
  const typedBooksData = allBooksFromFirestore as FirestoreBookData[]; 

  const sortedNewBooks = [...typedBooksData]
    .sort((a, b) => {
        const dateA = a.created_at && (a.created_at as FirestoreAdminTimestamp).toDate ? (a.created_at as FirestoreAdminTimestamp).toDate() : new Date(a.created_at as string | Date);
        const dateB = b.created_at && (b.created_at as FirestoreAdminTimestamp).toDate ? (b.created_at as FirestoreAdminTimestamp).toDate() : new Date(b.created_at as string | Date);
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
