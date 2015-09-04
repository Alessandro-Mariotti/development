function addHead(array) {
	var $t = $('#output');
	$thead = $('<thead/>');
	$tr = $('<tr/>');
	$tr.appendTo($thead);
	$thead.appendTo($t);
	for (var i = 0; i < array.length; i++) {
		for (var key in array[i]) {
			$tr.append($('<th/>', {
				text: key
			}));
		}
	}
}

function changed(array) {
	var $t = $('#output thead');
	if ($t.length <= 0) {
		addHead(array);
	}
	$tr = $('<tr/>', {
		style: 'background-color: #FFFF99'
	});
	for (var i = 0; i < array.length; i++) {
		for (var key in array[i]) {
			$tr.append($('<td/>', {
				html: key == 'timeslot' ? array[i][key].timeslotId : array[i][key]
			}));
		}
	}
	$tr.appendTo($('#output tbody'));
}

function unchanged(array) {
	var $t = $('#output thead');
	if ($t.length <= 0) {
		addHead(array);
	}
	$tr = $('<tr/>');
	for (var i = 0; i < array.length; i++) {
		for (var key in array[i]) {
			$tr.append($('<td/>', {
				html: key == 'timeslot' ? array[i][key].timeslotId : array[i][key]
			}));
		}
	}
	$tr.appendTo($('#output tbody'));
}
var tll = new TimelineLocator(changed, unchanged);
var object = api;
var ct = 0;
for (var i = 0; i < object.timelines.length; i++) {
	for (var ii = 0; ii < object.timelines[i].rows.length; ii++) {
		tll.add(new Timeline(object.timelines[i].rows[ii], ct === 0 ? false : true));
		ct++;
	}
}