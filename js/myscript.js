$(function () {
	'use strict';

	const log = console.log;

	function distributeData(rawData) {

		// chart columns
		let myDates = ['x'];
		rawData.forEach(function (obj) {
			
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
	function loadChart(begin, end, type, id, stationID) 
	{
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
				'token': 'YmGfnzXmuLVrtJtGWICQQxfKMxbOdMAF'
			},
			dataType: 'json',
			success: function (response) {
				log(response.results);
				showChart(distributeData(response.results), id);
			},
			statusCode: {
				400: function() {
				  $('#myC').html('400: BAD REQUEST. PLEASE, TRY AGAIN');
				},
				500: function() {
					$('#myC').html('500: BAD REQUEST. PLEASE, TRY AGAIN');
				}
			}

		});
	} // loadchart

	// fetches stations for the specified zip code
	function loadLocationByZipCode(zip) 
	{
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
				'token': 'YmGfnzXmuLVrtJtGWICQQxfKMxbOdMAF'
			},
			dataType: 'json',
			success: function (response) {
				selectStation(response.results);
			}
		});
	} // loadLocations

	// build the table with the stations names
	function selectStation(data) {
		log(data);
		$('#table-body').html('');
		data.forEach( function(obj) {
			//log(obj);
			$('table').show();
			$('#table-body').append(
				'<tr>' + 
				'<th>' + obj.name + '</th>' +
				'<th>' + obj.mindate + ' : ' +obj.maxdate + '</th>' +
				'<th>' + obj.id + '</th>' +
				'<th class=\"showMap text-center\" data-lon=\"' + 
					obj.longitude + '\" data-lat=\"' + obj.latitude + '\"><span class=\"pointer\" >SHOW ON MAP</span></th>' +
				'<th class=\"selection text-center\" data-id=\"' + 
					obj.id + '\" data-mindate=\"' + obj.mindate + '\" data-maxdate=\"' + obj.maxdate + '\" data-name=\"' + obj.name + '\"><span class=\"pointer\" >SELECT</span></th>' +
				'</tr>'	
			);
		});

		$('.showMap').each( function () {
			$(this).click( function() {
				initMap($(this));
			});
		});

		$('.selection').each( function () {
			$(this).click( function() {
				prepareChart($(this));
			});
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

	// add events to the form button
	$('#show').click( function(){
		// get users zip code
		let value = document.forms.zipform.zipcode.value;
		
		$('#table-body').html('');
		loadLocationByZipCode(value);
		
		$('#myMap, #myStation, #chartAvg').hide();
		$('#myTable').show();
	});

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
		// params: [from date], [to date], [type]
		// type: [TAVG], [TMAX], [TMIN]
		let fromDate = (parseInt(maxdate.substring(0, 4)) - 10).toString() + '-12-31';

		//let type = 'TAVG';
		let type = 'TAVG';
		loadChart(fromDate, maxdate, type, '#chartAvg', id);
	}

	//loadChart('2012-12-31', '2016-12-31', 'TMAX', '#myC', 'GHCND:USW00092811');
});

// $(function () {
// 	function loadChart() {
// 		$.ajax({
// 			url: 'https://www.ncdc.noaa.gov/cdo-web/api/v2/datatypes',
// 			data: {
// 				//datasetid: 'PRECIP_HLY',
// 				//datatypeid: type,
// 				stationid: "NEXRAD:KAMX",
// 				//startdate: begin,
// 				//enddate: end,
// 				//units: 'metric',
// 				limit: 1000,
// 				includemetadata: false
// 			},
// 			headers: {
// 				'token': 'YmGfnzXmuLVrtJtGWICQQxfKMxbOdMAF'
// 			},
// 			dataType: 'json',
// 			success: function (response) {
// 				console.log(response);
// 				printAll( response.results );
				
// 				//showChart(distributeData(response.results, type), id);
// 			},
// 		});
// 	} // loadchart

// 	function printAll(data) {

// 		data.forEach(function (obj) {
			
// 			let value = obj.name;
// 			let key = obj.id;
			
// 			$('#myC').append('<div>\'' + key + '\' : \'' + value + '\',</div>');
// 		});
// 	}

// 	loadChart();
// });