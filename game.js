window.onload = init;
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

var gameWidth = gameHeight =  600;

var tileWidth = 25;
var tileHeight = 25;

var tilesInMapX = parseInt(gameWidth / tileWidth);
var tilesInMapY = parseInt(gameHeight / tileHeight);

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
var terrainTypes = ["", "forest", "land", "water", "oil", "coal", "gold", "iron"];
var money = 820000;
var fps = 20;
var b = {
	"buildings":
	[ 
		{
			"empty" :{},
		},
		{
			"name": "city",
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
			"description": "<ul><li><h4>Название:</h4><p>Город</p></li><li><h4>Стоимость:</h4><p>1 450 000</p></li><li><h4>Строится:</h4><p>30 дней</p></li><li><h4>Жилье:</h4><p>+50</p></li></ul>",
			"x": -1,
			"y": -1,
			"opacity": 0.1
		},
		{
			"name": "farm",
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
			"description": "<ul><li><h4>Название:</h4><p>Ферма</p></li><li><h4>Стоимость:</h4><p>19 814</p></li><li><h4>Строится:</h4><p>8 дней</p></li><li><h4>Работает:</h4><p>Весна, лето, осень</p></li><li><h4>Рабочие:</h4><p>5 человек</p></li><li><h4>Потребление:</h4><p>Вода -2</p></li><li><h4>Производит:</h4><p>Еда +32</p></li></ul>",
			"x": -1,
			"y": -1,
			"opacity": 0.1
		},
		{
			"name": "garden",
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
			"description": "<ul><li><h4>Название:</h4><p>Сад</li><li><h4>Стоимость:</h4><p>7640</p></li><li><h4>Строится:</h4><p>20 дней</p></li><li><h4>Работает:</h4><p>Лето, осень</p></li><li><h4>Рабочие:</h4><p>2 человека</p></li><li><h4>Потребление:</h4><p>Вода -1</p></li><li><h4>Производит:</h4><p>Еда +18</p></li></ul>",
			"x": -1,
			"y": -1,
			"opacity": 0.1
		},
		{
			"name": "watercanal",
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
			"description": "<ul><li><h4>Название:</h4><p>Сад</li><li><h4>Стоимость:</h4><p>7640</p></li><li><h4>Строится:</h4><p>20 дней</p></li><li><h4>Работает:</h4><p>Лето, осень</p></li><li><h4>Рабочие:</h4><p>2 человека</p></li><li><h4>Потребление:</h4><p>Вода -1</p></li><li><h4>Производит:</h4><p>Еда +18</p></li></ul>",
			"x": -1,
			"y": -1,
			"opacity": 0.1
		},
		{
			"name": "sawmill",
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
			"name": "mine",
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
			"name": "career",
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
			"name": "oil-production",
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
			"name": "gold-mine",
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
			"name": "electrostation",
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
			"name": "hydrostation",
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
			"name": "road",
			"type": 12,
			"buildTime": 7,
			"buildOn": 0,
			"countHomes": 0,
			"life": 0,
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
			"name": "house",
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
			"name": "hut",
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
			"name": "pier",
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
			"name": "coal-mine",
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
			"name": "hunting-grounds",
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
			"name": "cattle-farm",
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
			"name": "mushroom-farm",
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
			"name": "residential-area",
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
			"name": "household",
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
			"name": "bee-garden",
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
		}
	]
};

var buildings_ = [];
var mapArray;

function getNameResources(arr, sign)
{
	var resName = ["Золото", "Еда", "Уголь", "Железо", "Нефть", "Камень", "Вода", "Дерево", "Электричество"];
	var r = [];
	var s = '';
	arr.forEach(
		function(element, index) 
		{
			if (element != 0)
			r.push(resName[index] + ": " + sign + element);
		}
	); 
	if (r.length == 0) r.push("Ничего");
	return r.join();
}

function getNameSeasons(arr)
{
	var a = arr;
	var b = new Array();
	a.forEach(function(item, i) 
	{ 
		if (item == "winter") b[i] = "Зима"; 
		if (item == "summer") b[i] = "Лето"; 
		if (item == "autumn") b[i] = "Осень"; 
		if (item == "spring") b[i] = "Весна"; 
	});
	
	return b.join();
}

