"use client";
import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import * as topojson from 'topojson-client';
import worldMap from '@/lib/world-110m.json';

console.log(worldMap);

const Map = () => {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (svgRef.current) {
      const svg = d3.select(svgRef.current);
      const width = 800;
      const height = 400;

      const projection = d3.geoMercator()
        .fitSize([width, height], topojson.feature(worldMap, worldMap.objects.countries));
      const path = d3.geoPath().projection(projection);

      svg.selectAll('path')
        .data(topojson.feature(worldMap, worldMap.objects.countries).features)
        .join('path')
        .attr('d', path)
        .attr('fill', '#e0e0e0')
        .attr('stroke', '#808080')
        .attr('stroke-width', 0.5);
    }
  }, []);

  return (
    <div style={{ width: '800px', height: '400px', overflow: 'hidden' }}>
      <svg
        ref={svgRef}
        width={800}
        height={400}
      >
      </svg>
    </div>
  );
};

export default Map;