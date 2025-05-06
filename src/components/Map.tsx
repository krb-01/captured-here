"use client";
import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import * as topojson from "topojson-client";
import * as d3geo from "d3-geo-projection";
import { feature as topojsonFeature } from "topojson-client";
import { Topology, GeometryCollection } from "topojson-specification";
import { FeatureCollection, Geometry, GeoJsonProperties, Feature } from "geojson";
import { continentCountries } from "@/utils/continentCountries";

interface CountryProperties {
  name: string;
  continent?: string;
}

type CountryFeature = Feature<Geometry, CountryProperties>;
type WorldData = Topology<{ [key: string]: GeometryCollection }>;

interface MapProps {
  selectedCountry: string | null;
  onCountryClick: (country: string | null, continent: string | null) => void;
}

const Map: React.FC<MapProps> = ({ selectedCountry, onCountryClick }) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [currentCountry, setCurrentCountry] = useState<string | null>(null);
  const [landFeatures, setLandFeatures] = useState<CountryFeature[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      if (!svgRef.current) return;

      try {
        const worldData = (await d3.json("/world/countries.json")) as WorldData;

        const land = topojsonFeature(
          worldData,
          worldData.objects.ne_10m_admin_0_countries
        ) as FeatureCollection<Geometry, { name: string }>;

        const featuresWithContinent: CountryFeature[] = land.features.map((feature) => {
          let continent: string = "";
          for (const continentEntry in continentCountries) {
            if (
              continentCountries[continentEntry as keyof typeof continentCountries].includes(
                feature.properties.name
              )
            ) {
              continent = continentEntry;
              break;
            }
          }

          return {
            ...feature,
            properties: {
                ...feature.properties,
              continent: continent,
            },
          };
        });

        setLandFeatures(featuresWithContinent);

        const svg = d3.select(svgRef.current);
        let g = svg.select<SVGGElement>("#map-group");
        if (g.empty()) {
          g = svg.append("g").attr("id", "map-group");
        }

        const width = svgRef.current.clientWidth;
        const height = svgRef.current.clientHeight;
        const projection = d3geo
          .geoMollweide()
          .fitExtent(
            [[0, 0], [width, height]],
            { type: "FeatureCollection", features: featuresWithContinent }
          );

        const geoPath = d3.geoPath(projection);

        g.selectAll<SVGPathElement, CountryFeature>("path.country")
          .data(featuresWithContinent)
          .join("path")
          .attr("class", "country")
          .attr("d", geoPath)
          .attr("fill", (d) =>
            d.properties.name === currentCountry ? "#0E3DF1" : "#212121"
          )
          .on("mouseover", function (event, d) {
            d3.select(this).attr("fill", "#0E3DF1");
          })
          .on("mouseout", function (event, d) {
            d3.select(this).attr(
              "fill",
              d.properties.name === currentCountry ? "#0E3DF1" : "#212121"
            );
          })
          .on("click", function (event, d) {
            const name = d.properties.name || null;
            const continent = d.properties.continent || null;
            setCurrentCountry(name);
            onCountryClick(name, continent);
          })
          .style("stroke", "#000")
          .style("stroke-width", "0.5");
      } catch (error) {
        console.error("Error loading or processing map data:", error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (!selectedCountry || !svgRef.current) return;
    const svg = d3.select(svgRef.current);
    svg.selectAll<SVGPathElement, CountryFeature>("path.country").attr("fill", (d) =>
      d.properties.name === selectedCountry ? "#0E3DF1" : "#212121"
    );
  }, [selectedCountry]);

  return (
    <div className="h-[600px] overflow-hidden">
      <svg ref={svgRef} width="100%" height="100%" />
    </div>
  );
};

export default Map;
