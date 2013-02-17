var map;
var current_location_marker;
var hotspots = [];

function initMap () {
    map = new L.map('map', {
        layers: new L.TileLayer('http://a.tiles.mapbox.com/v3/brianhouse.map-124z30te/{z}/{x}/{y}.png'),
        center: new L.LatLng(42.352455, -71.048069),
        zoomControl: false,
        attributionControl: false,
        doubleClickZoom: false,
        scrollWheelZoom: false,
        boxZoom: false,
        touchZoom: false,
        dragging: false,
        keyboard: false,
        zoom: 13,
        minZoom: 10,                    
        maxZoom: 17
    });     
    // map.panTo([42.352455, -71.048069]);
    // map.setZoom(17);    
}

// function loadMarkers () {
//     $.getJSON("markers.json", function(data) {
//         var items = [];
//         $.each(data, function(index, o) {
//             createHotspot(o['latlng'], o['radius'], o['color'], o['content']);
//         });
//     });    
// }

$(document).ready(function() {                   

    // loadMarkers();
    initMap();

    // recreate morning, evening, night views from openpaths data
    // connect the points with a line
    // follow them                

});
