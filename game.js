window.onload = init;


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
	" дней на " + terrainTypes[b.buildOn] + "</p></li><li><h4>Работает:</h4><p>" + getNameSeasons(b.workON) + 
	"</p></li><li><h4>Рабочие:</h4><p>" + b.workers + 
	" человек</p></li><li><h4>Дает проживание:</h4><p>" + b.countHomes +  
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
		
		if (this.status != "build")
			this.life -= 1;
		
		if (this.life == 0) this.changeStatus("death");
		if (this.life < 90 && this.status == "work" && this.life > 0) this.drawFire();
	},
	changeStatus: function ( status ) {
		
		this.status = status;
		this.drawStatus();
		
		if (this.status == "death")
		{
			ctxBuildings.clearRect(this.x * tileWidth, this.y * tileHeight, 25, 25);
			this.x = -1;
			this.y = -1;
			workingPeople -= this.countWorkers;
			noWorkingPeople += this.countWorkers;
			this.countWorkers = 0;
			this.workers = 0;
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
	map.style.left = 0;
	map.style.top = 0;
	
	background = document.getElementById("background");
	ctxBackground = background.getContext("2d");
	background.width = gameWidth + 100;
	background.height = gameHeight + 100;
	background.style.left = "-50px";
	background.style.top = "-50px";
	background.style.position = "absolute";
	
	
	buildings = document.getElementById("buildings");
	ctxBuildings = buildings.getContext("2d");
	buildings.width = gameWidth;
	buildings.height = gameHeight;
	buildings.style.left = 0;
	buildings.style.top = 0;
	
	cursor = document.getElementById("cursor");
	ctxCursor = cursor.getContext("2d");
	cursor.width = gameWidth;
	cursor.height = gameHeight;
	cursor.style.left = 0;
	cursor.style.top = 0;
	
	tooltip = document.getElementById("tooltip");
	
	buildings_map = document.getElementById("buildings_map");
	ctxBuildings_map = buildings_map.getContext("2d");
	buildings_map.width = 825;
	buildings_map.height = 25;
	
	
	wrapper = document.getElementById('wrapper');  
	info = document.getElementById('info-text');  
	
	offsetMapLeft = wrapper.offsetLeft;
	offsetMapTop = wrapper.offsetTop;
	
	
	
	drawBorder();
	setResources();
	getTerrain();
	drawTerrain();
	drawBuildingsMap();
	
	
	wrapper.addEventListener('click', function(event) {
	
		// Add event listener for `click` events.
		//cursor.addEventListener('click', function(event) {
		
	
	    var x = event.pageX - offsetMapLeft,
	        y = event.pageY - offsetMapTop;
			
		//console.log(event.pageX + " " + event.pageY + " " + offsetMapLeft + " " + offsetMapTop);
	
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

function getInfo(x, y)
{
	var s = "Почва: " + terrainTypes[getTerrainType(x, y)];
	var b = buildingInfo(x, y);

	if (ifFree(x, y))
		s += " Строений нет";
	else
		s += " Дней до уничтожения:"  + b[0].life + " Статус: " + b[0].status;
	
	return s;
}

function selectTile(x, y)
{
	x -= offsetTileX;
	y -= offsetTileY;
	//console.log(x + " xy " + y + " " + offsetTileX + " " + offsetTileY);
	if ((x >= 0) && (x < tilesInMapX) && (y >= 0) && (y < tilesInMapY))
	{
		ctxCursor.clearRect(0, 0, gameWidth, gameHeight);
		ctxCursor.strokeStyle = "#0000ff";
		ctxCursor.strokeRect(x * 25, y * 25, 25, 25);
		selectedX = x;
		selectedY = y;
		info.innerHTML = getInfo(x, y);
	}
	//console.log(selectedX + " " + selectedY + " ");
	
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
if ( e.keyCode == 83 || e.keyCode == 40  ) {

	//selectTile(selectedX, selectedY - 1);
	offsetTileY += -1;
	map.style.top =  ( parseInt(map.style.top) - tileHeight) + "px";
	cursor.style.top =  ( parseInt(cursor.style.top) - tileHeight) + "px";
	buildings.style.top =  ( parseInt(buildings.style.top) - tileHeight) + "px";
	background.style.top =  ( parseInt(background.style.top) - tileHeight) + "px";
}

if ( e.keyCode == 87 ||  e.keyCode == 38  ) {
	//selectTile(selectedX, selectedY + 1);
	offsetTileY += 1;
	map.style.top =  (parseInt(map.style.top) + tileHeight) + "px";
	cursor.style.top =  (parseInt(cursor.style.top) + tileHeight) + "px";
	buildings.style.top =  (parseInt(buildings.style.top) + tileHeight) + "px";
	background.style.top =  (parseInt(background.style.top) + tileHeight) + "px";
}
if ( e.keyCode == 68 || e.keyCode == 39  ) {

	//selectTile(selectedX - 1, selectedY);
	offsetTileX += -1;
	map.style.left =  (parseInt(map.style.left) - tileWidth) + "px";
	cursor.style.left =  (parseInt(cursor.style.left) - tileWidth) + "px";
	buildings.style.left =  (parseInt(buildings.style.left) - tileWidth) + "px";
	background.style.left =  (parseInt(background.style.left) - tileWidth) + "px";
}

if ( e.keyCode == 65 || e.keyCode == 37  ) {
	//selectTile(selectedX + 1, selectedY);
	offsetTileX += 1;
	map.style.left =  (parseInt(map.style.left) + tileWidth) + "px";
	cursor.style.left =  (parseInt(cursor.style.left) + tileWidth) + "px";
	buildings.style.left =  (parseInt(buildings.style.left) + tileWidth) + "px";
	background.style.left =  (parseInt(background.style.left) + tileWidth) + "px";
}

//console.log(background.style.left + " offset " + offsetTileY);

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

function buildingInfo(X, Y)
{
	var b = _.chain(buildings_).where({
		x: X,
		y: Y
	}).map(function (obj) {
		return obj
	});

	return b.value();

}

function getTerrain()
{
	for (var i = 1; i <= tilesInMapX; i++)
		for (var j = 1; j <= tilesInMapY; j++)
		{
			if (Math.floor(Math.random() * 10) + 1 > 7)
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
		if ( (c + noWorkingPeople) <= (countHomes - workingPeople))
			noWorkingPeople += c;
		else
			noWorkingPeople = (countHomes - workingPeople);
		
		log("На остров прибыло " + c + " человек");
	}
	
	if (getRandomInt(0, 1000) > 990)
	{
		var l = buildings_.length;
		var b = getRandomInt(0, l);
		if (buildings_[b].status != "build" && buildings_[b].status != "death")
		{
			var damage = getRandomInt(0, buildings_[b].life);
			if (buildings_[b].countWorkers > 0)
			{
				workingPeople -= buildings_[b].countWorkers;
				buildings_[b].countWorkers = 0;
			}
			
			
			buildings_[b].life -= damage;
			log("В здании " + buildings_[b].name + " взорвалась какая-то хрень. Все работники умерли. Здание получило урон: " + damage);
		}
		
	}
	
	if (getRandomInt(0, 1000) > 980)
	{
		var l = buildings_.length;
		var b = getRandomInt(0, l);
		var s = '';
		var resName = ["Золото", "Еда", "Уголь", "Железо", "Нефть", "Камень", "Вода", "Дерево", "Электричество"];
		if (buildings_[b].status == "work")
		{
			buildings_[b].profit.forEach(
				function(element, index) 
				{
					if (element != 0)
						{
							var res = getRandomInt(element * 20, element * 30);
							resources[index] += res;
							s += resName[index] + ": +" + res;
						}
				}
			); 
			if (s != '')
				log("В здании " + buildings_[b].name + " случилось нечто неожиоданное. " + s);
		}
			
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
