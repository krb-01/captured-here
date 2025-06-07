"use client";
import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import * as d3geo from "d3-geo-projection";
import { feature as topojsonFeature } from "topojson-client";
import { Topology, GeometryCollection } from "topojson-specification";
import { FeatureCollection, Feature, Geometry } from "geojson"; // GeoJsonObject removed
import { continentCountries } from "@/utils/continentCountries";
import continentCoordinates from "@/lib/continentCoordinates.json";

interface CountryProperties {
  name: string;
  continent?: string;
  ADMIN?: string;
  NAME?: string;
  [key: string]: unknown; 
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
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const geoPathRef = useRef<d3.GeoPath<any, d3.GeoPermissibleObjects> | null>(null);
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
        ) as FeatureCollection<Geometry, CountryProperties>; 
        
        const featuresWithContinent: CountryFeature[] = land.features
          .map((feature) => {
            const props = feature.properties as CountryProperties;
            const countryName = props?.NAME || props?.name || props?.ADMIN;
            if (!countryName || typeof countryName !== 'string') return null;
            let continent: string = "";
            for (const cName in continentCountries) {
              if (continentCountries[cName as keyof typeof continentCountries].includes(countryName)) {
                continent = cName;
                break;
              }
            }
            const newProperties: CountryProperties = { ...props, name: countryName, continent: continent };
            return { ...feature, properties: newProperties } as CountryFeature;
          })
          .filter((feature): feature is CountryFeature => feature !== null);
        setLandFeatures(featuresWithContinent); 

        const svg = d3.select(svgRef.current);
        projectionRef.current = d3geo.geoMollweide();
        const g = svg.select<SVGSVGElement>("#map-group");
        if (g.empty()) {
          gRef.current = svg.append("g").attr("id", "#map-group").node();
        } else {
          gRef.current = g.node();
        }
        if (!gRef.current || !projectionRef.current) return; 
        
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        projectionRef.current.fitExtent([[0, 0], [mapWidth, mapHeight]], { type: "Sphere" } as any);
        geoPathRef.current = d3.geoPath(projectionRef.current);
        if (!geoPathRef.current) return;

        d3.select(gRef.current)
          .selectAll<SVGPathElement, CountryFeature>("path.country")
          .data(featuresWithContinent, (d) => d.properties.name)
          .join(
            enter => enter.append("path")
              .attr("class", "country")
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              .attr("d", geoPathRef.current! as any) 
              .attr("fill", "#212121") 
              .on("click", function (event, d) {
                const name = d.properties.name;
                const continent = d.properties.continent;
                if (name && name !== "Unknown") onCountryClick(name, continent || null);
                else onCountryClick(null, null);
              })
              .style("stroke", "#fff")
              .style("stroke-width", "0.3"),
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            update => update.attr("d", geoPathRef.current! as any),
            exit => exit.remove()
          );

        if (gRef.current) { 
            if (onMapReady) {
                onMapReady();
            }
            setHasMapInitialized(true);
        }

      } catch (error) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        console.error("Error loading or processing map data:", error as any);
      }
    };
    fetchDataAndDrawMap();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mapWidth, mapHeight, onMapReady, hasMapInitialized]);

  useEffect(() => {
    if (!svgRef.current || !projectionRef.current || !gRef.current || landFeatures.length === 0 || mapWidth === 0 || mapHeight === 0 || !hasMapInitialized) return;
    const g = d3.select(gRef.current);
    const projection = projectionRef.current;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let targetFeatureForFitExtent: any | null = null; 

    let newRotation: [number, number, number] = [0, 0, 0];

    if (selectedCountry) {
      const countryFeature = landFeatures.find(f => f.properties.name === selectedCountry);
      if (countryFeature) {
        targetFeatureForFitExtent = countryFeature;
        const centroid = d3.geoCentroid(countryFeature); 
        newRotation = [-centroid[0], -centroid[1], 0];
      } else { 
        targetFeatureForFitExtent = { type: "Sphere" };
      }
    } else if (selectedContinent && selectedContinent !== "Seven seas (open ocean)") {
      const coords = typedContinentCoordinates[selectedContinent as keyof typeof typedContinentCoordinates];
      if (coords) newRotation = [-coords.longitude, -coords.latitude, 0];
      const continentFeatures = landFeatures.filter(f => f.properties.continent === selectedContinent);
      if (continentFeatures.length > 0) {
        targetFeatureForFitExtent = { type: "FeatureCollection", features: continentFeatures };
      } else { 
        targetFeatureForFitExtent = { type: "Sphere" };
      }
    } else { 
      targetFeatureForFitExtent = { type: "Sphere" };
    }
    
    projection.rotate(newRotation);

    if (targetFeatureForFitExtent) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        projection.fitExtent([[0, 0], [mapWidth, mapHeight]], targetFeatureForFitExtent as any);
    }

    geoPathRef.current = d3.geoPath(projection);

    g.selectAll("path.country")
      .transition()
      .duration(300)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .attr("d", geoPathRef.current! as any); 

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
