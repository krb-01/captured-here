'use client';

import {useState} from 'react';
import {Label} from '@/components/ui/label';
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from '@/components/ui/select';

const continents = ['Africa', 'Asia', 'Europe', 'North America', 'South America', 'Oceania', 'Antarctica'];
const countriesByContinent: { [continent: string]: string[] } = {
  'Africa': ['Egypt', 'Nigeria', 'South Africa'],
  'Asia': ['China', 'India', 'Japan'],
  'Europe': ['France', 'Germany', 'Spain'],
  'North America': ['USA', 'Canada', 'Mexico'],
  'South America': ['Brazil', 'Argentina', 'Colombia'],
  'Oceania': ['Australia', 'New Zealand'],
  'Antarctica': ['Antarctica'],
};
const regionsByCountry: { [country: string]: string[] } = {
  'USA': ['Northeast', 'Midwest', 'South', 'West'],
  'Canada': ['Ontario', 'Quebec', 'British Columbia'],
  'Mexico': ['Yucatán Peninsula', 'Baja California', 'Central Highlands'],
  'Egypt': ['Cairo', 'Alexandria', 'Giza'],
  'Nigeria': ['Lagos', 'Abuja', 'Kano'],
  'South Africa': ['Gauteng', 'Western Cape', 'KwaZulu-Natal'],
  'China': ['Beijing', 'Shanghai', 'Guangdong'],
  'India': ['Maharashtra', 'Delhi', 'Karnataka'],
  'Japan': ['Tokyo', 'Osaka', 'Kyoto'],
  'France': ['Île-de-France', 'Provence-Alpes-Côte d\'Azur', 'Nouvelle-Aquitaine'],
  'Germany': ['Bavaria', 'North Rhine-Westphalia', 'Baden-Württemberg'],
  'Spain': ['Madrid', 'Catalonia', 'Andalusia'],
  'Australia': ['New South Wales', 'Victoria', 'Queensland'],
  'New Zealand': ['Auckland', 'Wellington', 'Canterbury'],
  'Antarctica': ['McMurdo Station', 'Amundsen-Scott South Pole Station'],
};

export function LocationSearch() {
  const [continent, setContinent] = useState('');
  const [country, setCountry] = useState('');
  const [region, setRegion] = useState('');

  const handleContinentChange = (value: string) => {
    setContinent(value);
    setCountry('');
    setRegion('');
  };

  const handleCountryChange = (value: string) => {
    setCountry(value);
    setRegion('');
  };

  const handleRegionChange = (value: string) => {
    setRegion(value);
  };

  return (
    <div className="flex flex-col space-y-4">
      <div>
        <Label htmlFor="continent" className="block text-sm font-medium text-gray-700">Continent</Label>
        <Select id="continent" onValueChange={handleContinentChange}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select a continent" />
          </SelectTrigger>
          <SelectContent>
            {continents.map((continent) => (
              <SelectItem key={continent} value={continent}>
                {continent}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="country" className="block text-sm font-medium text-gray-700">Country</Label>
        <Select id="country" onValueChange={handleCountryChange} disabled={!continent}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select a country" />
          </SelectTrigger>
          <SelectContent>
            {countriesByContinent[continent]?.map((country) => (
              <SelectItem key={country} value={country}>
                {country}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="region" className="block text-sm font-medium text-gray-700">Region</Label>
        <Select id="region" onValueChange={handleRegionChange} disabled={!country}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select a region" />
          </SelectTrigger>
          <SelectContent>
            {regionsByCountry[country]?.map((region) => (
              <SelectItem key={region} value={region}>
                {region}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {region && (
        <div className="text-green-500">
          You have selected: {region}, {country}, {continent}
        </div>
      )}
    </div>
  );
}
