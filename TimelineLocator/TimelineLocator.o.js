var TimelineLocator = function(callback) {

	this.callback = callback;
	this.timelines = [];
	this.ticks = [];
	this.durations = [];
	this.lastStarts = [];
	this.intevalId = null;

}

TimelineLocator.prototype.list = function() {
	return this.timelines;
}

TimelineLocator.prototype.add = function(timeline) {
	var converted = this.toArray(timeline);
	this.timelines.push(converted);
	this.ticks.push(-1);
	this.lastStarts.push(converted[0].start);
	var sum = _.last(converted).start + _.last(converted).len;
	this.durations.push(sum); // almeno dell'ultimo elemento devo sapere la durata
	return this.timelines.length;
}

TimelineLocator.prototype.increment = function() {
	var ticks = this.ticks.map(function(value) {
		value++;
		return value;
	});
	this.checkForChange(this.ticks = ticks);
}

TimelineLocator.prototype.start = function(tickInSeconds) {
	this.intervalId = setInterval(this.increment.bind(this), parseInt(tickInSeconds * 1000));
	console.log('started');
}
TimelineLocator.prototype.stop = function() {
	clearInterval(this.intervalId);
	console.log('stopped');
}

TimelineLocator.prototype.checkForChange = function(ticks) {
	
	var a = [];
	var anyChange = false;

	var tlLen = this.timelines.length;
	for (var i = 0; i < tlLen; i++) {
		var o = {};
		o.timeline = i;
		if (this.ticks[i] >= this.durations[i]) {
			this.ticks[i] = 0; //loop
			console.log('resetted tick for timeline ' + i);
		}
		if (this.timelines[i][this.ticks[i]] == undefined) {
			o.status = 'no-change';
			o.id = '';
			o.elapsed = this.ticks[i] - this.lastStarts[i];
		} else {
			o.status = 'changed';
			o.id = this.timelines[i][this.ticks[i]].id
			o.elapsed = 0;
			anyChange = true;
		}
		o.time = this.ticks[i];
		a.push(o);
	}
	if (anyChange) {
		this.callback(a);
	}

}

TimelineLocator.prototype.goTo = function(destination, pause) {

	pause = pause || false;
	var deltas = this.ticks.map(function(value) {
		return value - destination;
	});
	this.ticks = _.fill(this.ticks, destination);
	this.checkForChange(this.ticks);

}

TimelineLocator.prototype.toArray = function(object) {

	var host = [];
	for (var key in object) {
		host[object[key].start] = object[key];
	}
	return host;

}