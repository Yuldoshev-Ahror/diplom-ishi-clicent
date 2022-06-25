import React from "react";
import {
  YMaps,
  Map,
  ZoomControl,
  Clusterer,
  Placemark
} from "react-yandex-maps";

export default function BranchMap({ mapState, branches, setBranchInfo }) {
  return (
    <div className="branch_map">
      <YMaps>
        <Map
          width="100%"
          height="100vh"
          state={mapState}
          instanceRef={(ref) => {
            ref && ref.behaviors.disable("scrollZoom");
          }}
        >
          <Clusterer
            options={{
              preset: "islands#invertedDarkBlueClusterIcons",
              groupByCoordinates: false,
            }}
          >
            {branches.map((branch, i) => (
              <Placemark properties={{ hintContent: branch.name }}
                modules={["geoObject.addon.hint"]} onClick={() => { setBranchInfo(branch) }}
                options={{ iconColor: "#f5363e" }} key={i} options={{ iconColor: "#f5363e" }} geometry={[branch.location.lat, branch.location.long]} />
            ))}

          </Clusterer>
          <ZoomControl
            options={{
              size: "auto",
              zoomDuration: 200,
            }}
          />
        </Map>
      </YMaps>
    </div>
  );
}