function getDescription(b)
{				
	return "<ul><li><h4>Название:</h4><p>" + b.name + 
	"</p></li><li><h4>Стоимость:</h4><p>" + b.cost + 
	"</p></li><li><h4>Строится:</h4><p>" + b.buildTime + 
	" дней</p></li><li><h4>Работает:</h4><p>" + getNameSeasons(b.workON) + 
	"</p></li><li><h4>Рабочие:</h4><p>" + b.workers + 
	" человек</p></li><li><h4>Потребление:</h4><p>" + getNameResources(b.consumption, "-") + 
	"</p></li><li><h4>Производит:</h4><p>" + getNameResources(b.profit, "+") + 
	" </p></li></ul>";
}

function log( s )
{
	var p = document.createElement('p');
	p.innerHTML = s;
	document.getElementById("events").appendChild(p);
}

function Building (name, type, buildTime, buildOn, countHomes, life, cost, workOn, workers, countWorkers, consumption, profit, x, y) {
    this.name = name;
    this.type = type;
	this.buildTime = buildTime;
	this.buildOn = buildOn;
	this.countHomes = countHomes;
	this.life = life;
	this.cost = cost;
	this.workOn = workOn;
	this.workers = workers;
	this.countWorkers = countWorkers;
	this.consumption = consumption;
	this.profit = profit;
	this.x = x;
	this.y = y;
	this.opacity = 0.1;
	this.status;
}

