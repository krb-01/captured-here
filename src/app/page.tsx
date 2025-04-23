import BookList from "@/components/BookList";
import Map from "@/components/Map";
import NewBooks from "@/components/NewBooks";
import SearchUI from "@/components/SearchUI";

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-100 p-8">
      <header>
        <div className="text-3xl font-bold mb-8">Captured Here</div>
      </header>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Search UI</h2>
        <SearchUI />
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Map</h2>
        <Map />
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Book List</h2>
        <BookList />
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">New Books</h2>
        <NewBooks />
      </section>
    </main>
  );
}
