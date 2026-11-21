import { fetchLaptops } from "./api.js";
import { getFavorites, writeStored } from "./storage.js";
import { loadPage, money, renderCards, setupShell } from "./ui.js";

setupShell("favorites.html");
const container = document.querySelector("#favorites");
loadPage(container, async () => {
	const laptops = await fetchLaptops();
	function updateFavorites() {
		const favorites = laptops.filter((laptop) =>
			getFavorites().includes(laptop.id),
		);
		const total = favorites.reduce((sum, laptop) => sum + laptop.price, 0);
		const average = favorites.length ? total / favorites.length : 0;
		document.querySelector("#totals").innerHTML = [
			[favorites.length, "Saved laptops"],
			[money(total), "Total price / USD"],
			[money(average), "Average price / USD"],
		]
			.map(
				([value, label]) =>
					`<div class="rounded-2xl border border-line bg-surface p-6"><p class="font-display text-3xl">${value}</p><p class="mt-2 font-mono text-xs uppercase text-muted">${label}</p></div>`,
			)
			.join("");
		document.querySelector("#clear").disabled = favorites.length === 0;
		renderCards(container, favorites);
	}
	document.querySelector("#clear").addEventListener("click", () => {
		if (confirm("Remove all saved favorites?")) {
			writeStored("favorites", []);
			writeStored("comparison", []);
		}
	});
	window.addEventListener("saved-change", updateFavorites);
	updateFavorites();
});
