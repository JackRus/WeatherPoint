$(function () {
	'use strict';

	const log = console.log;
	let chart, monthsArray = [];

	function distributeData(rawData, type) {

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
		dataByMonths(rawData, type, myData);

		return myData;
	}

	// destributes data by months
	function dataByMonths(rawData, type, myData) {

		// months's containers
		let months = [
			['01'],
			['02'],
			['03'],
			['04'],
			['05'],
			['06'],
			['07'],
			['08'],
			['09'],
			['10'],
			['11'],
			['12']
		];

		// fill the containers with data
		let counter = 0;
		rawData.forEach(function (obj) {
			let month = parseInt(obj.date.substring(5, 7));

			// refills missing data
			if ((month - 1) !== (counter % 12)) 
			{
				for (let i = 0; i <= month - counter; i++)
				{
					months[counter].push(0);
					counter++;
				}
			}
			
			// converts Celcius toFarenheit and limits decimal to 2 digits
			months[month - 1].push((obj.value * 1.8 + 32).toFixed(2) || 0);
			counter += 1;
			
			// reset the counter for every 12 months
			if (counter === 12)  counter = 0;
		});

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
	function loadChart(begin, end, type, id) 
	{
		$.ajax({
			url: 'https://www.ncdc.noaa.gov/cdo-web/api/v2/data',
			data: {
				datasetid: 'GSOM',
				datatypeid: 'TAVG',
				stationid: 'GHCND:USW00092811',
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
				showChart(distributeData(response.results, type), id);
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
				'token': ''
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
			log(obj);
			$('table').show();
			$('#table-body').append(
				'<tr>' + 
				'<th>' + obj.name + '</th>' +
				'<th>' + obj.mindate + ' : ' +obj.maxdate + '</th>' +
				'</tr>');
		});
	}

	// add onclick to the button 'show'
	document.getElementById('show').addEventListener('click', function(){
		let value = document.forms.zipform.zipcode.value;
		loadLocationByZipCode(value);
	});

	// params: [from date], [to date], [type]
	// type: [TAVG], [TMAX], [TMIN]
	//loadChart('2006-12-31', '2016-12-31', 'TAVG', '#chart');

	//loadChart('2012-12-31', '2016-12-31', 'TMAX', '#myC');
	//loadLocationByZipCode(33139);
}); // main f-n
