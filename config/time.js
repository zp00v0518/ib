class Time {
	constructor () {
		this.sec= 1000;
		this.minute= 1000 * 60;
		this.hour= 1000 * 60 * 60;
		this.day= 1000 * 60 * 60 * 24;
		this.week= 1000 * 60 * 60 * 24 * 7;
		this.month= 1000 * 60 * 60 * 24 * 31;
		this.startDate = 1262304000;
	}
}

module.exports = new Time();