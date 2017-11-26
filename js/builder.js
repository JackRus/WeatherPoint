// data type change
const log = console.log;
let type, container;

$('#type').change( function() {
	
	// create container
	$('#main').html('').append("<div id=\'container\'></div>");

	type = this.value;
	container = $('#container');
	
	// update endPoint string
	$('#display').text('http://localhost:5000/api/' + type);
	
	// fill the container with the blocks/form
	typeSelected();
});

// stores current values for the endPoint parameters
let storage = {
	stations: {
		'order': '',
		'from': '',
		'to': '',
		'sortby': '',
		'datasetid': '',
		'limit': '',
		'offset': '',
		'locationid': '',
		'datatypeid': '',
		'datacategoryid': ''
	},
	data: {
		'datatypeid': '',
		'order': '',
		'from': '',
		'to': '',
		'sortby': '',
		'datasetid': '',
		'limit': '',
		'offset': '',
		'units': '',
		'metadata': '',
		'locationid': '',
		'stationid': '',
		'groupby': ''
	},
	locations: {
		'order': '',
		'from': '',
		'to': '',
		'sortby': '',
		'limit': '',
		'offset': '',
		'locationcategoryid': '',
		'datasetid': '',
		'datacategoryid': ''
	},
	datasets: {
		'order': '',
		'from': '',
		'to': '',
		'sortby': '',
		'limit': '',
		'offset': '',
		'locationid': '',
		'datatypeid': '',
		'stationid': ''
	},
	datacategories: {
		'order': '',
		'from': '',
		'to': '',
		'sortby': '',
		'limit': '',
		'offset': '',
		'locationid': '',
		'datatypeid': '',
		'stationid': ''
	},
	datatypes: {
		'order': '',
		'from': '',
		'to': '',
		'sortby': '',
		'limit': '',
		'offset': '',
		'locationid': '',
		'datasetid': '',
		'stationid': '',
		'datacategoryid': ''
	},
	locationcategories: {
		'order': '',
		'from': '',
		'to': '',
		'sortby': '',
		'limit': '',
		'offset': '',
		'datasetid': ''
	}
};

// COLLECTIONS
let datasetid = [
	{
		"uid": "gov.noaa.ncdc:C00861",
		"mindate": "1763-01-01",
		"maxdate": "2017-11-21",
		"name": "Daily Summaries",
		"datacoverage": 1,
		"id": "GHCND"
	},
	{
		"uid": "gov.noaa.ncdc:C00946",
		"mindate": "1763-01-01",
		"maxdate": "2017-10-01",
		"name": "Global Summary of the Month",
		"datacoverage": 1,
		"id": "GSOM"
	},
	{
		"uid": "gov.noaa.ncdc:C00947",
		"mindate": "1763-01-01",
		"maxdate": "2017-01-01",
		"name": "Global Summary of the Year",
		"datacoverage": 1,
		"id": "GSOY"
	},
	{
		"uid": "gov.noaa.ncdc:C00345",
		"mindate": "1991-06-05",
		"maxdate": "2017-11-23",
		"name": "Weather Radar (Level II)",
		"datacoverage": 0.95,
		"id": "NEXRAD2"
	},
	{
		"uid": "gov.noaa.ncdc:C00708",
		"mindate": "1994-05-20",
		"maxdate": "2017-11-20",
		"name": "Weather Radar (Level III)",
		"datacoverage": 0.95,
		"id": "NEXRAD3"
	},
	{
		"uid": "gov.noaa.ncdc:C00821",
		"mindate": "2010-01-01",
		"maxdate": "2010-01-01",
		"name": "Normals Annual/Seasonal",
		"datacoverage": 1,
		"id": "NORMAL_ANN"
	},
	{
		"uid": "gov.noaa.ncdc:C00823",
		"mindate": "2010-01-01",
		"maxdate": "2010-12-31",
		"name": "Normals Daily",
		"datacoverage": 1,
		"id": "NORMAL_DLY"
	},
	{
		"uid": "gov.noaa.ncdc:C00824",
		"mindate": "2010-01-01",
		"maxdate": "2010-12-31",
		"name": "Normals Hourly",
		"datacoverage": 1,
		"id": "NORMAL_HLY"
	},
	{
		"uid": "gov.noaa.ncdc:C00822",
		"mindate": "2010-01-01",
		"maxdate": "2010-12-01",
		"name": "Normals Monthly",
		"datacoverage": 1,
		"id": "NORMAL_MLY"
	},
	{
		"uid": "gov.noaa.ncdc:C00505",
		"mindate": "1970-05-12",
		"maxdate": "2014-01-01",
		"name": "Precipitation 15 Minute",
		"datacoverage": 0.25,
		"id": "PRECIP_15"
	},
	{
		"uid": "gov.noaa.ncdc:C00313",
		"mindate": "1900-01-01",
		"maxdate": "2014-01-01",
		"name": "Precipitation Hourly",
		"datacoverage": 1,
		"id": "PRECIP_HLY"
	}
];

