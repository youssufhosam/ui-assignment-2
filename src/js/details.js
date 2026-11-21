import { fetchLaptops } from "./api.js";
import { selectComparison, specs } from "./compare.js";
import { getComparison, getFavorites, toggleFavorite } from "./storage.js";
import {
	escapeHTML,
	loadPage,
	money,
	setupShell,
	showMessage,
	syncSavedUI,
} from "./ui.js";

setupShell("laptops.html");
const details = document.querySelector("#details");
loadPage(details, async () => {
	const laptops = await fetchLaptops();
	const id = Number(new URLSearchParams(location.search).get("id"));
	const laptop = laptops.find((item) => item.id === id);
	if (!laptop) {
		details.innerHTML =
			'<div class="rounded-2xl border border-line p-8"><h1 class="font-display text-3xl">This laptop is not in our collection.</h1><p class="mt-3 text-muted">Choose a laptop from the catalogue to see its full specifications.</p><a class="btn-action mt-5" href="laptops.html">Explore laptops</a></div>';
		return;
	}
	document.title = `${laptop.name} | Laptop Finder`;
	details.innerHTML = `<div><div class="rounded-3xl bg-soft p-6 sm:p-10"><p class="eyebrow">${escapeHTML(laptop.category)} / ${escapeHTML(laptop.brand)}</p><img src="${escapeHTML(laptop.image)}" alt="${escapeHTML(laptop.name)} illustration" width="560" height="360" class="my-8 w-full"></div><p class="mt-4 font-mono text-xs text-muted">Illustration represents the laptop category, not exact product appearance.</p></div><div><p class="eyebrow">Meet your next study partner</p><h1 class="page-title">${escapeHTML(laptop.name)}</h1><p class="mt-5 text-3xl font-bold">${money(laptop.price)} <span class="text-sm font-normal text-muted">USD</span></p><p class="mt-5 leading-relaxed text-muted">${escapeHTML(laptop.description)}</p><div class="my-6 flex flex-wrap gap-3"><button class="btn-action" data-favorite="${laptop.id}">Save</button><button id="add-compare" class="btn-secondary">Add to comparison</button><a class="btn-secondary" href="compare.html">View comparison ↗</a></div><h2 class="mb-3 text-xl font-bold">Under the hood</h2><table class="w-full text-left text-sm"><caption class="sr-only">Full laptop specifications</caption><tbody><tr class="border-t border-line"><th scope="row" class="py-3 pr-4 font-medium">Product ID</th><td class="py-3">${laptop.id}</td></tr>${specs.map(([key, label, format = String]) => `<tr class="border-t border-line"><th scope="row" class="py-3 pr-4 font-medium">${label}</th><td class="py-3 text-muted">${escapeHTML(format(laptop[key]))}</td></tr>`).join("")}</tbody></table></div>`;
	syncSavedUI();
	function updateComparisonButton() {
		document.querySelector("#add-compare").textContent =
			getComparison().includes(id)
				? "Remove from comparison"
				: "Add to comparison";
	}
	updateComparisonButton();
	window.addEventListener("saved-change", updateComparisonButton);
	document.querySelector("#add-compare").addEventListener("click", () => {
		const selected = !getComparison().includes(id);
		if (selected && getComparison().length >= 4) {
			showMessage("Four is the limit. Remove a laptop from comparison first.");
			return;
		}
		if (!getFavorites().includes(id)) toggleFavorite(id);
		const error = selectComparison(id, selected);
		showMessage(
			error ||
				(selected
					? "Added to your comparison and favorites."
					: "Removed from comparison."),
		);
	});
});
