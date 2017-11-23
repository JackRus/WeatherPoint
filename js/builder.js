$('#type').change( function() {
	$('#display').text('http://localhost:5000/api/' + this.value);

	// hide all blocks
	$('.datatype').each( function () {
		$(this).hide();
	}); 

	if (this.value === 'stations'){
		stations();
	}
});


const log = console.log;

let stationsStorage = {
	'order': '',
	'from': '',
	'to': '',
	'sortby': ''
};

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

// appends endPoint with the given
function appendEndPoint(value) {
	if (value !== '' && value !== null) { 
		$('#display').html(checkUrl() + value);
	}
}

function updateData(oldValue, newValue){
	$('#display').html( $('#display').html().replace(oldValue, newValue) );
}

// changes endPoint according to users choice

// Stations EndPoint
function stations() {
	$('#stations').show();

	// ".stations-btn" handler
	$('.stations-btn').click( function() {
		
		let element = $(this).closest('label').children(0);
		let val = element.val();
		let name = element.data('name');
		let data = '<span class=\'endpoint\'>' + name + '</span>=' + val;

		// add if isn't added
		if (!isAdded(name)) {
			if (val !== ('' && null)){
				appendEndPoint(data);
			}
		}
		// if endPoint contains this parameter, update value
		else {
			updateData(stationsStorage[name], val);
		}
		
		// update dictionary with the new value
		stationsStorage[name] = val;
	});
}