Building.prototype = {
    checkStatus: function(){

		if (this.status == "build") 
			if (this.buildTime == 0) 
				this.changeStatus("work");
			else
				this.buildTime -=1;
				
		this.life -= 1;
		if (this.life == 0) this.changeStatus("death");
		if (this.life < 90) this.drawFire();
	},
	changeStatus: function ( status ) {
		
		this.status = status;
		this.drawStatus();
		
		if (this.status == "death")
		{
			ctxBuildings.clearRect(this.x * tileWidth, this.y * tileHeight, 25, 25);
			this.x = -1;
			this.y = -1;
		}
		
	},
	work: function()
	{
		if (this.status != "build" && this.status != "death") 
		{
			if (this.workOn.indexOf(currentSeason) == -1)
				{
					this.changeStatus("freeze");
				}
			else
				this.changeStatus("work");
					
			if ( this.countWorkers == 0 && this.status != "freeze")
				if  (noWorkingPeople >= this.workers)
				{
					this.countWorkers = this.workers;
					workingPeople += this.countWorkers;
					noWorkingPeople -= this.countWorkers;
					this.changeStatus("work");
				}
				else
				{
					//log( noWorkingPeople + " " +  this.workers + " " + this.name);
					this.changeStatus("no_people");
				}
				
			
			
	
			if (this.status == "work" || this.status == "no_resource") 
			{
				var temp_res = resources;
				var temp_count = 0;
				for (var i = 0; i < this.consumption.length; i++)
					if (temp_res[i] - this.consumption[i] >= 0)
						temp_count++;
					else
						this.changeStatus("no_resource");	
				
				if (temp_count == this.consumption.length)
					if (this.status == "no_resource")
						this.changeStatus("work");
			}
			
			if (this.status == "work")
			{
				for (var i = 0; i < this.consumption.length; i++)
					if (resources[i] - this.consumption[i] >= 0)
						resources[i] -= this.consumption[i];
				
				for (var i = 0; i < this.profit.length; i++)
					resources[i] += getRandomInt(this.profit[i] * 0.85, this.profit[i] * 1.15);
				
				setResources();
			}
		}
	},
	drawStatus: function() {
		
		if (this.status == "build")
		{
			ctxBuildings.beginPath();
			ctxBuildings.arc( this.x * tileWidth + 20, this.y * tileHeight + 20, 3, 0, 2 * Math.PI, false);
			ctxBuildings.fillStyle = 'yellow';
			ctxBuildings.fill();
			ctxBuildings.lineWidth = 1;
			ctxBuildings.strokeStyle = '#003300';
			ctxBuildings.stroke();
		}
		
		if (this.status == "work")
		{
			ctxBuildings.beginPath();
			ctxBuildings.arc( this.x * tileWidth + 20, this.y * tileHeight + 20, 3, 0, 2 * Math.PI, false);
			ctxBuildings.fillStyle = 'green';
			ctxBuildings.fill();
			ctxBuildings.lineWidth = 1;
			ctxBuildings.strokeStyle = '#003300';
			ctxBuildings.stroke();
		}
		
		if (this.status == "no_resource")
		{
			ctxBuildings.beginPath();
			ctxBuildings.arc( this.x * tileWidth + 20, this.y * tileHeight + 20, 3, 0, 2 * Math.PI, false);
			ctxBuildings.fillStyle = 'red';
			ctxBuildings.fill();
			ctxBuildings.lineWidth = 1;
			ctxBuildings.strokeStyle = '#003300';
			ctxBuildings.stroke();
		}
		
		if (this.status == "no_people")
		{
			ctxBuildings.beginPath();
			ctxBuildings.arc( this.x * tileWidth + 20, this.y * tileHeight + 20, 3, 0, 2 * Math.PI, false);
			ctxBuildings.fillStyle = 'orange';
			ctxBuildings.fill();
			ctxBuildings.lineWidth = 1;
			ctxBuildings.strokeStyle = '#003300';
			ctxBuildings.stroke();
		}
		
		if (this.status == "freeze")
		{
			ctxBuildings.beginPath();
			ctxBuildings.arc( this.x * tileWidth + 20, this.y * tileHeight + 20, 3, 0, 2 * Math.PI, false);
			ctxBuildings.fillStyle = 'blue';
			ctxBuildings.fill();
			ctxBuildings.lineWidth = 1;
			ctxBuildings.strokeStyle = '#003300';
			ctxBuildings.stroke();
		}
		
		if (this.status == "death")
		{
			ctxBuildings.beginPath();
			ctxBuildings.arc( this.x * tileWidth + 20, this.y * tileHeight + 20, 3, 0, 2 * Math.PI, false);
			ctxBuildings.fillStyle = 'black';
			ctxBuildings.fill();
			ctxBuildings.lineWidth = 1;
			ctxBuildings.strokeStyle = '#003300';
			ctxBuildings.stroke();
		}
		
		
		
	},
	drawFire: function()
	{
		/*ctxBuildings.beginPath();
		var Gradient = ctxBuildings.createRadialGradient(this.x + 12, this.y + 12, 1 ,this.x + 12,this.y + 12, 11);
		Gradient.addColorStop(0, "rgba(255, 255, 255, 0)");
		Gradient.addColorStop(1, "rgba(0, 255, 0, 1)");
		ctxBuildings.fillStyle = Gradient;
		ctxBuildings.arc( this.x * tileWidth + 12, this.y * tileWidth  + 12, 12, 0, 2*Math.PI);
		ctxBuildings.fill();
		//ctxBuildings.strokeStyle = '#003300';
		//ctxBuildings.stroke();
		ctxBuildings.closePath();*/
		ctxBuildings.beginPath();
		ctxBuildings.arc( this.x * tileWidth + 12, this.y * tileWidth  + 12, 12, 0, 2*Math.PI);
		ctxBuildings.strokeStyle = 'red';
		ctxBuildings.stroke();
		ctxBuildings.closePath();
	}

	
};

function getRandomInt(min, max) {
  return parseInt(Math.floor(Math.random() * (max - min)) + min);
}

function init()
{
	map = document.getElementById("map");
	ctxMap = map.getContext("2d");
	map.width = gameWidth;
	map.height = gameHeight;
	
	background = document.getElementById("background");
	ctxBackground = background.getContext("2d");
	background.width = gameWidth + 100;
	background.height = gameHeight + 100;
	
	buildings = document.getElementById("buildings");
	ctxBuildings = buildings.getContext("2d");
	buildings.width = gameWidth;
	buildings.height = gameHeight;
	
	cursor = document.getElementById("cursor");
	ctxCursor = cursor.getContext("2d");
	cursor.width = gameWidth;
	cursor.height = gameHeight;
	
	tooltip = document.getElementById("tooltip");
	
	buildings_map = document.getElementById("buildings_map");
	ctxBuildings_map = buildings_map.getContext("2d");
	buildings_map.width = 825;
	buildings_map.height = 25;
	
	offsetMapLeft = map.offsetLeft;
	offsetMapTop = map.offsetTop;
	

	
	drawBorder();
	
	setResources();
	
	getTerrain();
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
	
	buildings_map.addEventListener('mousemove', function(event) {
    var x = event.pageX - offsetMapLeft,
        y = event.pageY - offsetMapTop;

	var X = parseInt(x / 25);
	var Y = parseInt(y / 25);

	tooltip.style.left = event.pageX + "px";
    tooltip.style.top = event.pageY + 40 + "px";
    tooltip.style.position = "absolute";
	tooltip.style.width = "auto";
	tooltip.style.display = "block";
	tooltip.innerHTML = getDescription(b.buildings[X + 1]);
	

	}, false);
	
	buildings_map.addEventListener('mouseleave', function(event) {
		 tooltip.style.display = "none";
	});
	
	window.addEventListener( "keydown", doKeyDown, true);
	
	setInterval(function() {
		setTime();
		update();
	}, 100);

}

