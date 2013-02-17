var map;
var markers = [];

function initMap () {
    console.log("initMap");
    map = new L.map('map', {
        layers: new L.TileLayer('http://a.tiles.mapbox.com/v3/brianhouse.map-124z30te/{z}/{x}/{y}.png'),
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

function loadPoints (start_time, end_time) {
    console.log("loadPoints");
    $.getJSON("openpaths_house.json", function(data) {
        $.each(data, function(index, location_object) {
            var location = [location_object['lat'], location_object['lon']];
            var time = location_object['t'];
            var size = 5;
            var color = "#000";
            if (time >= start_time && time <= end_time) {
                var marker = L.circleMarker(location, {radius: 5, clickable: false, color: color}).addTo(map);     
                markers.push(marker);
            }
        });
        map.panTo(getCenter());
    });    
}

function getCenter () {
    console.log("getCenter");
    var lats = 0;
    var lngs = 0;
    for (var i=0; i < markers.length; i++) {
        lats += markers[i].getLatLng().lat;
        lngs += markers[i].getLatLng().lng;
    }
    return new L.LatLng(lats / markers.length, lngs / markers.length);
}

function getTimestamp (str) {
  var d = str.match(/\d+/g); // extract date parts
  return (+new Date(d[0], d[1] - 1, d[2], d[3], d[4], d[5])) / 1000; // build Date object
}

$(document).ready(function() {                   

    var start_time = getTimestamp("2013-02-16 00:00:00");
    var end_time = getTimestamp("2013-02-22 18:10:00");

    loadPoints(start_time, end_time);
    initMap();
    

    // recreate morning, evening, night views from openpaths data
    // connect the points with a line
    // follow them                

});
