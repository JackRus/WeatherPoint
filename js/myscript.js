const log = console.log;
const token = 'YmGfnzXmuLVrtJtGWICQQxfKMxbOdMAF';

// add events to the form button
$('#show').click( function(){
	// get users zip code
	let value = document.forms.zipform.zipcode.value;
	
	$('#myMap, #myStation, #mySets, #myCategories, #myTypes').hide();
	$('#myTable').show();

	$('#table-body').html('');
	getStationsByZipCode(value);
	
});

// fetches stations for the specified zip code
function getStationsByZipCode(zip) {
	$.ajax({
		url: 'https://www.ncdc.noaa.gov/cdo-web/api/v2/stations',
		data: {
			locationid: 'ZIP:' + zip,
			limit: 20,
			includemetadata: false,
			sortfield: 'name',
			sortorder: 'asc'
		},
		headers: {
			'token': token
		},
		dataType: 'json',
		success: function (response) {
			showStation(response.results);
		}
	});
} // loadLocations

// build the table with the stations names
function showStation(data) {
	$('#table-body').html('');
	data.forEach( function(obj) {
		//$('table').show();
		$('#table-body').append(
			'<tr>' + 
			'<th>' + obj.name + '</th>' +
			'<th>' + obj.mindate + ' : ' +obj.maxdate + '</th>' +
			'<th>' + obj.id + '</th>' +
			'<th class=\"showMap text-center\" data-lon=\"' + 
				obj.longitude + '\" data-lat=\"' + obj.latitude + '\"><span class=\"pointer\" >SHOW ON MAP</span></th>' +
			'<th class=\"selection text-center\" data-id=\"' + 
				obj.id + '\" data-mindate=\"' + obj.mindate + '\" data-maxdate=\"' + obj.maxdate + '\" data-name=\"' + obj.name + '\" data-long=\"' + obj.longitude + '\" data-lat=\"' + obj.latitude + '\"><span class=\"pointer\" >SELECT</span></th>' +
			'</tr>'	
		);
	});

	showMap();

	$('#hidemap').click( function (){
		$('#myMap').hide();
	});

	afterStationSelected();
}

function afterStationSelected () {
	// build table when station selected
	$('.selection').each( function () {
		$(this).click( function() {		
			// 1
			$('#table-body').html('');
			$('#table-body').append(
				'<tr>' + 
				'<th>' + $(this).data('name') + '</th>' +
				'<th>' + $(this).data('mindate') + ' : ' + $(this).data('maxdate') + '</th>' +
				'<th>' + $(this).data('id') + '</th>' +
				'<th class=\"showMap text-center\" data-lon=\"' + 
				$(this).data('long') + '\" data-lat=\"' + $(this).data('lat') + '\"><span class=\"pointer\" >SHOW ON MAP</span></th>' +
				'<th id=\"stationid\" data-id=\"' + $(this).data('id') + '\" class=\"selection text-center\">SELECTED</th>' +
				'</tr>'	
			);

			// 1.1
			showMap();
		
			// 2 
			$('#stationchoice').html('Station');
			
			// 3
			// show data categories for this station 
			getDataSets($(this).data('id'));
		});
	});
}

function showMap() {
	// show map when clicked
	$('.showMap').each( function () {
		$(this).click( function() {
			initMap($(this));
			
			// move center of the page to the map
			$('html,body').animate({
				scrollTop: $('#map').offset().top},
				'slow'
			);
		});
	});
}

function getDataSets(stationID) {
	$.ajax({
		url: 'https://www.ncdc.noaa.gov/cdo-web/api/v2/datasets',
		data: {
			stationid: stationID,
			limit: 500
		},
		headers: {
			'token': token
		},
		dataType: 'json',
		success: function (response) {
			showDataSets(response.results);
		}
	});
}

function showDataSets(data) {
	$('#mySets').show();
	$('#sets-table-body').html('');

	if (data !== undefined){
		data.forEach( obj => {
			$('#sets-table-body').append(
				'<tr>' + 
				'<th>' + obj.id + '</th>' +
				'<th>' + obj.name + '</th>' +
				'<th class=\"setselection text-center\" data-id=\"' + 
					obj.id + '\" data-name=\"' + 
					obj.name + '\"><span class=\"pointer\" >SELECT</span></th>' +
				'</tr>'	
			);
		});
	}
	else {
		$('#sets-table-body').append("<tr><th colspan='10' class='Bro text-center'> NO RECORDS FOUND </th></tr>");
	}
		
	afterSetSelected('TODO');
}

