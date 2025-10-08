# Week 6 — Web GIS Assignment (ArcGIS JavaScript API)

This repository contains an ArcGIS JS (4.33) web app implementing the Week 6 requirements:
- 3D **SceneView** with world elevation
- Custom **myStuff** object (JSON) with multiple personal places
- Customized **symbology** and **popup** formatting
- **Zoom to point on click**
- **Clustering** for point symbols
- **Predefined-city search** (header dropdown) and ArcGIS **Search** widget (bonus)

## Files
- `index.html` — App shell, header UI, map container. Loads ArcGIS CSS/JS, `obj.js` first, then `map.js`.
- `obj.js` — Your JSON data (`window.myStuff`) with labeled places (city, state, [lon, lat]).
- `map.js` — ArcGIS JS logic (SceneView, FeatureLayer, clustering, zoom-on-click, search).
- `images/` — *(optional)* add any images you want to show in popups.

## How to Run Locally
Use a local web server (for example, VS Code Live Server). Open `index.html`.  
The app will load a 3D globe with your places, clustering, search, and zoom behavior.

## GitHub Pages (Submission)
1. Push this repo to GitHub (public).
2. Enable **GitHub Pages** in repo settings → Pages → Source: `main` branch, root.
3. Submit the **repository link** and the **live URL**.

## Notes
- The elevation service is loaded via **HTTPS** to avoid mixed-content blocking.
- `obj.js` must load **before** `map.js` so `myStuff` is available when the map builds.
- Clustering uses a client-side `FeatureLayer` with `featureReduction: { type: 'cluster' }`.
