 'use client';

import { useState, useEffect } from 'react';
import * as Select from '@radix-ui/react-select';
import { Label } from '@/components/ui/label';
import { regions } from '@/utils/countries';
import { ComposableMap, Geographies, Geography, Sphere, Graticule, ZoomableGroup } from 'react-simple-maps';  
import { geoCentroid } from 'd3-geo';
import worldData from 'world-atlas/countries-110m.json'; // Import worldData
import { feature } from 'topojson-client';
 
interface LocationSearchProps {
  onRegionChange: (region: string | null) => void;
  onCountryChange: (country: string | null) => void;
  initialRegion: { region: string; countries: { name: string; code: string }[] } | null;
}

export const LocationSearch: React.FC<LocationSearchProps> = ({ initialRegion, onRegionChange, onCountryChange }): JSX.Element => {
  const world: any = { ...worldData, type: "Topology" };
  const [selectedRegion, setSelectedRegion] = useState<{ region: string, countries: { name: string, code: string }[] } | null>(initialRegion);
  const geographies = feature(world, world.objects.countries).features
  const [selectedCountry, setSelectedCountry] = useState<{ name: string, code: string, label: string, value: string } | null>(null)
  const [centered, setCentered] = useState<[number, number]>([0, 0]);
  const [zoom, setZoom] = useState(1);

  const regionOptions = regions.map((region) => ({ 
    value: region.region,
    label: region.region,
    countries: region.countries,
  }));

  const countryOptions = selectedRegion
    ? selectedRegion.countries.map((country) => ({
        value: country.code,
        label: country.name,
        ...country,
      }))
    : [];

  const handleRegionChange = (selectedOption: any) => {
    setSelectedRegion(selectedOption);
    setSelectedCountry(null);
    setZoom(1);

    onRegionChange(selectedOption?.value ?? null);
  };

  const handleCountryChange = (selectedOption: any) => {

    if(selectedOption){
      const selectedCountryGeometry = geographies.find(
        (geo: any) => geo.properties.iso_a2 === selectedOption.value
      )?.geometry;

      

        if (selectedCountryGeometry) {
          const [longitude, latitude] = geoCentroid(selectedCountryGeometry);
          setCentered([longitude, latitude]);
        }
    }

    if(selectedOption){
      setSelectedCountry(selectedOption);
    }
    onCountryChange(selectedOption?.value ?? null);
    setZoom(3);
  };

  const handleResetZoom = () => {
    setZoom(1);
    setCentered([0,0]);
  }


    useEffect(() => {
      handleResetZoom();
    }, [selectedRegion?.region]);


  return (
    <div className="flex">
      {/* Map Section */}
      <div className="w-2/3">
        <ComposableMap
          projection="geoMercator"
          projectionConfig={{
            center: centered,
          }}
        >
          <ZoomableGroup zoom={zoom}>
            <Sphere stroke="#e0e0e0" strokeWidth={0.5} fill="#f0f0f0" id="sphere" />
            <Graticule stroke="#e0e0e0" strokeWidth={0.5} />
            <Geographies geography={worldData} fill="#ddd" stroke="#e0e0e0">
              {({ geographies }) =>
                geographies.map((geo: any) => {
                    const isSelected = selectedCountry ? selectedCountry.code === geo.properties?.iso_a2 : false;
                    return (
                      <Geography
                        key={geo.rsmKey}
                        geography={geo}
                        fill={isSelected ? '#FF5733' : '#ddd'}
                        stroke="#e0e0e0"
                      />
                    );
                  })
                }
            </Geographies>
          </ZoomableGroup>
        </ComposableMap>
      </div> 

      {/* Pulldown Menus Section */}
      <div className="w-1/3 pl-4">
        <div className="space-y-4" style={{ width: '200px' }}>
          <div className="space-y-2">
          <Label htmlFor="region-select">Region</Label>
            <Select.Root onValueChange={handleRegionChange}>
              <Select.Trigger className="w-full border border-gray-300 rounded-md px-3 py-2 text-left flex items-center justify-between">
                <Select.Value placeholder="Select a Region" />
                <Select.Icon className="text-gray-400" />
              </Select.Trigger>
              <Select.Portal>
                <Select.Content className="overflow-hidden border border-gray-300 rounded-md z-50">
                  <Select.ScrollUpButton className="flex items-center justify-center h-6 bg-gray-100 text-gray-500" />
                  <Select.Viewport className="px-1.5 py-1.5">
                    {regionOptions.map((option) => (
                      <Select.Item key={option.value} value={option.value} className="px-2 py-1.5 rounded-sm text-sm hover:bg-gray-100 focus:bg-gray-100 outline-none">
                         <Select.ItemText>{option.label}</Select.ItemText>
                      </Select.Item>
                    ))}
                  </Select.Viewport>
                  <Select.ScrollDownButton className="flex items-center justify-center h-6 bg-gray-100 text-gray-500" />
                </Select.Content>
              </Select.Portal>
            </Select.Root>
          </div>
          <div className="space-y-2">
            <Label htmlFor="country-select">Country</Label>
            <Select.Root onValueChange={handleCountryChange} disabled={!selectedRegion}>
              <Select.Trigger className="w-full border border-gray-300 rounded-md px-3 py-2 text-left flex items-center justify-between">
                <Select.Value placeholder="Select a Country" />
                <Select.Icon className="text-gray-400" />
              </Select.Trigger>
            </Select.Root>
          </div>
        </div>
      </div>
    </div>
  );
};
