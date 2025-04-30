"use client";
import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import type { FeatureCollection, Geometry, GeoJsonProperties } from "geojson";
import { feature } from "topojson-client";

import * as d3geo from "d3-geo-projection";

interface CountryProperties {
  name: string;
  // 他のプロパティが必要であればここに追加
}

const Map: React.FC<{ selectedCountry: string | null }> = ({ selectedCountry }) => {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const world: any = await d3.json("/world/countries-110m.json");

        const land = feature(world, world.objects.countries) as unknown as FeatureCollection<Geometry, GeoJsonProperties>;
        if (svgRef.current && land) {
          const svg = d3.select(svgRef.current);
          const g = svg.append("g")
          g.selectAll("*").remove();
          const width = svgRef.current.clientWidth;
          const height = svgRef.current.clientHeight;
          const projection = d3geo.geoMollweide().fitSize([width, height], land);
          const geoPath = d3.geoPath().projection(projection);
          g.selectAll("path").data(land.features).enter().append("path")
            .attr("d", (d: any) => geoPath(d))
            .attr("fill", (d: any) => (d.properties.name === selectedCountry ? "red" : "white"))
            .attr("stroke", "black");        
        }


      } catch (error) {
        console.error("Error fetching or processing world data:", error);
      }
    };
    fetchData();
    }, [selectedCountry]);

    return (
      <div className="h-[600px] overflow-hidden">
        <svg ref={svgRef} width="100%" height="100%" className="bg-white" ></svg>
      </div>
    );
};

export default Map;
