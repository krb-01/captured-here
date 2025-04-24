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
        console.log(world.objects)
        const countryMesh = mesh(world, world.objects.countries);        
        const land: any = feature(world, world.objects.land);

        if (svgRef.current) {
          const svg = d3.select(svgRef.current);
          svg.selectAll('*').remove();
          const width = svgRef.current.clientWidth;
          const height = 600;
          const projection = d3.geoMercator().fitSize([width, height], world.objects.land);
          const geoPath = d3.geoPath();

          svg.append('path')
            .datum(countryMesh)
            .attr('fill', 'none')
            .attr('stroke', '#808080')
            .attr('d', (d: any) => geoPath(d) ?? '');

        }
      } catch (error) {
        console.error('Error fetching or processing world data:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="w-full border border-gray-300 rounded-lg">
      <svg ref={svgRef} width="100%" height="600" className="bg-white"></svg>
    </div>
  );
};

export default Map;
