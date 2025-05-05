"use client";
import React, { useEffect, useRef } from "react";
import * as d3 from 'd3';
import type { FeatureCollection, Feature, Geometry, GeoJsonProperties } from "geojson";
import * as topojson from "topojson-client";
import * as d3geo from "d3-geo-projection";
import type { BaseType } from "d3";

interface CountryProperties {
  name: string;
}

const Map: React.FC<{ 
  selectedCountry: string | null;
  onCountryClick: (country: string) => void;
}> = ({ selectedCountry, onCountryClick }) => { 
  const svgRef = useRef<SVGSVGElement>(null);
  const localOnCountryClick = onCountryClick;
  
  useEffect(() => {
    const fetchData = async () => {
        if (!svgRef.current) return;
      
      try {
        const world: any = await d3.json("/world/countries.json");
        const land = topojson.feature(world, world.objects.ne_10m_admin_0_countries) as any;

        if (svgRef.current && land) {
          const svg = d3.select(svgRef.current);
          let g = svg.select<SVGGElement>("g");

          if (g.empty()) {
            g = svg.append("g").attr('id', 'map-group');
          }

          const width = svgRef.current.clientWidth;
          const height = svgRef.current.clientHeight;
          const projection = d3geo.geoMollweide().fitExtent([[0, 0], [width, height]], land);
          const geoPath = d3.geoPath().projection(projection);
          const path = g.selectAll("path").data(land.features, function(d: any){return d.properties.name}).join("path")


          path
            .attr("d", geoPath as any)
            .attr("stroke", "none")
            .attr("fill", function (d: any) {
                return d.properties.name === selectedCountry ? "#0E3DF1" : "#212121"
            })
            .on("mouseover", function (event: MouseEvent, d: any) {
              d3.select(event.currentTarget as SVGPathElement).attr("fill", "#0E3DF1");
            })
            .on("mouseout", function (event: MouseEvent, d: any) {
              d3.select(this).attr("fill", function(d:any){
                return d.properties.name === selectedCountry ? "#0E3DF1" : "#212121"
            })
            }).on("click", function (this: BaseType | SVGPathElement, event, d: any) {
              if (d) {
                localOnCountryClick(d.properties.name);
              }        });     
        }
      } catch (error) {
        console.error("Error fetching or processing world data:", error);
      }
    };
    
    fetchData();
  }, [selectedCountry, onCountryClick]);

  return (
    <div className="h-[600px] overflow-hidden">
      <svg ref={svgRef} width="100%" height="100%" />
    </div>
  );
}

export default Map;
