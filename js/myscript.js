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
		// adds dates to the main container
		myData.push(myDates);
		// adds monthly data to the main container
		dataByMonths(rawData, type, myData);
		return myData;
	}

	// destributes data by months
	function dataByMonths(rawData, type, myData) {

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
			months[month - 1].push((obj.value * 1.8 + 32).toFixed(2) || 0);
			
			counter += 1;
			if (counter === 12)  counter = 0;
		});

		for (let x = 0; x < months.length; x ++)
		{
			myData.push(months[x]);
		}
	}

	function showChart(myData) {
		log(myData);
		chart = c3.generate({
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

	//Load Chart -------------------
	function loadChart(begin, end, type) {
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
				showChart(distributeData(response.results, type));
			}
		});
	}
	loadChart('2006-12-31', '2016-12-31', 'TAVG');
}); // main f-n