function drawBorder()
{
	ctxBackground.beginPath();
	ctxBackground.moveTo(10, 10);
	
	
	for (var i = 0; i < (parseInt(gameWidth / 100)) + 1; i++)
	{
		var j = 0;
		(i % 2 == 0) ? j = 0 : j = 40;
		ctxBackground.quadraticCurveTo((i + 1) * 100 - 50, j, (i + 1) * 100,  10 );
	}
	
	for (var i = 0; i < (parseInt(gameHeight / 100)) + 1; i++)
	{
		var j = 0;
		(i % 2 == 0) ? j = gameHeight + 80 : j = gameHeight + 100;
		
		ctxBackground.quadraticCurveTo(j, (i + 1) * 100 - 50, gameHeight + 90,  (i + 1) * 100 );
	}
	
	for (var i = 0; i < (parseInt(gameWidth / 100))  ; i++)
	{
		var j = 0;
		(i % 2 == 0) ? j = gameHeight + 70 : j = gameHeight + 100;

		ctxBackground.quadraticCurveTo(gameWidth - (i + 1) * 100 + 50, j, gameWidth - (i + 1) * 95,  gameHeight + 80 );
	}
	
	for (var i = 0; i < (parseInt(gameHeight / 100)) - 1; i++)
	{
		var j = 0;
		(i % 2 == 0) ? j = 0 : j = 40;
		
		ctxBackground.quadraticCurveTo(j, gameHeight - (i + 1) * 100 + 50, 10,  gameHeight - (i + 1) * 100 );
	}
	
	//ctxBackground.quadraticCurveTo(150,0,200,10);
	
	ctxBackground.strokeStyle = 'black';
	ctxBackground.closePath();
	ctxBackground.stroke();
	//ctxBackground.fillStyle = "#e6ea93";'
	ctxBackground.fillStyle = "#f6f9c5";
	ctxBackground.fill();
}

function sell(obj)
{
	if (obj.id == "gold")
	{
		money += 1000* parseInt(obj.innerHTML);
		resources[0] = 0;
	}
	
	if (obj.id == "food")
	{
		money += parseInt(obj.innerHTML);
		resources[1] = 0;
	}	
		
	if (obj.id == "coal")
	{
		money += 30 * parseInt(obj.innerHTML);
		resources[2] = 0;
	}
	
	if (obj.id == "iron")
	{
		money += 50 * parseInt(obj.innerHTML);
		resources[3] = 0;
	}

	if (obj.id == "oil")
	{
		money += 45 * parseInt(obj.innerHTML);
		resources[4] = 0;
	}
		
	if (obj.id == "stone")
	{
		money += 4 * parseInt(obj.innerHTML);
		resources[5] = 0;
	}
		
	if (obj.id == "water")
	{
		money += 5 * parseInt(obj.innerHTML);
		resources[6] = 0;
	}
	
	if (obj.id == "wood")
	{
		money += 12 * parseInt(obj.innerHTML);
		resources[7] = 0;
	}
		
	if (obj.id == "electricity")
	{
		money += 35 * parseInt(obj.innerHTML);
		resources[8] = 0;
	}
		
	
}