let datacategoriesid = [
	{
		"name": "Annual Agricultural",
		"id": "ANNAGR"
	},
	{
		"name": "Annual Degree Days",
		"id": "ANNDD"
	},
	{
		"name": "Annual Precipitation",
		"id": "ANNPRCP"
	},
	{
		"name": "Annual Temperature",
		"id": "ANNTEMP"
	},
	{
		"name": "Autumn Agricultural",
		"id": "AUAGR"
	},
	{
		"name": "Autumn Degree Days",
		"id": "AUDD"
	},
	{
		"name": "Autumn Precipitation",
		"id": "AUPRCP"
	},
	{
		"name": "Autumn Temperature",
		"id": "AUTEMP"
	},
	{
		"name": "Computed",
		"id": "COMP"
	},
	{
		"name": "Computed Agricultural",
		"id": "COMPAGR"
	},
	{
		"name": "Degree Days",
		"id": "DD"
	},
	{
		"name": "Dual-Pol Moments",
		"id": "DUALPOLMOMENT"
	},
	{
		"name": "Echo Tops",
		"id": "ECHOTOP"
	},
	{
		"name": "Evaporation",
		"id": "EVAP"
	},
	{
		"name": "Hydrometeor Type",
		"id": "HYDROMETEOR"
	},
	{
		"name": "Land",
		"id": "LAND"
	},
	{
		"name": "Miscellany",
		"id": "MISC"
	},
	{
		"name": "Other",
		"id": "OTHER"
	},
	{
		"name": "Overlay",
		"id": "OVERLAY"
	},
	{
		"name": "Precipitation",
		"id": "PRCP"
	},
	{
		"name": "Pressure",
		"id": "PRES"
	},
	{
		"name": "Reflectivity",
		"id": "REFLECTIVITY"
	},
	{
		"name": "Sky cover & clouds",
		"id": "SKY"
	},
	{
		"name": "Spring Agricultural",
		"id": "SPAGR"
	},
	{
		"name": "Spring Degree Days",
		"id": "SPDD"
	},
	{
		"name": "Spring Precipitation",
		"id": "SPPRCP"
	},
	{
		"name": "Spring Temperature",
		"id": "SPTEMP"
	},
	{
		"name": "Summer Agricultural",
		"id": "SUAGR"
	},
	{
		"name": "Summer Degree Days",
		"id": "SUDD"
	},
	{
		"name": "Sunshine",
		"id": "SUN"
	},
	{
		"name": "Summer Precipitation",
		"id": "SUPRCP"
	},
	{
		"name": "Summer Temperature",
		"id": "SUTEMP"
	},
	{
		"name": "Air Temperature",
		"id": "TEMP"
	},
	{
		"name": "Velocity",
		"id": "VELOCITY"
	},
	{
		"name": "Vertical Integrated Liquid",
		"id": "VERTINTLIQUID"
	},
	{
		"name": "Water",
		"id": "WATER"
	},
	{
		"name": "Winter Agricultural",
		"id": "WIAGR"
	},
	{
		"name": "Winter Degree Days",
		"id": "WIDD"
	},
	{
		"name": "Wind",
		"id": "WIND"
	},
	{
		"name": "Winter Precipitation",
		"id": "WIPRCP"
	},
	{
		"name": "Winter Temperature",
		"id": "WITEMP"
	}
];

