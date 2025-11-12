class Timer {
	private _started = NaN;
	private _stopped = NaN;

	start() {
		this._started = Date.now();
		return this;
	}

	stop() {
		this._stopped = Date.now();
		return this;
	}

	reset() {
		this._started = 0;
		this._stopped = 0;
		return this;
	}

	readAndReset() {
		this.stop();
		const duration = (this._stopped - this._started) / 1000;
		this.reset();
		return duration;
	}
}

export default Timer;
