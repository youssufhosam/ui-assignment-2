let cached;
export async function fetchLaptops() {
	if (cached) return cached;
	try {
		const response = await fetch(
			new URL("../../data/laptops.json", import.meta.url),
		);
		if (!response.ok) throw new Error(`HTTP ${response.status}`);
		const { laptops: data } = await response.json();
		if (!Array.isArray(data) || !data.length)
			throw new Error("Invalid laptop data");
		cached = data;
		return data;
	} catch (error) {
		console.error("Laptop data could not be loaded:", error);
		throw new Error(
			"We could not load the laptops. Run this folder with a local web server, check your connection, and reload.",
		);
	}
}