function setResources()
{
	document.getElementById("gold").innerHTML = resources[0];
	document.getElementById("food").innerHTML = resources[1];
	document.getElementById("coal").innerHTML = resources[2];
	document.getElementById("iron").innerHTML = resources[3];
	document.getElementById("oil").innerHTML = resources[4];
	document.getElementById("stone").innerHTML = resources[5];
	document.getElementById("water").innerHTML = resources[6];
	document.getElementById("wood").innerHTML = resources[7];
	document.getElementById("electricity").innerHTML = resources[8];
	document.getElementById("money").innerHTML = money;
	
	document.getElementById("working").innerHTML = workingPeople;
	document.getElementById("not_working").innerHTML = noWorkingPeople;
	document.getElementById("count_homes").innerHTML = countHomes;
}

function setTime()
{
	//currentTime += 1;
	day += 1;
	if (day == 31) { day = 1; month += 1;}
	if (month == 13) { year += 1; month = 1; }
	
	if (month >= 3 && month <= 5) 
		currentSeason = "spring";
	else
		if (month >= 6 && month <= 8) 
			currentSeason = "summer";
		else
			if (month >= 9 && month <= 11) 
				currentSeason = "autumn";
			else
				currentSeason = "winter";
	
	document.getElementById("time").innerHTML = day + " / " + month + " / " + year + " <br />" + currentSeason;
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
		ctxCursor.clearRect(0, 0, gameWidth, gameHeight);
		ctxCursor.strokeStyle = "#0000ff";
		ctxCursor.strokeRect(x * 25, y * 25, 25, 25);
		selectedX = x;
		selectedY = y;
	}
	
}

function setupBuilding(index)
{
	if 
	(
		(getTerrainType(selectedX, selectedY) == b.buildings[index].buildOn || b.buildings[index].buildOn == 0) && 
		(ifFree(selectedX, selectedY)) &&
		(b.buildings[index].cost < money)
	)
	{

		
		var b_ = b.buildings[index];
		var build = new Building(b_.name, b_.type, b_.buildTime, b_.buildOn, b_.countHomes, b_.life, b_.cost, b_.workON, b_.workers, b_.countWorkers, b_.consumption, b_.profit, selectedX, selectedY);
		
		
		animateFade( build );
		
		
		
		setTimeout(function() { build.changeStatus("build");  buildings_.push(build); money -= b.buildings[index].cost; setResources(); }, 1000);
	}
}

function ifFree(X, Y)
{

	var b = _.chain(buildings_).where({
		x: X,
		y: Y
	}).map(function (obj) {
		return obj.name
	});

	return (b.value().length == 0) ? true : false;
}

function getTerrain()
{
	for (var i = 1; i <= tilesInMapX; i++)
		for (var j = 1; j <= tilesInMapY; j++)
		{
			if (Math.floor(Math.random() * 10) + 1 > 5)
				var type =  Math.floor(Math.random() * 7) + 1;
			else
				var type = 2;
				
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

function animateFade( build )
{
	setTimeout(function() {
			if(build.opacity > 1){ return; } 
			requestAnimationFrame( function() { animateFade( build ); }); 
			ctxBuildings.clearRect(build.x * tileWidth, build.y * tileHeight, 25, 25);
			draw( build );
			build.opacity += 0.1;
	}, 1000 / fps);
}

function draw( build ){
	ctxBuildings.save();
	ctxBuildings.globalAlpha = build.opacity;
	ctxBuildings.drawImage(tiles, (build.type - 1) * tileWidth, tileWidth, tileWidth, tileWidth, build.x * tileWidth, build.y * tileHeight, 25, 25);
	ctxBuildings.restore();
}

function makeEvents()
{
	//if getRandomInt(min, max)
	
	if ( day == 30) 
	{
		var c = getRandomInt(0, 20);
		if (c + noWorkingPeople <= countHomes)
			noWorkingPeople += c;
		else
			noWorkingPeople = countHomes;
		
		log("На остров прибыло " + c + " человек");
	}
	
}

function setCountHomes()
{
	var count = 0;
	buildings_.forEach(
		function(element) 
		{
			if (element.status == "work")
				count += element.countHomes;
		}
	); 
	countHomes = count;
}

function update()
{
	makeEvents();
	setCountHomes();
	buildings_.forEach(
		function(element, index) 
		{
			if (element.status != "death")
			{
				element.checkStatus();
				element.work();
			}

		}
	); 
	
	setResources();


}
