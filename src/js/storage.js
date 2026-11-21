const keys = {
	favorites: "slf-favorites",
	comparison: "slf-comparison",
	theme: "slf-theme",
};

export function readStored(key, fallback) {
	try {
		const value = JSON.parse(localStorage.getItem(keys[key]));
		if (key === "theme")
			return ["battery", "performance"].includes(value) ? value : fallback;
		return Array.isArray(value)
			? [...new Set(value.filter(Number.isInteger))]
			: fallback;
	} catch {
		return fallback;
	}
}

export function writeStored(key, value) {
	try {
		localStorage.setItem(keys[key], JSON.stringify(value));
		window.dispatchEvent(new Event("saved-change"));
		return true;
	} catch {
		window.dispatchEvent(
			new CustomEvent("app-message", {
				detail: "Storage is unavailable. Your changes cannot be saved.",
			}),
		);
		return false;
	}
}

export const getFavorites = () => readStored("favorites", []);
export const getComparison = () =>
	readStored("comparison", [])
		.filter((id) => getFavorites().includes(id))
		.slice(0, 4);

export function toggleFavorite(id) {
	const favorites = getFavorites();
	const next = favorites.includes(id)
		? favorites.filter((item) => item !== id)
		: [...favorites, id];
	writeStored("favorites", next);
	writeStored("comparison", getComparison());
}
