
import {BookList} from '@/components/book-list';
import {LocationSearch} from '@/components/location-search';

export default function Home() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Book Explorer</h1>
      <LocationSearch />
      <BookList />
    </div>
  );
}


