window.onload = init;
var map;
var ctxMap;

var buildings;
var ctxBuildings;

var cursor;
var ctxCursor;


var buildings_map;
var ctxBuildings_map;

var drawBtn;
var clearBtn;

var gameWidth = 500;
var gameHeight = 500;

var tileWidth = 25;
var tileHeight = 25;

var tilesInMapX = 20;
var tilesInMapY = 20;

var offsetMapLeft = 0;
var offsetMapTop = 0;

var selectedX = -1;
var selectedY = -1;


var background = new Image();
background.src = "map2.png";

var tiles = new Image();
tiles.src = "tiles.png";

var terrainTypes = ["", "forest", "land", "water", "oil", "coal", "gold", "iron"];
var terrain = [];

var buildingTypes = [
	"", 
	"city", 
	"farm", 
	"garden", 
	"watercanal", 
	"sawmill", 
	"mine", 
	"career",
	"oil-production",
	"gold-mine", 
	"electrostation",
	"hydrostation", 
	"road",
	"home", 
	"hut", 
	"pier", 
	"coal-mine", 
	"hunting-grounds", 
	"cattle-farm", 
	"mushroom-farm",
	"residential-area", 
	"household", 
	"bee-garden", 
	"torch", 
	"greenhouse", 
	"residential-center", 
	"felling",
	"water-pump", 
	"oil-pump", 
	"maternity-hospital", 
	"catacombs", 
	"wind-power-plant", 
	"small-NPP", 
	"big-NPP"
];
//gold, food, coal, iron, oil, stone, water, wood, electicity
var resources = [0, 0, 0, 0, 0, 0, 0, 0, 0];

var b = {
	"buildings":
	[ 
		{
			"empty" :{},
		},
		{
			"name": "city",
			"buildTime": 360,
			"buildOn": 2,
			"countHomes": 50,
			"life": -1,
			"cost": 1450000,
			"status": "build",
			"workON": [],
			"workers": 0,
			"countWorkers": 0,
			"x": -1,
			"y": -1
		},
		{
			"name": "farm",
			"buildTime": 38,
			"buildOn": 0,
			"countHomes": 0,
			"life": 8640,
			"cost": 19814,
			"status": "build",
			"workON": ["summer", "autumn", "winter"],
			"workers": 5,
			"countWorkers": 0,
			"consumption": [0, 0, 0, 0, 0, 0, 2, 0, 0],
			"profit": [0, 32, 0, 0, 0, 0, 2, 0, 0],
			"x": -1,
			"y": -1
		}
	]
};




var buildings_ = [];




var mapArray;

function init()
{
	map = document.getElementById("map");
	ctxMap = map.getContext("2d");
	map.width = gameWidth;
	map.height = gameHeight;
	
	buildings = document.getElementById("buildings");
	ctxBuildings = buildings.getContext("2d");
	buildings.width = gameWidth;
	buildings.height = gameHeight;
	
	cursor = document.getElementById("cursor");
	ctxCursor = cursor.getContext("2d");
	cursor.width = gameWidth;
	cursor.height = gameHeight;
	
	buildings_map = document.getElementById("buildings_map");
	ctxBuildings_map = buildings_map.getContext("2d");
	buildings_map.width = 825;
	buildings_map.height = 25;
	
	
	
	offsetMapLeft = map.offsetLeft;
	offsetMapTop = map.offsetTop;
	
	drawBtn = document.getElementById("drawBtn");
	clearBtn = document.getElementById("clearBtn");
	
	drawBtn.addEventListener("click", drawRect, false);
	clearBtn.addEventListener("click", clearRect, false);
	
	getTerrain();
	drawBg();
	drawTerrain();
	drawBuildingsMap();
	
	// Add event listener for `click` events.
	cursor.addEventListener('click', function(event) {
    var x = event.pageX - offsetMapLeft,
        y = event.pageY - offsetMapTop;

	selectedX = parseInt(x / 25);
	selectedY = parseInt(y / 25);

	selectTile(selectedX, selectedY);
	}, false);
	
	buildings_map.addEventListener('click', function(event) {
    var x = event.pageX - offsetMapLeft,
        y = event.pageY - offsetMapTop;

	var X = parseInt(x / 25);
	var Y = parseInt(y / 25);

	//console.log(buildingTypes[X + 1] + " " + X);
	setupBuilding(X + 1);
	
	}, false);
	
	window.addEventListener( "keydown", doKeyDown, true);
	
	

}

function doKeyDown(e) {


if ( e.keyCode == 87 ||  e.keyCode == 38  ) {
	selectTile(selectedX, selectedY - 1);
}

if ( e.keyCode == 83 || e.keyCode == 40  ) {
	selectTile(selectedX, selectedY + 1);
}

if ( e.keyCode == 65 || e.keyCode == 37  ) {
	selectTile(selectedX - 1, selectedY);
}

if ( e.keyCode == 68 || e.keyCode == 39  ) {
	selectTile(selectedX + 1, selectedY);
}

}

function drawRect()
{
	drawBg();
	drawTerrain();
}

function getTerrainType(X, Y)
{
	var selectedTerrainType = _.chain(terrain).where({
		x: X,
		y: Y
	})
	.map(function (obj) {
		return obj.type
	});
	
	return selectedTerrainType.value()[0];
}

function selectTile(x, y)
{
	if ((x >= 0) && (x < tilesInMapX) && (y >= 0) && (y < tilesInMapY))
	{
		ctxCursor.clearRect(0, 0, 500, 500);
		ctxCursor.strokeStyle = "#0000ff";
		ctxCursor.strokeRect(x * 25, y * 25, 25, 25);
		selectedX = x;
		selectedY = y;
	}
	
}

function setupBuilding(index)
{
	var build = b.buildings[index];
	if (getTerrainType(selectedX, selectedY) == build.buildOn)
	{
		ctxBuildings.drawImage(tiles, (index - 1) * tileWidth, tileWidth, tileWidth, tileWidth, selectedX * tileWidth, selectedY * tileHeight, 25, 25);	
		
		build.x = selectedX;
		build.y = selectedY;
		buildings_.push(build);
		console.log(buildings_);
	}
}

function getTerrain()
{
	for (var i = 1; i <= tilesInMapX; i++)
		for (var j = 1; j <= tilesInMapY; j++)
		{
			var type =  Math.floor(Math.random() * 7) + 1;
			var obj = {x: i - 1, y: j - 1, type: type};
			terrain.push(obj);
		}
}

function drawBuildingsMap()
{
	for (var i = 1; i <= buildingTypes.length; i++)
		{
			ctxBuildings_map.drawImage(tiles, (i - 1) * tileWidth, tileWidth, tileWidth, tileWidth, (i - 1) * tileWidth, 0, tileWidth, tileWidth);
		}
}

function drawTerrain()
{
	for (var i = 1; i <= tilesInMapX; i++)
		for (var j = 1; j <= tilesInMapY; j++)
		{
			var type = getTerrainType(i - 1, j - 1);
			ctxMap.drawImage(tiles, (type - 1) * 25, 0, 25, 25, (i - 1) * tileWidth, (j - 1) * tileHeight, 25, 25);	
		}
			
}

function clearRect()
{
	ctxMap.clearRect(0, 0, 500, 500);
}

function drawBg()
{
	ctxMap.drawImage(background, 0, 0, 500, 500, 
	0, 0, gameWidth, gameHeight);
}