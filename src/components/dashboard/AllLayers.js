import React from 'react';
import {
    TileLayer,
    WMSTileLayer,
    LayersControl,
  } from "react-leaflet";

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
        <LayersControl.BaseLayer name="OSM HOT">
          <WMSTileLayer
            layers={["BGtopoVJ-raster-v3.00"]}
            url="https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png"
            format="image/vnd.jpeg-png"
            transparent="true"
            tiled="true"
          />
        </LayersControl.BaseLayer>
        <LayersControl.BaseLayer name="CYCLE MAP">
          <WMSTileLayer
            layers={["BGtopoVJ-raster-v3.00"]}
            url="https://dev.{s}.tile.openstreetmap.fr/cyclosm/{z}/{x}/{y}.png"
            format="image/vnd.jpeg-png"
            transparent="true"
            tiled="true"
          />
        </LayersControl.BaseLayer>
      </LayersControl>
    );
};

export default AllLayers;