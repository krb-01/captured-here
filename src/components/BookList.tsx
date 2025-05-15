import booksData from "@/lib/books.json";
import { useState, useEffect } from "react";
import { getContinentByCountry } from "@/utils/continentCountries"; // インポートを追加

interface BookListProps {
  continent?: string | null;
  country?: string | null;
  selectedContinent?: string | null;
}

// 書籍データの型に continent を追加 (オプショナル)
interface Book {
  isbn: string;
  title: string;
  author: string;
  published_on: string;
  image_url: string;
  region: string;
  country: string;
  description: string;
  created_at: string;
  updated_at: string;
  hasError: boolean;
  continent?: string; // continent プロパティを追加
  imageChecked?: boolean; // 画像チェック済みフラグ
}

const BookList: React.FC<BookListProps> = ({ continent, country, selectedContinent }) => {
  const [initialBooks, setInitialBooks] = useState<Book[]>(() =>
    [...booksData]
      .map((book) => ({
        ...book,
        hasError: false, // 初期状態ではエラーなし
        continent: getContinentByCountry(book.country) || undefined,
      }))
      .sort(
        (a, b) =>
          new Date(a.published_on).getTime() -
          new Date(b.published_on).getTime()
      )
  );

  const [processedBooks, setProcessedBooks] = useState<Book[]>([]);
  const [filteredBooks, setFilteredBooks] = useState<Book[]>([]);

  useEffect(() => {
    // 画像チェック処理（一度だけ実行またはinitialBooks変更時）
    const checkImages = async () => {
      const booksToProcess = initialBooks.filter(book => !book.imageChecked);
      if (booksToProcess.length === 0) {
        // すでに処理済みの場合は initialBooks をそのまま使う
        // ただし、initialBooksが変更された場合は再処理が必要なので、
        // processedBooksがinitialBooksと一致しない場合のみ更新する
        if (JSON.stringify(processedBooks) !== JSON.stringify(initialBooks)){
             setProcessedBooks(initialBooks);
        }
        return;
      }

      const updatedBooks = await Promise.all(
        initialBooks.map(async (book) => {
          if (book.imageChecked) return book; // 既にチェック済みならスキップ
          let hasError = book.hasError;
          if (book.image_url) {
            try {
              const response = await fetch(book.image_url);
              if (!response.ok) {
                hasError = true;
              }
            } catch (error) {
              hasError = true;
            }
          } else {
            hasError = true;
          }
          return { ...book, hasError, imageChecked: true };
        })
      );
      setProcessedBooks(updatedBooks);
    };

    checkImages();
  }, [initialBooks, processedBooks]); // initialBooksが変更されたら画像チェックを再実行

  useEffect(() => {
    // フィルタリング処理 (processedBooks, continent, country が変更されたら実行)
    if (processedBooks.length === 0 && initialBooks.length > 0 && !initialBooks.every(b => b.imageChecked)) {
      // processedBooksがまだ空で、初期の本があり、まだ画像チェックが終わっていない場合は待機
      return;
    }
    
    let newFilteredBooks = [...processedBooks]; // 画像処理済みの本をフィルタリング

    if (continent) {
      newFilteredBooks = newFilteredBooks.filter(
        (book) => book.continent === continent
      );
    }
    if (country && selectedContinent !== 'Antarctica') {
      newFilteredBooks = newFilteredBooks.filter(
        (book) => book.country === country
      );
    }
    setFilteredBooks(newFilteredBooks);
  }, [continent, country, processedBooks, initialBooks, selectedContinent]);

  let title = "Book List";
  if (continent) {
    title += ` - ${continent}`;
  }
  if (country) {
    title += ` - ${country}`;
  }

  return (
    <div className="pb-16">
      <h2 className="text-2xl font-bold text-white pt-8 mb-8">{title}</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-4">
        {filteredBooks.length === 0 ? (
          <p className="text-white">No items found</p>
        ) : (
          filteredBooks.map((book) => (
            <div
              key={book.isbn}
              className="relative flex flex-col justify-between rounded-lg bg-white p-4 shadow-sm"
            >
              <div className="h-full flex-1 bg-white">
                <div className="mb-4">
                  {book.image_url && !book.hasError ? (
                    <img
                      src={book.image_url}
                      alt={book.title}
                      className="w-full aspect-square object-contain rounded-md"
                      onError={(e: any) => {
                        console.log("Image load error in Booklist for book:", book.title);
                        // エラー発生時に filteredBooks の該当書籍の hasError を true に更新
                        setFilteredBooks(prevBooks => prevBooks.map(b => b.isbn === book.isbn ? {...b, hasError: true} : b));
                        // 必要に応じて processedBooks や initialBooks も更新することを検討
                        setProcessedBooks(prevBooks => prevBooks.map(b => b.isbn === book.isbn ? {...b, hasError: true} : b));
                      }}
                    />
                  ) : (
                    <div className="w-full aspect-square object-contain rounded-md">
                      <img
                        src="/file.svg"
                        alt="fallback"
                        className="w-full h-full object-contain"
                      />
                    </div>
                  )}
                </div>
                <div className="mb-2">
                  <p className="font-bold text-black">{book.title}</p>
                  <p className="text-sm text-black">by {book.author}</p>
                  <p className="text-xs text-black mt-1">
                    Published: {new Date(book.published_on).getFullYear()}
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2 mt-4 ">
                <button className="bg-black text-white text-xs py-2 px-4 rounded-md hover:scale-105 transition-transform">
                  DESCRIPTION
                </button>
                <button className="bg-amber-500 text-white text-xs py-2 px-4 rounded-md hover:scale-105 transition-transform">
                  AVAILABLE ON AMAZON
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default BookList;
