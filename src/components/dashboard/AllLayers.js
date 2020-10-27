import React from "react";
import { TileLayer, WMSTileLayer, LayersControl } from "react-leaflet";

const AllLayers = () => {
  return (
    <LayersControl position="bottomright">
      <LayersControl.BaseLayer name="OpenStreetMap.BlackAndWhite">
        <TileLayer
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          url="https://tiles.wmflabs.org/bw-mapnik/{z}/{x}/{y}.png"
        />
      </LayersControl.BaseLayer>
      <LayersControl.BaseLayer name="Sentinel-2">
        <WMSTileLayer
          layers={["Sentinel-2"]}
          url="https://kade.si/cgi-bin/mapserv?"
          format="image/vnd.jpeg-png"
          transparent="true"
          tiled="true"
        />
      </LayersControl.BaseLayer>
      <LayersControl.BaseLayer name="Landsat-8">
        <WMSTileLayer
          layers={["Landsat-8"]}
          url="https://kade.si/cgi-bin/mapserv?"
          format="image/vnd.jpeg-png"
          transparent="true"
          tiled="true"
        />
      </LayersControl.BaseLayer>
      <LayersControl.BaseLayer name="OpenTopoMap">
        <WMSTileLayer url="https:/opentopomap.org/{z}/{x}/{y}.png" />
      </LayersControl.BaseLayer>
      <LayersControl.BaseLayer name="BGtopoVJ-50K">
        <WMSTileLayer
          layers={["BGtopoVJ-raster-v3.00"]}
          url="https://kade.si/cgi-bin/mapserv?"
          format="image/vnd.jpeg-png"
          transparent="true"
          tiled="true"
        />
      </LayersControl.BaseLayer>
      <LayersControl.BaseLayer name="Google Hybrid">
        <WMSTileLayer
          layers={["BGtopoVJ-raster-v3.00"]}
          url="https://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}"
          format="image/vnd.jpeg-png"
          transparent="true"
          tiled="true"
        />
      </LayersControl.BaseLayer>
      <LayersControl.BaseLayer name="BGMountains">
        <WMSTileLayer
          layers={["BGtopoVJ-raster-v3.00"]}
          url="https://bgmtile.kade.si/{z}/{x}/{y}.png"
          format="image/vnd.jpeg-png"
          transparent="true"
          tiled="true"
        />
      </LayersControl.BaseLayer>
      <LayersControl.BaseLayer name="OpenTopoMap">
        <WMSTileLayer
          layers={["BGtopoVJ-raster-v3.00"]}
          url="https:/opentopomap.org/{z}/{x}/{y}.png"
          format="image/vnd.jpeg-png"
          transparent="true"
          tiled="true"
        />
      </LayersControl.BaseLayer>
      {/* <LayersControl.BaseLayer name="OSM HOT">
        <WMSTileLayer
          layers={["BGtopoVJ-raster-v3.00"]}
          url="https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png"
          format="image/vnd.jpeg-png"
          transparent="true"
          tiled="true"
        />
      </LayersControl.BaseLayer> */}
      <LayersControl.BaseLayer name="CYCLE MAP">
        <WMSTileLayer
          layers={["BGtopoVJ-raster-v3.00"]}
          url="https://dev.{s}.tile.openstreetmap.fr/cyclosm/{z}/{x}/{y}.png"
          format="image/vnd.jpeg-png"
          transparent="true"
          tiled="true"
        />
      </LayersControl.BaseLayer>
      <LayersControl.BaseLayer name="Test Request to Sentinel Hub API returning NDVI filter">
        {/* link to manage filter by given criteria
          https://apps.sentinel-hub.com/sentinel-playground/?baseWmsUrl=services.sentinel-hub.com&instanceID=bb1c8a2f-5b11-42bb-8ce4-dbf7f5300663&source=S2&lat=10.001310360636941&lng=4.998779296875&zoom=9&preset=NDVI&layers=B01,B02,B03&maxcc=20&gain=1.0&gamma=1.0&time=2020-04-01%7C2020-10-08&atmFilter=&showDates=false */}

        <WMSTileLayer
          layers="NDVI"
          format="image/jpeg"
          attribution='&copy; <a href="http://www.sentinel-hub.com/" target="_blank">Sentinel Hub</a>'
          url="https://services.sentinel-hub.com/ogc/wms/5fbea5fa-d1e4-4d92-b262-d4fc2c853f81"
          urlProcessingApi="https://services.sentinel-hub.com/ogc/wms/aeafc74a-c894-440b-a85b-964c7b26e471"
          maxcc="20"
          minZoom="6"
          maxZoom="16"
          preset="NDVI"
          time="2020-04-01/2020-10-08"
        />
      </LayersControl.BaseLayer>
      <LayersControl.BaseLayer name="Test Request  Sentinel Hub API for some other layer">
        {/* documentation readed
        https://www.sentinel-hub.com/develop/api/ogc/ogc-examples/ */}
        <WMSTileLayer
          layers="TRUE_COLOR"
          format="image/jpeg"
          transparent="true"
          tiled="true"
          url="http://services.sentinel-hub.com/ogc/wms/5fbea5fa-d1e4-4d92-b262-d4fc2c853f81?REQUEST=GetMap&BBOX=3238005,5039853,3244050,5045897&LAYERS=TRUE_COLOR&MAXCC=20&WIDTH=320&HEIGHT=320&FORMAT=image/jpeg&TIME=2018-03-29/2018-05-29"
        />
      </LayersControl.BaseLayer>
      <LayersControl.BaseLayer name="Test Request to Sentinel Hub API returning image of polygon">
        {/* Add layer over drawed polygon
      https://forum.sentinel-hub.com/t/extract-an-aoi-from-a-ndvi-wms/589/16 */}
        <WMSTileLayer
          layers="MOISTURE_INDEX"
          format="image/jpeg"
          attribution='&copy; <a href="http://www.sentinel-hub.com/" target="_blank">Sentinel Hub</a>'
          url="https://services.sentinel-hub.com/ogc/wms/5fbea5fa-d1e4-4d92-b262-d4fc2c853f81"
          urlProcessingApi="https://services.sentinel-hub.com/ogc/wms/aeafc74a-c894-440b-a85b-964c7b26e471"
          maxcc="20"
          minZoom="6"
          maxZoom="16"
          preset="MOISTURE_INDEX"
          time="2020-04-01/2020-10-11 "
        />
      </LayersControl.BaseLayer>
    </LayersControl>
  );
};

export default AllLayers;