let locationcategories =  [
	{
		"name": "City",
		"id": "CITY"
	},
	{
		"name": "Climate Division",
		"id": "CLIM_DIV"
	},
	{
		"name": "Climate Region",
		"id": "CLIM_REG"
	},
	{
		"name": "Country",
		"id": "CNTRY"
	},
	{
		"name": "County",
		"id": "CNTY"
	},
	{
		"name": "Hydrologic Accounting Unit",
		"id": "HYD_ACC"
	},
	{
		"name": "Hydrologic Cataloging Unit",
		"id": "HYD_CAT"
	},
	{
		"name": "Hydrologic Region",
		"id": "HYD_REG"
	},
	{
		"name": "Hydrologic Subregion",
		"id": "HYD_SUB"
	},
	{
		"name": "State",
		"id": "ST"
	},
	{
		"name": "US Territory",
		"id": "US_TERR"
	},
	{
		"name": "Zip Code",
		"id": "ZIP"
	}
];

// check if the field is added to the endPoint string
function isAdded (field) {
	return $('#display').text().indexOf(field) < 0 ? false : true;
}

// checks if endPoint ends with '?' or '&'
function checkUrl() {
	let endPoint = $('#display').html();
	if (endPoint.indexOf('?') < 0) {
		endPoint += '?';
	}
	let lastChar = endPoint.substring(endPoint.length - 1);
	endPoint += lastChar !== ('&' && '?') ? '&' : '';
	return endPoint;
}

// checks if endPoint ends with '?' or '&'
function removeTail() {
	
	// decode '&' back to js
	let endPoint = $('#display').html().replace(/&amp;/g, '&');
	let lastChar = endPoint.substring(endPoint.length - 1);

	if (lastChar === '?' || lastChar === '&') {	
		endPoint = endPoint.substring(0, endPoint.length - 1);
	}
	// remove unnecessary simbols
	$('#display').html(endPoint.replace('?&', '?').replace('&&', '&'));
}

// appends endPoint with the given pair name:parameter
function appendEndPoint(value) {
	if (value !== '' && value !== null) { 
		$('#display').html(checkUrl() + value);
	}
}

// updates old pair name:parameter to a new one
function updateData(oldValue, newValue){
	$('#display').html( $('#display').html().replace(oldValue, newValue) );
}

// Stations EndPoint
function typeSelected() {

	buildForm();

	// buttons handler
	$('.block-btn').click( function() {
		
		let value, valueType = ' ', data;
		let element = $(this).closest('label').children(0);
		let name = element.data('name');
		let oldValue = storage[type][name];

		if ($(this).data('multi') === 'yes'){
			valueType = element.val();
			value = $(this).closest('label').find('input').val();
			data = "<span class=\"endpoint\">" + name + "</span>=" + valueType + ":" + value;
		}
		else {
			value = element.val();
			data = "<span class=\"endpoint\">" + name + "</span>=" + value;
		} 

		if ((value && valueType) !== ('' && null)){
			// add if it isn't added
			if (!isAdded(name)) {
				appendEndPoint(data);
			}
			// if endPoint contains this parameter, update value
			
			else {
				if (oldValue !== data) {
					updateData(oldValue, data);
				}
			}

			// update dictionary with the new value
			storage[type][name] = data;
		}
		else {
			updateData(oldValue, '');
			removeTail();
			// update dictionary with the new value
			storage[type][name] = '';
		}
		
	});
}

// populates select tag with the name:value pairs
function selectBuild (name, collection) {
	collection.forEach( item => {
		$('#' + name).append('<option value=\'' + item.id + '\'>' + item.name + '</option>');
	});
}

function buildForm () {
	
	blockMetaData(0);
	if (type === 'data') {
		blockFromDate(1, '&nbsp;(required)');
		blockToDate(2, '&nbsp;(required)');
	}
	else {
		blockFromDate(1);
		blockToDate(2);
	}
	blockSortField(3);
	blockSortOrder(4);
	blockLimit(5);
	blockOffset(6);
	
	switch (type) {
		case 'stations':
			blockDatatypeId(7);
			blockDataCategoryId(8);
			break;
		case 'datasets', 'datacategories':
			blockDatatypeId(7);
			blockLocationId(8);
			blockStationId(9);
			break;
		case 'locations':
			blockDataCategoryId(7);
			blockLocationCategoryId(8);
			blockDatasetId(9);
			break;
		case 'data':
			blockUnits(7);
			blockDatasetId(8, '&nbsp;(required)');
			blockDatatypeId(9);
			blockLocationId(10);
			blockStationId(11);
			blockGroupBy(12);
			break;
		case 'locationcategories':
			blockDatasetId(7);
			break;
		case 'datatypes':
			blockDatasetId(7);
			blockLocationId(8);
			blockStationId(9);
			blockDataCategoryId(10);
			break;
		default:
			break;
	}
}

