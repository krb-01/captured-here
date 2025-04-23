tsx
// src/components/Map.tsx
import { ComposableMap, Geographies, Geography } from "react-simple-maps";
import worldMap from "@/lib/world-110m.json";

const Map = () => {
  return ( <div style={{ width: "800px", height: "400px", overflow: "hidden" }}>
    <ComposableMap>
        <Geographies geography={worldMap}>
            {({ geographies }) =>
                geographies.map((geo) => (
                    <Geography
                        key={geo.rsmKey}
                        geography={geo}
                        style={{
                            default: {
                                fill: "#e0e0e0",
                                outline: "none",
                                stroke: "#808080",
                                strokeWidth: 0.5,
                            },
                            pressed: {
                                outline: "none",
                            },
                        }}
                    />
                ))
            }
        </Geographies>
    </ComposableMap>
</div>
);
};

export default Map;