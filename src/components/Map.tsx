"use client";
import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { feature, mesh } from 'topojson-client';
import { Topology } from 'topojson-specification';
const Map = () => {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const worldData = await fetch('/world/countries-110m.json');        
        const world: any = await worldData.json();
        const countryMesh = mesh(world, world.objects.countries);
        const land = feature(world, world.objects.countries);
        const geoPath = d3.geoPath();

        if (svgRef.current) {
          const svg = d3.select(svgRef.current);
          svg.selectAll('*').remove();
          const width = 960;
          const height = 600;
          const projection = d3.geoMercator().fitSize([width, height], land);


          svg.append('path')
            .datum(countryMesh)
            .attr('fill', 'none')
            .attr('stroke', 'black')
            .attr('d', (d: any) => geoPath(d) ?? '');
          svg.append('path').datum(land).attr('d', geoPath).attr('fill', 'green').attr('stroke', 'black');
        }

      } catch (error) {
        console.error('Error fetching or processing world data:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="w-full border border-gray-300 rounded-lg">
      <svg ref={svgRef} width="960" height="600" className="bg-white"></svg>
    </div>
  );
};

export default Map;
