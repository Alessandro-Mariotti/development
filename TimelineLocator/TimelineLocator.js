var TimelineLocator = function(changed, unchanged) {
	this.changed = changed;
	this.unchanged = unchanged;
	this.timelines = [];
	this.intervalId = null;
	this.globalTick = -1;
	this.isStarted = false;
}
TimelineLocator.prototype.start = function() {
	if (this.isStarted)
		return;
	this.isStarted = true;
	this.intervalId = setInterval(this.move.bind(this), parseInt(50));
	console.log('started');
}
TimelineLocator.prototype.pause = function() {
	if (!this.isStarted)
		return;
	this.isStarted = false;
	clearInterval(this.intervalId);
	console.log('paused');
}
TimelineLocator.prototype.stop = function() {
	if (!this.isStarted)
		return
	this.isStarted = false;
	clearInterval(this.intervalId);
	this.globalTick = -1;
	_.forEach(this.timelines, function(timeline) {
		timeline.tick = -1;
	}, this);
	console.log('stopped');
}
TimelineLocator.prototype.add = function(timeline) {
	this.timelines.push(timeline);
	return this.timelines.length;
}
TimelineLocator.prototype.list = function() {
	return this.timelines;
}
TimelineLocator.prototype.size = function() {
	return this.timelines.size;
}
TimelineLocator.prototype.isEmpty = function() {
	return this.timelines.size == 0 ? true : false;
}
TimelineLocator.prototype.move = function() {
	this.globalTick++;
	var o = [];
	_.forEach(this.timelines, function(timeline) {
		timeline.increment();
		o.push(timeline.check());
	}, this);
	if (this.somethingChanged(o)) {
		if (this.changed) {
			this.changed(o);
		}
	} else {
		if (this.unchanged) {
			this.unchanged(o);
		}
	}
	return o;
}
TimelineLocator.prototype.somethingChanged = function(resultsArray) {
	var l = resultsArray.length;
	for (var i = 0; i < l; i++) {
		if (resultsArray[i].hasChanged) {
			return true;
		}
	}
	return false;
}
TimelineLocator.prototype.getIndexes = function() {
	var indexes = [];
	var l = this.timelines.length;
	for (var i = 0; i < l; i++) {
		var o = {};
		o.timeline = this.timelines[i].timeline.id;
		o.tick = this.timelines[i].tick;
		o.idCurrentTimeslot = this.timelines[i].currentTimeslot;
		indexes.push(o);
	}
	return indexes;
}
TimelineLocator.prototype.current = function(seconds) {
	var o = [];
	_.forEach(this.timelines, function(tl) {
		o.push(tl.current(seconds));
	});
	return o;
}
TimelineLocator.prototype.seek = function(seconds) {
	var results = [];
	_.forEach(this.timelines, function(tl) {
		results.push(tl.seek(seconds));
	}, this);
	return results;
}
TimelineLocator.prototype.getGlobalTick = function() {
	return this.globalTick;
}