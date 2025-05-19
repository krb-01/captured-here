"use client";
import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import * as topojson from "topojson-client";
import * as d3geo from "d3-geo-projection";
import { feature as topojsonFeature } from "topojson-client";
import { Topology, GeometryCollection } from "topojson-specification";
import { FeatureCollection, Geometry, GeoJsonProperties, Feature } from "geojson";
import { continentCountries, getContinentByCountry } from "@/utils/continentCountries";
import continentCoordinates from "@/lib/continentCoordinates.json";

interface CountryProperties {
  name: string;
  continent?: string;
  [key: string]: any;
}

type CountryFeature = Feature<Geometry, CountryProperties>;
type WorldData = Topology<{ [key: string]: GeometryCollection<CountryProperties> }>;

type ContinentCoordinateMap = {
  [key in keyof typeof continentCoordinates]?: { latitude: number; longitude: number; }
};
const typedContinentCoordinates = continentCoordinates as ContinentCoordinateMap;


interface MapProps {
  selectedCountry: string | null;
  selectedContinent: string | null;
  onCountryClick: (country: string | null, continent: string | null) => void;
  onMapReady?: () => void;
}

const Map: React.FC<MapProps> = ({ selectedCountry, selectedContinent, onCountryClick, onMapReady }) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [landFeatures, setLandFeatures] = useState<CountryFeature[]>([]);
  const projectionRef = useRef<d3.GeoProjection | null>(null);
  const geoPathRef = useRef<d3.GeoPath | null>(null);
  const gRef = useRef<SVGGElement | null>(null);

  const [mapWidth, setMapWidth] = useState(0);
  const [mapHeight, setMapHeight] = useState(0);
  const [hasMapInitialized, setHasMapInitialized] = useState(false);

  useEffect(() => {
    if (!svgRef.current) return;
    const resizeObserver = new ResizeObserver(entries => {
      if (!entries || entries.length === 0) return;
      const { width, height } = entries[0].contentRect;
      setMapWidth(width);
      setMapHeight(height);
    });
    resizeObserver.observe(svgRef.current);
    setMapWidth(svgRef.current.clientWidth);
    setMapHeight(svgRef.current.clientHeight);
    return () => resizeObserver.disconnect();
  }, []);

  useEffect(() => {
    if (mapWidth > 0 && mapHeight > 0 && !hasMapInitialized) {
      // Proceed to fetch data and draw only if dimensions are set and not already initialized
    } else {
        return; 
    }
    const fetchDataAndDrawMap = async () => {
      if (!svgRef.current || mapWidth === 0 || mapHeight === 0) return;
      try {
        const worldData = (await d3.json("/world/countries.json")) as WorldData;
        const land = topojsonFeature(
          worldData,
          worldData.objects.ne_10m_admin_0_countries
        ) as FeatureCollection<Geometry, GeoJsonProperties>;
        const featuresWithContinent: CountryFeature[] = land.features
          .map((feature) => {
            const countryName = feature.properties?.NAME || feature.properties?.name || feature.properties?.ADMIN;
            if (!countryName || typeof countryName !== 'string') return null;
            let continent: string = "";
            for (const continentEntry in continentCountries) {
              if (continentCountries[continentEntry as keyof typeof continentCountries].includes(countryName)) {
                continent = continentEntry;
                break;
              }
            }
            const properties: CountryProperties = { ...(feature.properties as GeoJsonProperties), name: countryName, continent: continent };
            return { ...feature, properties: properties } as CountryFeature;
          })
          .filter((feature): feature is CountryFeature => feature !== null);
        setLandFeatures(featuresWithContinent); 

        const svg = d3.select(svgRef.current);
        projectionRef.current = d3geo.geoMollweide();
        let g = svg.select<SVGGElement>("#map-group");
        if (g.empty()) {
          gRef.current = svg.append("g").attr("id", "map-group").node();
        } else {
          gRef.current = g.node();
        }
        if (!gRef.current || !projectionRef.current) return; 

        // Fit to Sphere for initial display
        projectionRef.current.fitExtent([[0, 0], [mapWidth, mapHeight]], { type: "Sphere" } as any);
        geoPathRef.current = d3.geoPath(projectionRef.current);
        if (!geoPathRef.current) return;

        // Draw paths using landFeatures
        d3.select(gRef.current)
          .selectAll<SVGPathElement, CountryFeature>("path.country")
          .data(featuresWithContinent, (d) => d.properties.name)
          .join(
            enter => enter.append("path")
              .attr("class", "country")
              .attr("d", geoPathRef.current as any)
              .attr("fill", "#212121") 
              .on("click", function (event, d) {
                const name = d.properties.name;
                const continent = d.properties.continent;
                if (name && name !== "Unknown") onCountryClick(name, continent || null);
                else onCountryClick(null, null);
              })
              // Mouse events will be fully managed by the other useEffect that depends on selectedCountry
              .style("stroke", "#fff")
              .style("stroke-width", "0.3"),
            update => update.attr("d", geoPathRef.current as any),
            exit => exit.remove()
          );
        
        // Only call onMapReady once after the first successful draw attempt
        if (gRef.current) { // featuresWithContinent.length > 0 check is implicitly handled by data join
            onMapReady && onMapReady();
            setHasMapInitialized(true);
        }

      } catch (error) {
        console.error("Error loading or processing map data:", error);
      }
    };
    fetchDataAndDrawMap();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mapWidth, mapHeight, onMapReady, hasMapInitialized]); // Removed landFeatures.length, selectedCountry. Mouse events are in dedicated effect.

  useEffect(() => {
    if (!svgRef.current || !projectionRef.current || !gRef.current || landFeatures.length === 0 || mapWidth === 0 || mapHeight === 0 || !hasMapInitialized) return;
    const g = d3.select(gRef.current);
    const projection = projectionRef.current;
    let targetFeatureForFitExtent: Feature<Geometry, CountryProperties> | FeatureCollection<Geometry, CountryProperties> | { type: "Sphere" } | null = null;
    let newRotation: [number, number, number] = [0, 0, 0];

    if (selectedCountry) {
      const countryFeature = landFeatures.find(f => f.properties.name === selectedCountry);
      if (countryFeature) {
        targetFeatureForFitExtent = countryFeature;
        const centroid = d3.geoCentroid(countryFeature);
        newRotation = [-centroid[0], -centroid[1], 0];
      } else { // Fallback to sphere if selectedCountry not found (should ideally not happen)
        targetFeatureForFitExtent = { type: "Sphere" };
      }
    } else if (selectedContinent && selectedContinent !== "Seven seas (open ocean)") {
      const coords = typedContinentCoordinates[selectedContinent as keyof typeof typedContinentCoordinates];
      if (coords) newRotation = [-coords.longitude, -coords.latitude, 0];
      const continentFeatures = landFeatures.filter(f => f.properties.continent === selectedContinent);
      if (continentFeatures.length > 0) {
        targetFeatureForFitExtent = { type: "FeatureCollection", features: continentFeatures } as FeatureCollection<Geometry, CountryProperties>;
      } else { // Fallback to sphere if no features for continent
        targetFeatureForFitExtent = { type: "Sphere" };
      }
    } else { 
      targetFeatureForFitExtent = { type: "Sphere" };
    }
    
    projection.rotate(newRotation);
    
    if (targetFeatureForFitExtent) {
        projection.fitExtent([[0, 0], [mapWidth, mapHeight]], targetFeatureForFitExtent as any);
    }
    
    geoPathRef.current = d3.geoPath(projection);

    g.selectAll("path.country")
      .transition()
      .duration(300)
      .attr("d", geoPathRef.current as any);

  }, [selectedCountry, selectedContinent, landFeatures, mapWidth, mapHeight, hasMapInitialized]);

  useEffect(() => {
    if (!gRef.current || landFeatures.length === 0 || !hasMapInitialized) return;
    const paths = d3.select(gRef.current)
      .selectAll<SVGPathElement, CountryFeature>("path.country");

    paths
      .attr("fill", (d) => {
        return d.properties.name === selectedCountry ? "#0E3DF1" : "#212121";
      })
      .on("mouseover", function (event, d) {
        if (d.properties.name !== selectedCountry) {
          d3.select(this).attr("fill", "#0E3DF1");
        }
      })
      .on("mouseout", function (event, d) {
        d3.select(this).attr("fill", d.properties.name === selectedCountry ? "#0E3DF1" : "#212121");
      });

  }, [selectedCountry, landFeatures, hasMapInitialized]);

  return (
    <div className="h-full w-full"> 
      <svg ref={svgRef} width="100%" height="100%" />
    </div>
  );
};

export default Map;