function afterSetSelected () {
	$('.setselection').each ( function () {
		$(this).click( function () {
			
			// 1
			$('#sets-table-body').html('');
			$('#sets-table-body').append(
				'<tr>' + 
				'<th>' + $(this).data('id') + '</th>' +
				'<th>' + $(this).data('name') + '</th>' +
				'<th id=\"setid\" class=\"text-center\" data-id=\"' + 
				$(this).data('id') + '\">SELECTED</th>' +
				'</tr>'	
			);

			// 2 
			$('#setchoice').html('Set');

			getDataCategories($(this).data('id'), $('#stationid').data('id'));
		});
	});
}

function getDataCategories(setID, stationID) {
	$.ajax({
		url: 'https://www.ncdc.noaa.gov/cdo-web/api/v2/datacategories',
		data: {
			datasetid: setID,
			stationID: stationID,
			limit: 500
		},
		headers: {
			'token': token
		},
		dataType: 'json',
		success: function (response) {
			showDataCategories(response.results);
		}
	});
}

function showDataCategories(data) {
	
	$('#myCategories').show();
	$('#categories-table-body').html('');

	if (data !== undefined){
		data.forEach( obj => {
			$('#categories-table-body').append(
				'<tr>' + 
				'<th>' + obj.id + '</th>' +
				'<th>' + obj.name + '</th>' +
				'<th class=\"categoryselection text-center\" data-id=\"' + 
					obj.id + '\" data-name=\"' + 
					obj.name + '\"><span class=\"pointer\" >SELECT</span></th>' +
				'</tr>'	
			);
		});
	}
	else {
		$('#categories-table-body').append("<tr><th colspan='10' class='Bro text-center'> NO RECORDS FOUND </th></tr>");
	}
		
	afterCategorySelected();
}

function afterCategorySelected() {
	$('.categoryselection').each ( function () {
		$(this).click( function () {
			
			// 1
			$('#categories-table-body').html('');
			$('#categories-table-body').append(
				'<tr>' + 
				'<th>' + $(this).data('id') + '</th>' +
				'<th>' + $(this).data('name') + '</th>' +
				'<th class=\"text-center\" data-id=\"' + 
				$(this).data('id') + '\">SELECTED</th>' +
				'</tr>'	
			);

			// 2 
			$('#categorychoice').html('Category');

			getDataTypes($(this).data('id'), $('#setid').data('id'), $('#stationid').data('id'));
		});
	});
}

function getDataTypes(categoryID, setID, stationID) {
	$.ajax({
		url: 'https://www.ncdc.noaa.gov/cdo-web/api/v2/datatypes',
		data: {
			datacategoryid: categoryID,
			datasetid: setID,
			stationid: stationID,
			limit: 500
		},
		headers: {
			'token': token
		},
		dataType: 'json',
		success: function (response) {
			//log(response.results);
			showDataTypes(response.results);
		}
	});
}

function showDataTypes(data) {
	$('#myTypes').show();
	$('#types-table-body').html('');

	data.forEach( obj => {
		$('#types-table-body').append(
			'<tr>' + 
			'<th>' + obj.id + '</th>' +
			'<th>' + obj.name + '</th>' +
			'<th>' + obj.mindate + ' : ' + obj.maxdate +'</th>' +
			'<th class=\"typeselection text-center\" data-id=\"' + 
				obj.id + '\"><span class=\"pointer\" >SELECT</span></th>' +
			'</tr>'	
		);
	});
		
	$('.typeselection').each ( function () {
		$(this).click( function () {
			getData($(this).data('id'), $('#setid').data('id'), $('#stationid').data('id'));
		});
	});
			
}