function blockFromDate(number, required = '') {
	container.append(
		"<!-- DATES FROM -->" + 
		"<label class='bold m20 form-inline'>"+ number +". START DATE"+ required +":" + 
		"<input type='date' required data-name='from' class='form-control tab-long'style='width: auto;'>" + 
		"<button type='button' class='block-btn btn mybtn bgBase tab-short'>ADD</button>" + 
		"</label><!-- END OF DATES -->"
	);
}

function blockToDate(number, required = '') {
	container.append(
		"<!-- DATES TO -->" +
		"<label class='bold m20 form-inline'>"+ number +". END DATE"+ required +":" +
		"<input type='date' required data-name='to' class='form-control tab-long'>" +
		"<button type='button' class='block-btn btn mybtn bgBase tab-short'>ADD</button>" + 
		"</label><!-- END OF DATES -->"
	);
}

function blockSortField(number) {
	container.append(
		"<!-- SORT FIELD -->" +
		"<label class='bold m20 form-inline'>"+ number +". SORT BY:" +
			"<select data-name='sortby' class='form-control tab-long'>" +
				"<option default value=''>Select &#x25BC;</option>" +
				"<option value='id'>ID</option>" +
				"<option value='mindate'>Min Date</option>" +
				"<option value='maxdate'>Max Date</option>" +
				"<option value='datacoverage'>Data Coverage</option>" +
				"<option value='name'>Name</option>" +
			"</select>" +
			"<button type='button' class='block-btn btn mybtn bgBase tab-short'>ADD</button>" +
		"</label><!-- END OF SORT FIELD -->"
	);
}

function blockSortOrder(number) {
	container.append(
		"<!-- SORT ORDER -->" +
		"<label class='bold m20 form-inline'>"+ number +". ORDER (default: asc):" +		
			"<select data-name='order' class='form-control tab-long'>" +
				"<option default value=''>Select &#x25BC;</option>" +
				"<option value='asc'>Ascending</option>" +
				"<option value='desc'>Descending</option>" +
			"</select>" +
			"<button type='button' class='block-btn btn mybtn bgBase tab-short'>ADD</button>" +
		"</label><!-- END OF SORT ORDER -->"
	);
}

function blockDatasetId(number, required = '') {
	container.append(
		"<!-- DATASETID -->" +
		"<label class='bold m20 form-inline'>"+ number +". DATASET ID"+ required +":" + 	
			"<select id='datasetid' data-name='datasetid' class='form-control tab-long'>" +
				"<option default value=''>Select &#x25BC;</option></select>" +
			"<button type='button' class='block-btn btn mybtn bgBase tab-short'>ADD</button>" +
		"</label><!-- END DATASETID -->"
	);
	selectBuild('datasetid', datasetid);
}

function blockLocationId(number) {
	container.append(
		"<!-- LOCATIONID -->" +
		"<label class='bold m20 form-inline'>"+ number +". LOCATION ID:" +	
			"<!-- ID TYPE -->" +
			"<select id='locationid' data-name='locationid' class='form-control tab-long'>" +
				"<option default value=''>Select Type &#x25BC;</option></select>" +
			
			"<!-- ID VALUE -->" +
			"<input type='text' placeholder='input value' class='form-control tab-short' style='width: auto;'>" +
			"<button type='button' data-multi='yes' class='block-btn btn mybtn bgBase tab-short'>ADD</button>" +
		"</label><!-- END LOCATIONID -->"
	);
	selectBuild('locationid', locationcategories);
}

function blockLimit(number) {
	container.append(
		"<!-- LIMIT -->" +
		"<label class='bold m20 form-inline'>"+ number +". LIMIT:" +	
			"<input type='number' required data-name='limit' class='form-control tab-long' style='width: auto;'>" +
			"<button type='button' class='block-btn btn mybtn bgBase tab-short'>ADD</button>" +
		"</label><!-- END OF LIMIT -->"
	);
}

