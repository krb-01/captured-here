import BookList from "@/components/BookList";
import Map from "@/components/Map";
import SearchUI from "@/components/SearchUI";
import NewBooks from "@/components/NewBooks";
import Link from "next/link";

export default function Home() {
    return (
        <main className="min-h-screen bg-white text-black">
            <header className="w-full bg-[#212121] text-white sticky top-0 z-50 p-4">
                <Link href="/" className="flex flex-col">
                    <div className="text-5xl font-bold">CAPTURED HERE</div>
                    <div className="text-sm">Photography Book And Art Book Finder</div>
                </Link>
            </header>

            <section className="flex gap-4 p-4 bg-white">
                <div className="w-3/5">
                    <Map />
                </div>
                <div className="w-2/5">
                    <SearchUI />
                </div>
            </section>

            <section className="mb-4">
                <BookList />
            </section>

            <section className="mb-4">
                <NewBooks />
            </section>

            <section className="w-full bg-black text-white text-sm p-4">
                <div className="flex flex-col">
                    <div className="flex gap-4 mb-2">
                        <Link href="/about">About</Link>
                        <Link href="/privacy-policy">Privacy Policy</Link>
                    </div>
                    <div className="text-xs">
                        © {new Date().getFullYear()} CAPTURED HERE. All rights reserved.
                    </div>
                </div>
            </section>

        </main>
    );
}

