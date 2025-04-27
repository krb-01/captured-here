"use client";
import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { feature } from 'topojson-client';
import * as d3geo from 'd3-geo-projection';

const Map: React.FC = () => {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const worldData = await fetch('/world/countries-110m.json');
        const world: any = await worldData.json();
        const land = feature(world, world.objects.countries);

        if (svgRef.current) {
          const svg = d3.select(svgRef.current);
          svg.selectAll('*').remove();
          const width = svgRef.current.clientWidth;
          const height = svgRef.current.clientHeight;
          const projection = d3geo.geoMollweide().fitSize([width, height], land);
          const geoPath = d3.geoPath().projection(projection);
        
          svg.append('path')
            .datum(land)
            .attr('fill', 'none')
            .attr('stroke', 'black')
            .attr('d', (d: any) => geoPath(d) ?? '');
        }
      } catch (error) {
        console.error('Error fetching or processing world data:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="h-[600px]">
      <svg ref={svgRef} width="100%" height="100%" className="bg-white"></svg>
    </div>
  );
};

export default Map;