function getData(typeID, setID, stationID) {
	$.ajax({
		url: 'https://www.ncdc.noaa.gov/cdo-web/api/v2/data',
		data: {
			datasetid: setID,
			stationid: stationID,
			datatypeid: typeID,
			startdate: '2015-01-01',
			enddate: '2015-12-31'
			//limit: 500
		},
		headers: {
			'token': 'YmGfnzXmuLVrtJtGWICQQxfKMxbOdMAF'
		},
		dataType: 'json',
		success: function (response) {
			log(response);
		}
	});
}






// Display the map with the marker
function initMap(obj) { 

	let latitude = $(obj).data('lat'); 
	let longitude = $(obj).data('lon'); 
	let uluru = {lat: latitude, lng: longitude};

	$('#myMap').show();

	let map = new google.maps.Map(document.getElementById('map'), { 	
		zoom: 10,
		center: uluru 
	}); 

	let marker = new google.maps.Marker({
		position: uluru,
		map: map
	});
}

function prepareChart(obj) {
	let id = $(obj).data('id'); 
	let mindate = $(obj).data('mindate');
	let maxdate = $(obj).data('maxdate');
	let name = $(obj).data('name');

	$('#myMap, #myTable').hide();

	$('#myStation')
		.html('')
		.append(
		'<span class=\"bold\">2. Station: </span>' + name + 
		',   <span class=\"bold\">Data available:</span> from ' + mindate + 
		' to: ' + maxdate
		).show();
	
	$('#chartAvg').html('').show();
	let fromDate = (parseInt(maxdate.substring(0, 4)) - 10).toString() + '-12-31';

	//let type = 'TAVG';
	let type = 'TAVG';
	loadChart(fromDate, maxdate, type, '#chartAvg', id);
}
	//loadChart('2012-12-31', '2016-12-31', 'TMAX', '#myC', 'GHCND:USW00092811');

function distributeData(rawData) {
	// chart columns
	let myDates = ['x'];
	rawData.each(function (obj) {
		
		// adding year, "-01-01" is needed for the required format match
		let year = obj.date.substring(0, 4) + '-01-01';
		
		if (!myDates.includes(year)) {
			myDates.push(year);
		}
	});

	// main container
	let myData = [];
	myData.push(myDates);
	dataByMonths(rawData, myData);

	return myData;
}

// destributes data by months
function dataByMonths(rawData, myData) {

	// months's containers
	let months = [['Jan'],['Feb'],['Mar'],['Apr'],['May'],['Jun'],['Jul'],['Aug'],['Sep'],['Oct'],['Nov'],['Dec']];

	// fill the containers with data
	let counter = 0;
	
	rawData.forEach(function (obj) {
		let month = parseInt(obj.date.substring(5, 7));

		// refills missing data with 'null' 
		if ((month - 1) !== (counter % 12)) 
		{
			for (let i = 0; i <= month - counter; i++)
			{
				months[counter].push(null);
				counter++;
			}
		}
		
		// converts Celcius to Farenheit and limits decimal to 2 digits
		months[month - 1].push((obj.value * 1.8 + 32).toFixed(2) || 0);
		counter += 1;
		
		// reset the counter for every 12 months
		if (counter === 12)  counter = 0;
	});

	// add monthly data to the ,ain container
	for (let x = 0; x < months.length; x ++)
	{
		myData.push(months[x]);
	}
}

// Display Chart
function showChart(myData, id) {
	log(myData);
	chart = c3.generate({
		bindto: id,
		data: {
			x: 'x',
			columns: myData,
			names: {}
		},
		axis: {
			x: {
				type: 'timeseries',
				tick: {
					format: '%Y'
				}
			}
		},
		legend: {
			position: 'bottom'
		}
	});
}

//Load Data For The Chart 
function loadChart(begin, end, type, id, stationID) {
	$.ajax({
		url: 'https://www.ncdc.noaa.gov/cdo-web/api/v2/data',
		data: {
			datasetid: 'GSOM',
			datatypeid: type,
			stationid: stationID,
			startdate: begin,
			enddate: end,
			units: 'metric',
			limit: 1000,
			includemetadata: false
		},
		headers: {
			'token': token
		},
		dataType: 'json',
		success: function (response) {
			log(response.results);
			showChart(distributeData(response.results), id);
		},
	});
} // loadchart
