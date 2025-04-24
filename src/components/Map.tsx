"use client";
import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import * as topojson from 'topojson-client';
import { Feature, GeometryCollection, GeoJsonProperties, Point, Geometry, Polygon, LineString, FeatureCollection, Geometry as GeoJSONGeometry, Position } from 'geojson';
import { GeometryObject, Objects, Topology, Positions } from 'topojson-specification';

interface WorldMap extends Topology<Objects<GeoJsonProperties>> {
}

const worldMap: WorldMap = {
    type: "Topology",
    transform: {
        scale: [0.0005780688223651836, 0.0005780688223651836],
        translate: [0, 0],
    },
    objects: {
        land: {
            type: "GeometryCollection",
            geometries: [
                { type: "Polygon", arcs: [[0]] } ,
                { type: "Polygon", arcs: [[1]] } ,
                { type: "Polygon", arcs: [[2]] } ,
                { type: "Polygon", arcs: [[3]] } ,
                { type: "Polygon", arcs: [[4]] } ,
                { type: "Polygon", arcs: [[5]] } ,
                { type: "Polygon", arcs: [[6]] } ,
            ] 
        }
    },
    arcs: [
       [[0, 0], [1, 0], [1, 1], [0, 1], [0, 0]],
       [[0, 0], [1, 0], [1, 1], [0, 1], [0, 0]],
       [[0, 0], [1, 0], [1, 1], [0, 1], [0, 0]],
       [[0, 0], [1, 0], [1, 1], [0, 1], [0, 0]],
       [[0, 0], [1, 0], [1, 1], [0, 1], [0, 0]],
       [[0, 0], [1, 0], [1, 1], [0, 1], [0, 0]],
       [[0, 0], [1, 0], [1, 1], [0, 1], [0, 0]]
    ],
};

const Map = () => {
    const svgRef = useRef<SVGSVGElement>(null);

    useEffect(() => {
        if (svgRef.current) {
            const svg = d3.select(svgRef.current);
            const width = 800;
            const height = 400;
           // Geometryを作成する
           const geometries: Geometry[] = [];
           worldMap.arcs.forEach((arc, index) => {
               geometries.push({
                    type: "Polygon",
                    coordinates: [arc]
                } as Polygon)
           })
           const projection = d3.geoMercator().fitSize([width, height], { type: "GeometryCollection", geometries: geometries } as any);
           const path = d3.geoPath().projection(projection);

           // 新しいFeatureCollectionを作る
           const newFeatureCollection: FeatureCollection = {
               type: "FeatureCollection",
               features: geometries.map((geometry, index) => {
                   return {
                       type: "Feature",
                       geometry: geometry,
                       properties: {}
                   } as Feature
               })
           }
           svg.append('g')
               .selectAll('path')
               .data(newFeatureCollection.features)
               .enter()
               .append('path')
               .attr('d', (d) => path(d as any) || "")
               .style('fill', '#e0e0e0')
               .style('stroke', '#808080')
               .style('stroke-width', 0.5);
        }
    }, []);

    return (
        <div style={{ width: '800px', height: '400px', overflow: 'hidden' }}>
            <svg ref={svgRef} width={800} height={400} />
        </div>
    );
};

export default Map;
