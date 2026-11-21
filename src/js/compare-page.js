import { fetchLaptops } from "./api.js";
import { renderComparison, selectComparison } from "./compare.js";
import { getComparison, getFavorites } from "./storage.js";
import { escapeHTML, loadPage, money, setupShell, showMessage } from "./ui.js";

setupShell("compare.html");
const picker = document.querySelector("#picker");
loadPage(picker, async () => {
	const laptops = await fetchLaptops();
	function updateComparison() {
		const favorites = laptops.filter((laptop) =>
			getFavorites().includes(laptop.id),
		);
		const selected = getComparison();
		picker.innerHTML = favorites.length
			? favorites
					.map(
						(laptop) =>
							`<label class="flex cursor-pointer items-center gap-4 rounded-xl border border-line bg-surface p-4 transition hover:border-accent"><input type="checkbox" class="rounded border-line text-accent focus:ring-accent" value="${laptop.id}" ${selected.includes(laptop.id) ? "checked" : ""}><span><span class="block text-sm font-bold">${escapeHTML(laptop.name)}</span><span class="text-xs text-muted">${money(laptop.price)} / ${laptop.ramGB} GB RAM</span></span></label>`,
					)
					.join("")
			: '<p class="col-span-full rounded-xl border border-line p-6 text-muted">Your favorites list is empty. <a href="laptops.html" class="font-bold text-accent underline">Explore and save some laptops first.</a></p>';
		const chosen = laptops.filter((laptop) => selected.includes(laptop.id));
		document.querySelector("#selection-count").textContent =
			`${chosen.length} / 4 selected`;
		renderComparison(document.querySelector("#comparison"), chosen);
	}
	picker.addEventListener("change", (event) => {
		const error = selectComparison(
			Number(event.target.value),
			event.target.checked,
		);
		if (error) event.target.checked = false;
		showMessage(error);
	});
	window.addEventListener("saved-change", updateComparison);
	updateComparison();
});
