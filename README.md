# Assignment 5 — Leaflet/ArcGIS JS Web Map (SceneView + Clustering + Search)

This repo satisfies the Module 6 Assignment 5 requirements:

- **Custom `myStuff` JSON** with your own locations (edit in `obj.js`)
- **SceneView** tweaks (quality, shadows, oblique tilt allowed)
- **Symbology**: 3D point symbols with outline
- **Popup** formatting improvements
- **Zoom-to-on-click** behavior
- **Clustering** for overlapping points (client-side FeatureLayer)
- **City search** via a predefined dropdown **and** ArcGIS **Search** widget (bonus)
- Ready to deploy on **GitHub Pages**

## Run locally (VS Code)
1. Open the folder in VS Code.
2. Install the **Live Server** extension (Ritwick Dey).
3. Right-click `index.html` → **Open with Live Server**.
4. If you see a blank page, check the **Console** for errors (View → Terminal → toggle to Console).

> No API key is required for this demo. All services loaded are public and over HTTPS.

## Edit your data
Open `obj.js` and change the entries. Example:
```js
window.myStuff = {
  "Home Base": { city: "Jackson", state: "Wyoming", coord: [-110.762, 43.479] },
  "Favorite Park": { city: "Moab", state: "Utah", coord: [-109.549, 38.573] }
};
```

## Deploy to GitHub Pages
1. Create a **public** repo (e.g., `assignment5-yourname`).
2. Push these files.
3. In the repo: **Settings → Pages →** set Source to **main** (root) and **Save**.
4. Your site will appear at `https://<username>.github.io/assignment5-yourname/`

## Files
- `index.html` — page + simple toolbar
- `map.js` — app logic (ES modules)
- `obj.js` — your JSON data
- `jquery-1.11.1.min.js` — optional legacy dependency (not required)
