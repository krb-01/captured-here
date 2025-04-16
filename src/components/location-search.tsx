'use client';

import { useState, useEffect, } from 'react';
import Select from 'react-select';
import { Label } from '@/components/ui/label';
import { regions } from '@/utils/countries';
import { ComposableMap, Geographies, Geography, Sphere, Graticule, ZoomableGroup } from 'react-simple-maps';
import { geoCentroid, } from 'd3-geo';
import world from 'world-atlas/countries-110m.json';
import { mesh, feature } from 'topojson-client';

interface LocationSearchProps {
  onRegionChange: (region: string | null) => void;
  onCountryChange: (country: string | null) => void;
}

export const LocationSearch: React.FC<LocationSearchProps> = ({ onRegionChange, onCountryChange }): JSX.Element => {
  const [selectedRegion, setSelectedRegion] = useState<{ region: string, countries: { name: string, code: string }[] } | null>(null);
  const [selectedCountry, setSelectedCountry] = useState<{ name: string, code: string, label: string, value: string } | null>(null);
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
    const countries: any = { type: 'FeatureCollection', features: [{ type: 'Feature', geometry: mesh(world as any, world.objects.countries) }] };
    if (selectedOption) {


      if (countries.features[0].geometry) {
        const [longitude, latitude] = geoCentroid(countries.features[0].geometry);
        setCentered([longitude, latitude]);
      }

        setSelectedCountry(selectedOption);
        onCountryChange(selectedOption?.value ?? null);
        setZoom(3);
    } else {
      onCountryChange(null);
    }
  };

  const handleResetZoom = () => {
    setZoom(1)
    setCentered([0,0])
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
            <Geographies geography={world} fill="#ddd" stroke="#e0e0e0">
              {({ geographies }: { geographies: any }) =>
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
            <Label htmlFor="region">Region</Label>
            <Select options={regionOptions} onChange={handleRegionChange} placeholder="Select a Region" id="region" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="country">Country</Label>
            <Select options={countryOptions} onChange={handleCountryChange} placeholder="Select a Country" isDisabled={!selectedRegion} id="country" />
          </div>
        </div>
      </div>
    </div>
  );
};
