// ArcGIS JS API (ESM paths)
import Map from "https://js.arcgis.com/4.33/@arcgis/core/Map.js";
import SceneView from "https://js.arcgis.com/4.33/@arcgis/core/views/SceneView.js";
import Graphic from "https://js.arcgis.com/4.33/@arcgis/core/Graphic.js";
import FeatureLayer from "https://js.arcgis.com/4.33/@arcgis/core/layers/FeatureLayer.js";
import ElevationLayer from "https://js.arcgis.com/4.33/@arcgis/core/layers/ElevationLayer.js";
import Search from "https://js.arcgis.com/4.33/@arcgis/core/widgets/Search.js";
import Home from "https://js.arcgis.com/4.33/@arcgis/core/widgets/Home.js";

// 1) Elevation (HTTPS to avoid mixed content)
const elevation = new ElevationLayer({
  url: "https://elevation3d.arcgis.com/arcgis/rest/services/WorldElevation3D/Terrain3D/ImageServer"
});

// 2) Map + 3D ground
const map = new Map({
  basemap: "hybrid",
  ground: { layers: [elevation] }
});

// 3) SceneView with a friendlier starting camera and smoother navigation
const view = new SceneView({
  container: "map",
  map,
  qualityProfile: "high",
  viewingMode: "global",
  camera: {
    position: { x: -105.503, y: 44.27, z: 2.2e7, spatialReference: { wkid: 4326 } },
    heading: 0, tilt: 0
  },
  popup: { dockEnabled: true, dockOptions: { breakpoint: false } },
  environment: { lighting: { directShadowsEnabled: true } },
  constraints: { tilt: { max: 80 } } // allow oblique looks
});

// 4) Convert myStuff -> client-side features
const features = Object.entries(window.myStuff || {}).map(([label, v]) => {
  return new Graphic({
    geometry: { type: "point", x: v.coord[0], y: v.coord[1] },
    attributes: {
      label, city: v.city, state: v.state
    }
  });
});

// 5) Client-side FeatureLayer so we can cluster
const layer = new FeatureLayer({
  title: "My Places",
  source: features,
  fields: [
    { name: "ObjectID", type: "oid" },
    { name: "label", type: "string" },
    { name: "city", type: "string" },
    { name: "state", type: "string" }
  ],
  objectIdField: "ObjectID",
  geometryType: "point",
  // Symbology: 3D icon for better SceneView rendering
  renderer: {
    type: "simple",
    symbol: {
      type: "point-3d",
      symbolLayers: [{
        type: "icon",
        resource: { primitive: "circle" },
        size: 10,
        material: { color: [0, 120, 255, 1] },
        outline: { color: [255, 255, 255, 1], size: 1.5 }
      }]
    }
  },
  popupTemplate: {
    title: "{label}",
    content: `
      <div style="font-size:14px">
        <b>City:</b> {city}<br/>
        <b>State:</b> {state}
      </div>
    `
  },
  // 6) Clustering to handle close points
  featureReduction: {
    type: "cluster",
    clusterRadius: "70px",
    labelingInfo: [{
      deconflictionStrategy: "none",
      labelExpressionInfo: { expression: "Text($feature.cluster_count, '#,###')" },
      symbol: {
        type: "label-3d",
        symbolLayers: [{
          type: "text",
          material: { color: "white" },
          size: 12,
          halo: { color: "black", size: 1.5 }
        }]
      }
    }],
    popupTemplate: {
      title: "Cluster of {cluster_count} places",
      content: "Zoom in or click 'Expand cluster' in the popup to view individual places."
    }
  }
});

map.add(layer);

// 7) Zoom-to on click (individual graphics)
view.popup.autoOpenEnabled = true; // keep popups
view.on("click", async (event) => {
  const response = await view.hitTest(event);
  const hit = response.results.find(r => r.graphic && r.graphic.layer === layer);
  if (hit) {
    const g = hit.graphic;
    await view.goTo({
      target: g.geometry,
      scale: 1500000,
      tilt: 45
    }, { duration: 800, easing: "ease" });
  }
});

// 8) Header select — predefined city search
const citySelect = document.getElementById("citySelect");
const resetBtn = document.getElementById("resetBtn");

// Fill the select with myStuff entries
const entries = Object.entries(window.myStuff || {}); // [ [label, {city,state,coord}], ... ]
const toOptionLabel = ([label, v]) => `${label} — ${v.city}, ${v.state}`;
entries.forEach((entry, idx) => {
  const opt = document.createElement("option");
  opt.value = String(idx);
  opt.textContent = toOptionLabel(entry);
  citySelect.appendChild(opt);
});

// On change, go to that location
citySelect.addEventListener("change", async (e) => {
  const idx = Number(e.target.value);
  if (Number.isFinite(idx)) {
    const v = entries[idx][1];
    await view.goTo({
      target: { type: "point", x: v.coord[0], y: v.coord[1] },
      scale: 1500000,
      tilt: 55
    }, { duration: 800 });
  }
});

// Reset camera
resetBtn.addEventListener("click", async () => {
  await view.goTo({
    position: { x: -105.503, y: 44.27, z: 2.2e7, spatialReference: { wkid: 4326 } },
    heading: 0, tilt: 0
  }, { duration: 700 });
});

// 9) ArcGIS Search widget (bonus)
const search = new Search({ view });
view.ui.add(search, "top-right");

// 10) Home widget to complement the Reset button
const home = new Home({ view });
view.ui.add(home, "top-left");
