export function startTimer() {
	const start = Date.now();
	return () => {
		const end = Date.now();
		return (end - start) / 1000; // in seconds
	};
}
