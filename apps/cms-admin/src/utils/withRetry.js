export async function withRetry(fn, { attempts = 3, baseDelay = 600 } = {}) {
	for (let i = 0; i < attempts; i++) {
		try {
			return await fn();
		} catch (err) {
			if (i === attempts - 1) throw err;
			await new Promise(r => setTimeout(r, baseDelay * Math.pow(2, i)));
		}
	}
}
