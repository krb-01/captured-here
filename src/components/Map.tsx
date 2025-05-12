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
}

const Map: React.FC<MapProps> = ({ selectedCountry, selectedContinent, onCountryClick }) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [landFeatures, setLandFeatures] = useState<CountryFeature[]>([]);
  const projectionRef = useRef<d3.GeoProjection | null>(null);
  const geoPathRef = useRef<d3.GeoPath | null>(null);
  const gRef = useRef<SVGGElement | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!svgRef.current) return;
      try {
        const worldData = (await d3.json("/world/countries.json")) as WorldData;
        const land = topojsonFeature(
          worldData,
          worldData.objects.ne_10m_admin_0_countries 
        ) as FeatureCollection<Geometry, GeoJsonProperties>; 

        const featuresWithContinent: CountryFeature[] = land.features
          .map((feature) => {
            const countryName = feature.properties?.NAME || feature.properties?.name || feature.properties?.ADMIN;
            if (!countryName || typeof countryName !== 'string') {
                return null; 
            }
            let continent: string = "";
            for (const continentEntry in continentCountries) {
              if (continentCountries[continentEntry as keyof typeof continentCountries].includes(countryName)) {
                continent = continentEntry;
                break;
              }
            }
            const properties: CountryProperties = {
                ...(feature.properties as GeoJsonProperties), 
                name: countryName, 
                continent: continent,
            };
            return {
              ...feature,
              properties: properties,
            } as CountryFeature; 
          })
          .filter((feature): feature is CountryFeature => feature !== null);
        setLandFeatures(featuresWithContinent);

        const svg = d3.select(svgRef.current);
        const width = svgRef.current.clientWidth;
        const height = svgRef.current.clientHeight;
        projectionRef.current = d3geo.geoMollweide(); 
        let g = svg.select<SVGGElement>("#map-group");
        if (g.empty()) {
          gRef.current = svg.append("g").attr("id", "map-group").node();
        } else {
          gRef.current = g.node();
        }
        if (!gRef.current || featuresWithContinent.length === 0) return;
        if (projectionRef.current && svgRef.current) { 
            projectionRef.current.fitExtent([[0, 0], [width, height]], { type: "FeatureCollection", features: featuresWithContinent } as any);
            geoPathRef.current = d3.geoPath(projectionRef.current); 
        }
        if (!geoPathRef.current) return; 

        d3.select(gRef.current)
          .selectAll<SVGPathElement, CountryFeature>("path.country")
          .data(featuresWithContinent, (d) => d.properties.name) 
          .join(
            enter => enter.append("path")
              .attr("class", "country")
              .attr("d", geoPathRef.current as any)
              .attr("fill", "#212121") 
              .on("mouseover", function (event, d) {
                if (d.properties.name !== selectedCountry) {
                  d3.select(this).attr("fill", "#0E3DF1");
                }
              })
              .on("mouseout", function (event, d) {
                d3.select(this).attr("fill", d.properties.name === selectedCountry ? "#0E3DF1" : "#212121");
              })
              .on("click", function (event, d) {
                const name = d.properties.name; 
                const continent = d.properties.continent; 
                if (name && name !== "Unknown") {
                  onCountryClick(name, continent || null); 
                } else {
                  onCountryClick(null, null); 
                }
              })
              .style("stroke", "#fff")
              .style("stroke-width", "0.3"),
            update => update.attr("d", geoPathRef.current as any),
            exit => exit.remove()
          );
      } catch (error) {
        console.error("Error loading or processing map data:", error);
      }
    };
    fetchData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); 

  useEffect(() => {
    if (!svgRef.current || !projectionRef.current || !gRef.current || landFeatures.length === 0) {
      return;
    }
    const g = d3.select(gRef.current);
    const width = svgRef.current.clientWidth;
    const height = svgRef.current.clientHeight;
    const projection = projectionRef.current;
    let targetFeatureForFitExtent: Feature<Geometry, CountryProperties> | FeatureCollection<Geometry, CountryProperties> | null = null;
    let newRotation: [number, number, number] = [0, 0, 0]; 

    if (selectedCountry) { // Handles Antarctica when selected as a "country"
      const countryFeature = landFeatures.find(f => f.properties.name === selectedCountry);
      if (countryFeature) {
        targetFeatureForFitExtent = countryFeature; 
        const centroid = d3.geoCentroid(countryFeature);
        newRotation = [-centroid[0], -centroid[1], 0];
      } else { 
        targetFeatureForFitExtent = { type: "FeatureCollection", features: landFeatures } as FeatureCollection<Geometry, CountryProperties>;
      }
    } else if (selectedContinent && selectedContinent !== "Seven seas (open ocean)") {
      // Note: Antarctica as a continent (when selectedCountry is null) is now handled by page.tsx setting selectedCountry="Antarctica"
      // So this branch will mostly handle other continents.
      const coords = typedContinentCoordinates[selectedContinent as keyof typeof typedContinentCoordinates];
      if (coords) { 
        newRotation = [-coords.longitude, -coords.latitude, 0];
      }
      const continentFeatures = landFeatures.filter(f => f.properties.continent === selectedContinent);
      if (continentFeatures.length > 0) {
        targetFeatureForFitExtent = { type: "FeatureCollection", features: continentFeatures } as FeatureCollection<Geometry, CountryProperties>;
      } else { 
        targetFeatureForFitExtent = { type: "FeatureCollection", features: landFeatures } as FeatureCollection<Geometry, CountryProperties>;
      }
    } else { // No specific selection or unhandled continent like "Seven seas"
      targetFeatureForFitExtent = { type: "FeatureCollection", features: landFeatures } as FeatureCollection<Geometry, CountryProperties>;
    }
    
    projection.rotate(newRotation); 
    
    if (targetFeatureForFitExtent) {
        projection.fitExtent([[0, 0], [width, height]], targetFeatureForFitExtent as any);
    }
    
    geoPathRef.current = d3.geoPath(projection);

    g.selectAll("path.country")
      .transition()
      .duration(300)
      //.ease(d3.easeElasticOut) // イージング関数を指定
      .attr("d", geoPathRef.current as any);

  }, [selectedCountry, selectedContinent, landFeatures]); 

  useEffect(() => {
    if (!gRef.current) return;
    d3.select(gRef.current)
      .selectAll<SVGPathElement, CountryFeature>("path.country")
      .attr("fill", (d) => {
        if (d.properties.name === selectedCountry) { // This covers Antarctica if selectedCountry is "Antarctica"
          return "#0E3DF1";
        }
        return "#212121";
      })
      .on("mouseout", function (event, d) { 
        d3.select(this).attr("fill", d.properties.name === selectedCountry ? "#0E3DF1" : "#212121");
      });
  }, [selectedCountry]); 

  return (
    <div className="h-[600px] overflow-hidden"> 
      <svg ref={svgRef} width="100%" height="100%" />
    </div>
  );
};

export default Map;
