var Timeline = function(row, loops) {
	this.timeline = row;
	this.array = this.toArray(row.timeline);
	this.tick = -1;
	this.currentTimeslot = null;
	this.lastStart = this.array[0].start;
	this.duration = this.timeline.duration;
	this.finished = false;
}
Timeline.prototype.getTimeline = function() {
	return this.timeline;
}
Timeline.prototype.setTimeline = function(row) {
	this.timeline = row;
	this.array = this.toArray(row.timeline);
	this.tick = -1;
	this.lastStart = this.array[0].start;
	this.duration = this.timeline.duration;
}
Timeline.prototype.isLooping = function() {
	return this.loop;
}
Timeline.prototype.setLooping = function(loop) {
	this.loop = loop;
}
Timeline.prototype.toArray = function(object) {
	var host = [];
	for (var i = 0; i < object.length; i++) {
		host[object[i].start] = object[i];
	}
	return host;
}
Timeline.prototype.increment = function() {
	this.tick++;
}
Timeline.prototype.check = function() {
	if (this.finished) {
		return {
			hasChanged: false,
			timeline: self.timeline.id,
			status: 'ended',
			delta: self.tick - self.lastStart,
			tick: self.tick,
			timeslot: self.currentTimeslot
		}
	}
	var self = this;
	if (this.tick === this.duration) {
		this.tick = 0;
	}
	var result = {
		hasChanged: false,
		timeline: this.timeline.id,
		status: 'running',
		delta: this.tick - this.lastStart
	}
	if (this.array[this.tick] != undefined) {
		this.currentTimeslot = this.array[this.tick];
		this.lastStart = this.array[this.tick].start;
		result.status = 'start';
		result.delta = 0;
		result.hasChanged = true;
	}
	result.tick = this.tick;
	result.timeslot = this.currentTimeslot;
	return result;
}
Timeline.prototype.current = function(seconds) {
	var result = null;
	var found = false;
	if (seconds === undefined || seconds === null)
		seconds = this.tick === -1 ? 0 : this.tick;
	seconds = seconds > this.duration ? seconds % this.duration : seconds;
	var full = _.compact(this.array);
	_.forEach(full, function(n) {
		if (n.start === seconds) {
			result = {
				timeline: this.timeline.id,
				timeslot: n,
				status: 'start',
				delta: 0
			};
			found = true;
		}
	}, this);
	if (!found) {
		var cts = this.findCurrentTimeslot(seconds);
		result = {
			timeline: this.timeline.id,
			timeslot: cts,
			status: 'running',
			delta: seconds - cts.start
		};
	}
	return result;
}
Timeline.prototype.findCurrentTimeslot = function(seconds) {
	if (seconds <= 0) {
		return _.first(this.array);
	}
	var full = _.compact(this.array);
	var last = null;
	_.forEachRight(full, function(n) {
		if (n.start <= seconds) {
			last = n;
			return false;
		}
	}, this);
	return last;
}
Timeline.prototype.seek = function(seconds) {
	var result = {
		timeline: this.timeline.id
	};
	seconds--;
	seconds = seconds > this.duration ? seconds % this.duration : seconds;
	this.currentTimeslot = this.findCurrentTimeslot(seconds);
	result.delta = seconds - this.currentTimeslot.start;
	this.tick = seconds;
	result.timeslot = this.currentTimeslot;
	result.status = result.delta == 0 ? 'start' : 'running';
	return result;
}