function blockOffset(number) {
	container.append(
		"<!-- OFFSET -->" +
		"<label class='bold m20 form-inline'>"+ number +". OFFSET:" +	
			"<input type='number' required data-name='offset' class='form-control tab-long style='width: auto;'>" +
			"<button type='button' class='block-btn btn mybtn bgBase tab-short'>ADD</button>" +
		"</label><!-- END OF OFFSET -->"
	);
}

function blockDatatypeId (number) {
	container.append(
		"<!-- DATATYPE ID -->" +
		"<label class='bold m20 form-inline'>"+ number +". DATA TYPE ID:" +		
			"<input type='text' data-name='datatypeid' class='form-control tab-long' style='width: auto;'>" +
			"<button type='button' class='block-btn btn mybtn bgBase tab-short'>ADD</button>" +
		"</label><!-- END OF DATATYPEID -->"
	);
}

function blockDataCategoryId (number) {
	container.append(
		"<!-- DATACATEGORY ID -->" +
		"<label class='bold m20 form-inline'>"+ number +". DATA CATEGORY ID:" +	
			"<select id='datacategoryid' data-name='datacategoryid' class='form-control tab-long'>" +
				"<option default value=''>Select &#x25BC;</option></select>" +
			"<button type='button' class='block-btn btn mybtn bgBase tab-short'>ADD</button>" +
		"</label><!-- END DATASETID -->"
	);
	selectBuild('datacategoryid',datacategoriesid);
}

function blockStationId (number) {
	container.append(
		"<!-- STATION ID -->" +
		"<label class='bold m20 form-inline'>"+ number +". STATION ID:" +		
			"<input type='text' data-name='stationid' class='form-control tab-long'>" +
			"<button type='button' class='block-btn btn mybtn bgBase tab-short'>ADD</button>" +
		"</label><!-- END OF STATION ID -->"
	);
}

function blockLocationCategoryId(number) {
	container.append(
		"<!-- LOCATIONID -->" +
		"<label class='bold m20 form-inline'>"+ number +". LOCATION CATEGORY ID:" +	
			"<!-- ID TYPE -->" +
			"<select id='locationid' data-name='locationcategoryid' class='form-control tab-long'>" +
				"<option default value=''>Select Type &#x25BC;</option></select>" +
			"<button type='button' class='block-btn btn mybtn bgBase tab-short'>ADD</button>" +
		"</label><!-- END LOCATIONID -->"
	);
	selectBuild('locationid', locationcategories);
}

function blockUnits(number) {
	container.append(
		"<!-- LOCATIONID -->" +
		"<label class='bold m20 form-inline'>"+ number +". UNITS:" +	
			"<select data-name='units' class='form-control tab-long'>" +
				"<option default value=''>Select &#x25BC;</option>" +
				"<option value='metric'>Metric</option>" +
				"<option value='standard'>Standard</option>" +
				"<option value='raw'>Raw Data</option></select>" +
			"<button type='button' class='block-btn btn mybtn bgBase tab-short'>ADD</button>" +
		"</label><!-- END LOCATIONID -->"
	);
}

function blockMetaData(number) {
	container.append(
		"<!-- METADATA -->" +
		"<label class='bold m20 form-inline'>"+ number +". INCLUDE METADATA:" +	
			"<select data-name='metadata' class='form-control tab-long'>" +
				"<option default value=''>Select &#x25BC;</option>" +
				"<option value='yes'>Yes</option>" +
				"<option value='no'>No</option></select>" +
			"<button type='button' class='block-btn btn mybtn bgBase tab-short'>ADD</button>" +
		"</label><!-- END METADATA -->"
	);
}

function blockGroupBy(number) {
	container.append(
		"<!-- GROUP BY -->" +
		"<label class='bold m20 form-inline'>"+ number +". GROUP BY:" +	
			"<select data-name='groupby' class='form-control tab-long'>" +
				"<option default value=''>Select &#x25BC;</option>" +
				"<option value='year'>Year</option>" +
				"<option value='month'>Month</option>" +
				"<option value='day'>Day</option></select>" +
			"<button type='button' class='block-btn btn mybtn bgBase tab-short'>ADD</button>" +
		"</label><!-- END GROUP BY -->"
	);
}
