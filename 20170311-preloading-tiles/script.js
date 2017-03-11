var supportedpreloadZoom = [0, 8, 9, 10];

// Map creation
var map = L.map('map', { fullscreenControl: true }).setView([48.850258, 2.351074], 11);

L.tileLayer('//a.tile.openstreetmap.org/{z}/{x}/{y}.png', {
	attribution: '&copy; <a href="//www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

map.on('movestart', mapMoveStart);
map.on('moveend', mapMoved);
mapMoved();
 





function long2tile(lon,zoom) { return (Math.floor((lon+180)/360*Math.pow(2,zoom))); }
function lat2tile(lat,zoom)  { return (Math.floor((1-Math.log(Math.tan(lat*Math.PI/180) + 1/Math.cos(lat*Math.PI/180))/Math.PI)/2 *Math.pow(2,zoom))); }



function mapMoveStart(e) {
}

function mapMoved(e) {
	var zoom = map.getZoom();
	var bounds = map.getBounds();
	var west = bounds.getWest();
	var south = bounds.getSouth();
	var east = bounds.getEast();
	var north = bounds.getNorth();
	
	var preloadZoom = zoom + 1;

	//message
	document.getElementById("msg").innerHTML = 'We are displaying zoom ' + zoom + '. We are preloading data from level ' + preloadZoom;

	// Determine which tile we need
	var dataEast = long2tile(east, preloadZoom);
	var dataWest = long2tile(west, preloadZoom);
	var dataNorth = lat2tile(north, preloadZoom);
	var dataSouth = lat2tile(south, preloadZoom);
	
	var width = (dataEast - dataWest + 1) * 129; // 129 = 128 + border-right 
	document.getElementById("tiles-loaded").innerHTML ='';
	document.getElementById("tiles-loaded").style.lineHeight = '0px';
	document.getElementById("tiles-loaded").style.width = '' + width + 'px';
	for(y = dataNorth; y < dataSouth + 1; y++) {
		for(x = dataWest; x < dataEast + 1; x++) {
			document.getElementById("tiles-loaded").innerHTML += '<img style="width:128px; height:128px; border-right:1px solid blue; border-bottom:1px solid blue;" src="https://a.tile.openstreetmap.org/' + preloadZoom + '/' + x + '/' + y + '.png" />';
		}		
	}
}
