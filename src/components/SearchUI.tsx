// src/components/SearchUI.tsx
import countryList from "@/lib/country-list.json";

const SearchUI = () => {
  return (
    <div className="w-full">
      <div className="mb-4 text-black">
        Search by Region
      </div>

        <label htmlFor="continent" className="block">Continent:</label>
        <select id="continent" className="border p-2 rounded">
          <option value="asia">Asia</option>
          <option value="europe">Europe</option>
          <option value="africa">Africa</option>
          <option value="northAmerica">North America</option>
          <option value="southAmerica">South America</option>
          <option value="australia">Australia</option>
          <option value="antarctica">Antarctica</option>
        </select>
    
      <div className="mb-2">
        <label htmlFor="country" className="block">Country:</label>
        <select id="country" className="border p-2 rounded">
          {Object.entries(countryList.country_code).map(([name, code]) => (
            <option key={code} value={code}>{name}</option>
          ))}
        </select>
      </div>
    </div>
  );
};
export default SearchUI;