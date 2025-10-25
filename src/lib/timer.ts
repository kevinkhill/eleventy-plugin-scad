export function startTimer() {
	const start = Date.now();
	return () => {
		const end = Date.now();
		const duration = `${(end - start) / 1000}`; // in seconds
		return { start, end, duration };
	};
}
