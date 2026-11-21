import { fetchLaptops } from "./api.js";
import { getFavorites } from "./storage.js";
import { loadPage, money, renderCards, setupShell } from "./ui.js";

setupShell("index.html");
const featured = document.querySelector("#featured");
loadPage(featured, async () => {
	const laptops = await fetchLaptops();
	const lowest = laptops.reduce(
		(minimum, laptop) => Math.min(minimum, laptop.price),
		Infinity,
	);
	function updateStats() {
		const stats = [
			[laptops.length, "Laptops to discover"],
			[money(lowest), "Starting price / USD"],
			[getFavorites().length, "Saved for later"],
		];
		document.querySelector("#stats").innerHTML = stats
			.map(
				([value, label]) =>
					`<div class="p-6 sm:p-8"><p class="font-display text-4xl">${value}</p><p class="mt-2 font-mono text-xs uppercase tracking-wider text-muted">${label}</p></div>`,
			)
			.join("");
	}
	updateStats();
	window.addEventListener("saved-change", updateStats);
	renderCards(featured, laptops.slice(0, 3));
});
