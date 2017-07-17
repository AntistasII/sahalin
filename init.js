var map;
var ctxMap;

var buildings;
var ctxBuildings;

var cursor;
var ctxCursor;

var background;
var ctxBackground;


var buildings_map;
var ctxBuildings_map;


var tooltip;
var ctxTooltip;

var gameWidth = gameHeight =  1000;

var offsetTileX = 0;
var offsetTileY = 0;

var tileWidth = 25;
var tileHeight = 25;

var tilesInMapX = parseInt(gameWidth / tileWidth);
var tilesInMapY = parseInt(gameHeight / tileHeight);
//var tilesInMapX = 600;
//var tilesInMapY = 600;
var info;


var offsetMapLeft = 0;
var offsetMapTop = 0;

var selectedX = -1;
var selectedY = -1;

var requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;
window.requestAnimationFrame = requestAnimationFrame;

//var currentTime = 0;
var day = 1;
var month = 1;
var year = 1000;
var currentSeason = "winter";

var tiles = new Image();
tiles.src = "tiles4.png";

var workingPeople = 0;
var noWorkingPeople = 0;
var countHomes = 0;

var terrain = [];

var buildings_ = [];
var mapArray;

var wrapper;
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
var terrainTypes = ["Любая почва", "Лес", "Земля", "Вода", "Нефть", "Уголь", "Золото", "Железо"];
var money = 820000;
var fps = 20;
var b = {
	"buildings":
	[ 
		{
			"empty" :{},
		},
		{
			"name": "Магистрат",
			"type": 1,
			"buildTime": 30,
			"buildOn": 2,
			"countHomes": 50,
			"life": -1,
			"cost": 1450000,
			"status": "build",
			"workON": ["summer", "autumn", "winter", "spring"],
			"consumption": [0, 0, 0, 0, 0, 0, 0, 0, 0],
			"profit": [0, 0, 0, 0, 0, 0, 0, 0, 0],
			"workers": 0,
			"countWorkers": 0,
			"x": -1,
			"y": -1,
			"opacity": 0.1
		},
		{
			"name": "Ферма",
			"type": 2,
			"buildTime": 8,
			"buildOn": 0,
			"countHomes": 0, 
			"life": 8640, //8640
			"cost": 19814,
			"status": "build",
			"workON": ["summer", "autumn", "winter"],
			"workers": 5,
			"countWorkers": 0,
			"consumption": [0, 0, 0, 0, 0, 0, 2, 0, 0],
			"profit": [0, 32, 0, 0, 0, 0, 0, 0, 0],
			"x": -1,
			"y": -1,
			"opacity": 0.1
		},
		{
			"name": "Сад",
			"type": 3,
			"buildTime": 20,
			"buildOn": 0,
			"countHomes": 0,
			"life": 12960,
			"cost": 7640,
			"status": "build",
			"workON": ["summer", "autumn"],
			"workers": 2,
			"countWorkers": 0,
			"consumption": [0, 0, 0, 0, 0, 0, 1, 0, 0],
			"profit": [0, 18, 0, 0, 0, 0, 0, 0, 0],
			"x": -1,
			"y": -1,
			"opacity": 0.1
		},
		{
			"name": "Водоканал",
			"type": 4,
			"buildTime": 8,
			"buildOn": 3,
			"countHomes": 0,
			"life": 4320,
			"cost": 18310,
			"status": "build",
			"workON": ["summer", "autumn", "spring"],
			"workers": 10,
			"countWorkers": 0,
			"consumption": [0, 0, 0, 0, 0, 0, 0, 0, 0],
			"profit": [0, 0, 0, 0, 0, 0, 7, 0, 0],
			"x": -1,
			"y": -1,
			"opacity": 0.1
		},
		{
			"name": "Лесопилка",
			"type": 5,
			"buildTime": 6,
			"buildOn": 1,
			"countHomes": 0,
			"life": 3650,
			"cost": 17570,
			"status": "build",
			"workON": ["summer", "autumn", "spring", "winter"],
			"workers": 10,
			"countWorkers": 0,
			"consumption": [0, 0, 0, 1, 2, 0, 0, 0, 0],
			"profit": [0, 0, 0, 0, 0, 0, 0, 15, 0],
			"x": -1,
			"y": -1,
			"opacity": 0.1
		},
		{
			"name": "Шахта",
			"type": 6,
			"buildTime": 68,
			"buildOn": 5,
			"countHomes": 0,
			"life": 5760,
			"cost": 25471,
			"status": "build",
			"workON": ["summer", "autumn", "spring", "winter"],
			"workers": 10,
			"countWorkers": 0,
			"consumption": [0, 0, 0, 0, 0, 0, 0, 5, 1],
			"profit": [0, 0, 2, 0, 19, 0, 0, 0, 0],
			"x": -1,
			"y": -1,
			"opacity": 0.1
		},
		{
			"name": "Карьер",
			"type": 7,
			"buildTime": 68,
			"buildOn": 7,
			"countHomes": 0,
			"life": 5040,
			"cost": 25471,
			"status": "build",
			"workON": ["summer", "autumn", "spring"],
			"workers": 10,
			"countWorkers": 0,
			"consumption": [0, 0, 0, 0, 9, 0, 0, 0, 0],
			"profit": [0, 0, 0, 9, 0, 9, 0, 0, 0],
			"x": -1,
			"y": -1,
			"opacity": 0.1
		},
		{
			"name": "Нефтедобыча",
			"type": 8,
			"buildTime": 25,
			"buildOn": 4,
			"countHomes": 0,
			"life": 4320,
			"cost": 82684,
			"status": "build",
			"workON": ["summer"],
			"workers": 10,
			"countWorkers": 0,
			"consumption": [0, 0, 0, 0, 0, 0, 0, 0, 0],
			"profit": [0, 0, 0, 0, 10, 0, 0, 0, 0],
			"x": -1,
			"y": -1,
			"opacity": 0.1
		},
		{
			"name": "Золотая шахта",
			"type": 9,
			"buildTime": 8,
			"buildOn": 6,
			"countHomes": 0,
			"life": 3650,
			"cost": 77000,
			"status": "build",
			"workON": ["summer"],
			"workers": 30,
			"countWorkers": 0,
			"consumption": [0, 0, 0, 0, 0, 0, 200, 0, 0],
			"profit": [2, 0, 0, 0, 0, 70, 0, 0, 0],
			"x": -1,
			"y": -1,
			"opacity": 0.1
		},
		{
			"name": "Электростанция",
			"type": 10,
			"buildTime": 65,
			"buildOn": 0,
			"countHomes": 0,
			"life": 17280,
			"cost": 92433,
			"status": "build",
			"workON": ["summer", "winter", "autumn", "spring"],
			"workers": 5,
			"countWorkers": 0,
			"consumption": [0, 0, 10, 0, 0, 0, 0, 0, 0],
			"profit": [0, 0, 0, 0, 0, 0, 0, 0, 10],
			"x": -1,
			"y": -1,
			"opacity": 0.1
		},
		{
			"name": "Гидроэлектростанция",
			"type": 11,
			"buildTime": 100,
			"buildOn": 3,
			"countHomes": 0,
			"life": 14400,
			"cost": 92214,
			"status": "build",
			"workON": ["summer", "winter", "autumn", "spring"],
			"workers": 5,
			"countWorkers": 0,
			"consumption": [0, 0, 0, 0, 0, 0, 0, 0, 0],
			"profit": [0, 0, 0, 0, 0, 0, 0, 0, 1],
			"x": -1,
			"y": -1,
			"opacity": 0.1
		},
		{
			"name": "Дорога",
			"type": 12,
			"buildTime": 7,
			"buildOn": 0,
			"countHomes": 0,
			"life": 9999999999,
			"cost": 400,
			"status": "build",
			"workON": ["summer", "winter", "autumn", "spring"],
			"workers": 0,
			"countWorkers": 0,
			"consumption": [0, 0, 0, 0, 0, 0, 0, 0, 0],
			"profit": [0, 0, 0, 0, 0, 0, 0, 0, 0],
			"x": -1,
			"y": -1,
			"opacity": 0.1
		},
		{
			"name": "Дом",
			"type": 13,
			"buildTime": 26,
			"buildOn": 2,
			"countHomes": 60,
			"life": 19440,
			"cost": 14038,
			"status": "build",
			"workON": ["summer", "winter", "autumn", "spring"],
			"workers": 0,
			"countWorkers": 0,
			"consumption": [0, 0, 0, 0, 0, 0, 0, 0, 0],
			"profit": [0, 0, 0, 0, 0, 0, 0, 0, 0],
			"x": -1,
			"y": -1,
			"opacity": 0.1
		},
		{
			"name": "Хижина",
			"type": 14,
			"buildTime": 8,
			"buildOn": 3,
			"countHomes": 20,
			"life": 5760,
			"cost": 30202,
			"status": "build",
			"workON": ["summer", "winter", "autumn", "spring"],
			"workers": 0,
			"countWorkers": 0,
			"consumption": [0, 0, 0, 0, 0, 0, 0, 0, 0],
			"profit": [0, 0, 0, 0, 0, 0, 0, 0, 0],
			"x": -1,
			"y": -1,
			"opacity": 0.1
		},
		{
			"name": "Причал",
			"type": 15,
			"buildTime": 18,
			"buildOn": 0,
			"countHomes": 0,
			"life": 5760,
			"cost": 5900,
			"status": "build",
			"workON": ["summer", "winter", "autumn", "spring"],
			"workers": 10,
			"countWorkers": 0,
			"consumption": [0, 0, 0, 0, 0, 0, 0, 2, 0],
			"profit": [0, 60, 0, 0, 0, 0, 0, 0, 0],
			"x": -1,
			"y": -1,
			"opacity": 0.1
		},
		{
			"name": "Угольная шахта",
			"type": 16,
			"buildTime": 12,
			"buildOn": 5,
			"countHomes": 0,
			"life": 15120,
			"cost": 48300,
			"status": "build",
			"workON": ["summer","autumn"],
			"workers": 10,
			"countWorkers": 0,
			"consumption": [0, 0, 0, 0, 10, 0, 0, 0, 0],
			"profit": [0, 0, 15, 0, 0, 19, 0, 0, 0],
			"x": -1,
			"y": -1,
			"opacity": 0.1
		},
		{
			"name": "Охотничьи угодья",
			"type": 17,
			"buildTime": 9,
			"buildOn": 1,
			"countHomes": 0,
			"life": 5040,
			"cost": 16985,
			"status": "build",
			"workON": ["summer", "winter", "autumn", "spring"],
			"workers": 5,
			"countWorkers": 0,
			"consumption": [0, 0, 0, 0, 0, 10, 0, 1, 0],
			"profit": [0, 75, 0, 0, 0, 0, 0, 0, 0],
			"x": -1,
			"y": -1,
			"opacity": 0.1
		},
		{
			"name": "Животноводческая ферма",
			"type": 18,
			"buildTime": 45,
			"buildOn": 0,
			"countHomes": 0,
			"life": 5760,
			"cost": 32002,
			"status": "build",
			"workON": ["summer", "winter", "autumn", "spring"],
			"workers": 10,
			"countWorkers": 0,
			"consumption": [0, 0, 0, 0, 0, 1, 1, 1, 0],
			"profit": [0, 56, 0, 0, 0, 0, 0, 0, 0],
			"x": -1,
			"y": -1,
			"opacity": 0.1
		},
		{
			"name": "Грибная плантация",
			"type": 19,
			"buildTime": 8,
			"buildOn": 1,
			"countHomes": 0,
			"life": 4320,
			"cost": 12164,
			"status": "build",
			"workON": ["autumn"],
			"workers": 5,
			"countWorkers": 0,
			"consumption": [0, 0, 0, 0, 0, 0, 0, 0, 0],
			"profit": [0, 70, 0, 0, 0, 0, 0, 0, 0],
			"x": -1,
			"y": -1,
			"opacity": 0.1
		},
		{
			"name": "Жилой район",
			"type": 20,
			"buildTime": 100,
			"buildOn": 2,
			"countHomes": 200,
			"life": 27360,
			"cost": 66400,
			"status": "build",
			"workON": ["summer", "winter", "autumn", "spring"],
			"workers": 0,
			"countWorkers": 0,
			"consumption": [0, 0, 0, 0, 0, 0, 0, 0, 0],
			"profit": [0, 0, 0, 0, 0, 0, 0, 0, 0],
			"x": -1,
			"y": -1,
			"opacity": 0.1
		},
		{
			"name": "Хозяйство",
			"type": 21,
			"buildTime": 80,
			"buildOn": 2,
			"countHomes": 0,
			"life": 11520,
			"cost": 380385,
			"status": "build",
			"workON": ["summer", "winter", "autumn", "spring"],
			"workers": 70,
			"countWorkers": 0,
			"consumption": [0, 0, 1, 1, 1, 1, 1, 1, 1],
			"profit": [0, 400, 0, 0, 0, 0, 0, 0, 0],
			"x": -1,
			"y": -1,
			"opacity": 0.1
		},
		{
			"name": "Пасека",
			"type": 22,
			"buildTime": 25,
			"buildOn": 0,
			"countHomes": 0,
			"life": 3650,
			"cost": 9385,
			"status": "build",
			"workON": ["summer", "autumn", "spring"],
			"workers": 5,
			"countWorkers": 0,
			"consumption": [0, 0, 0, 0, 0, 0, 0, 1, 0],
			"profit": [0, 36, 0, 0, 0, 0, 0, 0, 0],
			"x": -1,
			"y": -1,
			"opacity": 0.1
		},
		{
			"name": "Факел",
			"type": 23,
			"buildTime": 40,
			"buildOn": 4,
			"countHomes": 0,
			"life": 3650,
			"cost": 215000,
			"status": "build",
			"workON": ["summer", "autumn", "spring", "winter"],
			"workers": 14,
			"countWorkers": 0,
			"consumption": [0, 0, 0, 0, 0, 0, 0, 0, 0],
			"profit": [0, 0, 0, 0, 0, 0, 0, 0, 10],
			"x": -1,
			"y": -1,
			"opacity": 0.1
		},
		{
			"name": "Теплица",
			"type": 24,
			"buildTime": 30,
			"buildOn": 0,
			"countHomes": 0,
			"life": 6480,
			"cost": 16590,
			"status": "build",
			"workON": ["summer", "autumn", "spring", "winter"],
			"workers": 4,
			"countWorkers": 0,
			"consumption": [0, 0, 0, 0, 0, 0, 2, 0, 0],
			"profit": [0, 28, 0, 0, 0, 0, 0, 0, 0],
			"x": -1,
			"y": -1,
			"opacity": 0.1
		},
		{
			"name": "Жилой район",
			"type": 25,
			"buildTime": 320,
			"buildOn": 2,
			"countHomes": 4000,
			"life": 43200,
			"cost": 971000,
			"status": "build",
			"workON": ["summer", "winter", "autumn", "spring"],
			"workers": 0,
			"countWorkers": 0,
			"consumption": [0, 0, 0, 0, 0, 0, 0, 0, 0],
			"profit": [0, 0, 0, 0, 0, 0, 0, 0, 0],
			"x": -1,
			"y": -1,
			"opacity": 0.1
		},
		{
			"name": "Лесоповал",
			"type": 26,
			"buildTime": 20,
			"buildOn": 1,
			"countHomes": 0,
			"life": 3600,
			"cost": 620900,
			"status": "build",
			"workON": ["summer"],
			"workers": 20,
			"countWorkers": 0,
			"consumption": [0, 0, 0, 4, 8, 0, 0, 0, 0],
			"profit": [0, 0, 0, 0, 0, 0, 0, 380, 0],
			"x": -1,
			"y": -1,
			"opacity": 0.1
		},
		{
			"name": "Водокачка",
			"type": 27,
			"buildTime": 66,
			"buildOn": 2,
			"countHomes": 0,
			"life": 25200,
			"cost": 2900177,
			"status": "build",
			"workON": ["summer", "winter", "autumn", "spring"],
			"workers": 2,
			"countWorkers": 0,
			"consumption": [0, 0, 0, 0, 0, 0, 0, 0, 10],
			"profit": [0, 0, 0, 0, 0, 0, 200, 0, 0],
			"x": -1,
			"y": -1,
			"opacity": 0.1
		},
		{
			"name": "Нефтенасос",
			"type": 28,
			"buildTime": 120,
			"buildOn": 4,
			"countHomes": 0,
			"life": 11160,
			"cost": 3999149,
			"status": "build",
			"workON": ["summer"],
			"workers": 100,
			"countWorkers": 0,
			"consumption": [0, 0, 0, 0, 0, 0, 0, 0, 0],
			"profit": [0, 0, 0, 0, 180, 0, 0, 0, 0],
			"x": -1,
			"y": -1,
			"opacity": 0.1
		},
		{
			"name": "Дом матери и ребенка",
			"type": 29,
			"buildTime": 46,
			"buildOn": 2,
			"countHomes": 100,
			"life": 7200,
			"cost": 37115,
			"status": "build",
			"workON": ["summer", "winter", "autumn", "spring"],
			"workers": 0,
			"countWorkers": 0,
			"consumption": [0, 0, 0, 0, 0, 0, 0, 0, 0],
			"profit": [0, 0, 0, 0, 0, 0, 0, 0, 0],
			"x": -1,
			"y": -1,
			"opacity": 0.1
		},
		{
			"name": "Катакомбы",
			"type": 30,
			"buildTime": 30,
			"buildOn": 7,
			"countHomes": 0,
			"life": 10800,
			"cost": 2715002,
			"status": "build",
			"workON": ["summer", "winter", "autumn", "spring"],
			"workers": 30,
			"countWorkers": 0,
			"consumption": [0, 0, 0, 0, 0, 0, 0, 5, 1],
			"profit": [0, 0, 0, 0, 30, 6, 0, 0, 0],
			"x": -1,
			"y": -1,
			"opacity": 0.1
		},
		{
			"name": "Ветряная электростанция",
			"type": 31,
			"buildTime": 12,
			"buildOn": 0,
			"countHomes": 0,
			"life": 6480,
			"cost": 23790,
			"status": "build",
			"workON": ["winter", "autumn"],
			"workers": 1,
			"countWorkers": 0,
			"consumption": [0, 0, 0, 0, 0, 0, 0, 0, 0],
			"profit": [0, 0, 0, 0, 0, 0, 0, 0, 1],
			"x": -1,
			"y": -1,
			"opacity": 0.1
		},
		{
			"name": "Малая АЭС",
			"type": 32,
			"buildTime": 260,
			"buildOn": 3,
			"countHomes": 0,
			"life": 25200,
			"cost": 29000000,
			"status": "build",
			"workON": ["summer", "winter", "autumn", "spring"],
			"workers": 20,
			"countWorkers": 0,
			"consumption": [0, 0, 0, 0, 0, 0, 0, 0, 0],
			"profit": [0, 0, 0, 0, 0, 0, 0, 0, 190],
			"x": -1,
			"y": -1,
			"opacity": 0.1
		},
		{
			"name": "Большая АЭС",
			"type": 33,
			"buildTime": 480,
			"buildOn": 3,
			"countHomes": 0,
			"life": 36000,
			"cost": 120000000,
			"status": "build",
			"workON": ["summer", "winter", "autumn", "spring"],
			"workers": 50,
			"countWorkers": 0,
			"consumption": [0, 0, 0, 0, 0, 0, 0, 0, 0],
			"profit": [0, 0, 0, 0, 0, 0, 0, 0, 620],
			"x": -1,
			"y": -1,
			"opacity": 0.1
		}
	]
};
