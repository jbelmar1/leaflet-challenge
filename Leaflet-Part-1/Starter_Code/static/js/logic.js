// PART 1

// queryURL
let queryUrl = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson';


// Get request to the query URL
d3.json(queryUrl).then(function(earthquakeData) {
    console.log(earthquakeData);
    createFeatures(earthquakeData.features);
});

//Markers
function createMarker(feature, latlng) {
    return L.circleMarker(latlng, {
        radius: markerSize(feature.properties.mag),
        fillColor: markerColor(feature.geometry.coordinates[2]),
        color:"black",
        fillOpacity: 1,
        weight: 0.5,
        opacity: 0.45,
        stroke: true
    });
}

function createFeatures(earthquakeData) {
    function onEachFeature(feature, layer){
        layer.bindPopup(`<h3>Location: ${feature.properties.place}</h3><hr><p>Date: ${new Date(feature.properties.time)}
        </p><hr><p>Magnitude: ${feature.properties.mag}</p><hr><p>Reports Felt: ${feature.properties.felt}`);
    }

    let earthquakes = L.geoJSON(earthquakeData, {
        onEachFeature: onEachFeature,
        pointToLayer: createMarker
    });

    createMap(earthquakes);
}

function createMap(earthquakes) {
    let street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      });

    let myMap = L.map("map", {
        center: [37.09, -95.71],
        zoom: 6,
        layers: [street, earthquakes]
    });

    L.control.layers(baseMaps, overlayMaps, {
        collapsed: false
    }).addTo(myMap); 
    
    let legend = L.control({position: 'bottomright'});

    legend.onAdd = function (myMap) {
        let div = L.DomUtil.create('div', 'info legend'),
            depth = [-10, 10, 30, 60, 90],
            labels = [],
            legendInfo = "<h5>Magnitude</h5>";

        for (let i = 0; i < depth.length; i++) {
            div.innerHTML +=
                '<i style="background:' + markerColor(depth[i] + 1) + '"></i> ' +
                depth[i] + (depth[i + 1] ? '&ndash;' + depth[i + 1] + '<br>' : '+');
        }    

        return div;

        };

        legend.addTo(myMap);
}
function markerSize(magnitude) {
    return magnitude * 5;
}

function markerColor(depth){
    switch(true) {
        case depth > 90:
          return "red";
        case depth > 70:
          return "orangered";
        case depth > 50:
          return "orange";
        case depth > 30:
          return "yellow";
        case depth > 10:
          return "greenyellow";
        default:
          return "green";
      }
    }                        