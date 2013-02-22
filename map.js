// this document is in javascript
// however, anything that starts with a $ is a jquery shortcut - it makes things like loading data much easier
// and anything that starts with an L is from leaflet - it handles all the dirty work of displaying maps

var mapbox_username = "brianhouse";
var mapbox_map_id = "124z30te";
var map_tiles_url = "http://a.tiles.mapbox.com/v3/" + mapbox_username + ".map-" + mapbox_map_id + "/{z}/{x}/{y}.png";
var path_to_data = "openpaths_house.json";

var map;
var markers = [];

// this is a javscript comment
// this function creates our map and sets parameters
function initMap () {
    map = new L.map('map', {        // 'map' here refers to the <div> in our HTML
        layers: new L.TileLayer(map_tiles_url),
        center: new L.LatLng(41.819900, -71.400500),
        zoomControl: true,
        attributionControl: false,
        doubleClickZoom: false,
        scrollWheelZoom: false,
        boxZoom: true,
        touchZoom: false,
        dragging: true,
        keyboard: false,
        zoom: 13,
        minZoom: 3,                    
        maxZoom: 17
    });     
    // map.panTo([42.352455, -71.048069]);
    // map.setZoom(17);    
}

// this function loads points from an openpaths file
function loadPoints (start_date, end_date) {
    $.getJSON(path_to_data, function(data) {
        var latlngs = [];
        $.each(data, function(index, location_object) {
            var date = new Date(location_object['t'] * 1000);
            if (date >= start_date && date <= end_date) {
                var latlng = new L.LatLng(location_object['lat'], location_object['lon']);
                latlngs.push(latlng);
                var color = getColor(date);
                var marker = L.circleMarker(latlng, {radius: 5, clickable: false, color: "#000", fillColor: color, fillOpacity: 0.75}).addTo(map);     
                markers.push(marker);
            }
        });
        L.polyline(latlngs, {color: "#0f0", weight: 2, opacity: 0.25}).addTo(map);    
        map.panTo(getCenter());
    });    
}

// this function assigns our colors, by hour
function getColor (date) {
    // brightness is full at noon, none at midnight    
    var hue;
    var h = date.getHours();
    if (h > 18) {   // evening, purple
        hue = 0.77;
    } else if (h > 12) {    // afternoon, red
        hue = 0.0;
    } else if (h > 6) {     // morning, yellow
        hue = 0.1667;
    } else {    // night, blue
        hue = 0.689;
    }
    // var brightness = 1.0 - Math.abs(((date.getHours() / 23) * 2.0) - 1.0);
    var rgb = hsvToRgb(hue, 1.0, 1.0);                
    color = "#" + ("0" + rgb[0].toString(16)).slice(-2) + ("0" + rgb[1].toString(16)).slice(-2) + ("0" + rgb[2].toString(16)).slice(-2)
    return color;
}

// this function finds the center of all points, and pans the map
function getCenter () {
    var lats = 0;
    var lngs = 0;
    for (var i=0; i<markers.length; i++) {
        lats += markers[i].getLatLng().lat;
        lngs += markers[i].getLatLng().lng;
    }
    return new L.LatLng(lats / markers.length, lngs / markers.length);
}

// this code runs after the HTML is loaded
$(document).ready(function() {                   

    var start_date = getDate("2013-02-16 00:00:00");
    var end_date = getDate("2013-02-22 18:10:00");

    loadPoints(start_date, end_date);
    initMap();
    
    // need a color key

});
