 'use client';

import React, { useState, useEffect, ReactNode } from 'react';
import * as Select from '@radix-ui/react-select';
import { Label } from '@/components/ui/label';
import { regions } from '@/utils/countries';
import { ComposableMap, Geographies, Geography, Sphere, Graticule, ZoomableGroup } from 'react-simple-maps';
import { geoCentroid } from 'd3-geo';

import { simplify } from 'topojson-simplify';
import type { Topology, Objects, GeometryCollection, Transform } from 'topojson-specification';

import { centroid } from '@turf/centroid';
import worldData from 'world-atlas/countries-110m.json';
import { GeoJsonProperties, Geometry } from 'geojson';


interface LocationSearchProps { 
  onRegionChange: (region: string | null) => void;
  onCountryChange: (country: string | null) => void;
  initialRegion: { region: string; countries: { name: string; code: string }[] } | null;
}

export const LocationSearch: React.FC<LocationSearchProps> = ({
  initialRegion,
  onRegionChange,
  onCountryChange,
}) : ReactNode => {
  const initialZoom = 1;
  const initialCentered: [number, number] = [0, 0];
 const { objects, arcs, transform, bbox }: Topology<any> = worldData as any;
 const world: Topology<any> = {
    ...worldData,
    type: "Topology",
  } as Topology<any>;

  const simplifiedWorld = simplify(world, 0.05)

    const { feature } = require('topojson-client');    
    const countries = feature(simplifiedWorld, simplifiedWorld.objects.countries);

    const geographies = countries.features;

  const [zoom, setZoom] = useState<number>(initialZoom);
  const [centered, setCentered] = useState<[number, number]>(initialCentered);
  const [selectedRegion, setSelectedRegion] = useState<string | undefined>(
    initialRegion?.region
  );
  const [selectedCountry, setSelectedCountry] = useState<
    { name: string; code: string; label: string; value: string } | undefined
  >(undefined);

   const regionOptions = regions.map((region) => ({
        value: region.region,
        label: region.region,
        countries: region.countries,
      }));
  const countryOptions: { value: string; label: string; name: string; code: string }[] =
    selectedRegion
      ? regions
          .find((r) => r.region === selectedRegion)
          ?.countries.map((country) => ({
          value: country.code,
          label: country.name,
          ...country,
          })) ?? []
      : [];
  const handleRegionChange = (selectedOption: { value: string; label: string }) => {
    setSelectedRegion(selectedOption.value); // Update the selected region
      setSelectedCountry(undefined);
      
    if (onRegionChange) {
      onRegionChange(selectedOption.value);
    }
  };

    const handleCountryChange = (selectedOption: { value: string; label: string }) => {
        if (selectedOption) {
            const selectedCountry = geographies.find((geo: any) => geo.properties.iso_a2 === selectedOption.value);
            if (!selectedCountry) return;          
            const selectedCountryGeometry = selectedCountry.geometry;

            if (selectedCountryGeometry) {
                const [longitude, latitude] = centroid(selectedCountryGeometry).geometry.coordinates;
                setCentered([longitude, latitude]);                
                setZoom(3);
            }
            setSelectedCountry({ name: selectedOption.label, code: selectedOption.value, label: selectedOption.label, value: selectedOption.value });
        }
        onCountryChange(selectedOption?.value);
    };

  
  const handleResetZoom = () => {
    setZoom(1);
    setCentered([0,0]);
    }
    useEffect(() => {

        handleResetZoom();
    }, [selectedRegion]);

  return (
    <div className="flex">
      {/* Map Section */}
      <div className="w-2/3">
        <ComposableMap
          projection="geoEquirectangular"
           projectionConfig={{
            scale: 200,
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
            <Select.Root onValueChange={(value) => handleRegionChange({value: value, label: regionOptions.find(o=>o.value == value)?.label ?? ''})}>
              <Select.Trigger className="w-full border border-gray-300 rounded-md px-3 py-2 text-left flex items-center justify-between">
                <Select.Value placeholder="Select a Region" />
                <Select.Icon className="text-gray-400" />
              </Select.Trigger>
              <Select.Portal>
                <Select.Content position="popper" className="overflow-hidden border border-gray-300 rounded-md z-50"><Select.Viewport className="px-1.5 py-1.5">
                  {regionOptions?.map((option) => (
                    <Select.Item key={option.value} value={option.value} className="px-2 py-1.5 rounded-sm text-sm hover:bg-gray-100 focus:bg-gray-100 outline-none" >
                      <Select.ItemText>{option.label}</Select.ItemText>
                    </Select.Item>
                  ))}
                </Select.Viewport>
              </Select.Content>
              </Select.Portal>
            </Select.Root>
          </div>
          {selectedRegion && (
            <div className="space-y-2">
            <Label htmlFor="country-select">Country</Label>
            <Select.Root onValueChange={(value) => handleCountryChange({ value: value, label: countryOptions.find(o => o.value === value)?.label ?? '' })}>
              <Select.Trigger className="w-full border border-gray-300 rounded-md px-3 py-2 text-left flex items-center justify-between">
                <Select.Value placeholder="Select a Country" />
                <Select.Icon className="text-gray-400" />
              </Select.Trigger>
              <Select.Portal>
                <Select.Content position="popper" className="overflow-hidden border border-gray-300 rounded-md z-50">
                  <Select.Viewport className="px-1.5 py-1.5">
                    {countryOptions.map((option) => (<Select.Item key={option.value} value={option.value} className="px-2 py-1.5 rounded-sm text-sm hover:bg-gray-100 focus:bg-gray-100 outline-none"><Select.ItemText>{option.label}</Select.ItemText>
                      </Select.Item>
                  ))}
                    </Select.Viewport>
                </Select.Content>
              </Select.Portal>
            </Select.Root>
          </div>
          )}
        </div>
      </div>
    </div>
  );
};
