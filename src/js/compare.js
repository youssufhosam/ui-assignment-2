import { getComparison, getFavorites, writeStored } from "./storage.js";
import { escapeHTML, money } from "./ui.js";

export function selectComparison(id, selected) {
	const current = getComparison();
	if (!getFavorites().includes(id))
		return "Save this laptop to favorites first.";
	if (selected && !current.includes(id) && current.length >= 4)
		return "Four is the limit. Remove a laptop before adding another.";
	const next = selected
		? [...new Set([...current, id])]
		: current.filter((item) => item !== id);
	return writeStored("comparison", next)
		? ""
		: "Your comparison could not be saved.";
}

export const specs = [
	["price", "Price", money, "min"],
	["brand", "Brand"],
	["category", "Category"],
	["cpu", "Processor"],
	["ramGB", "Memory", (value) => `${value} GB`, "max"],
	["storageGB", "SSD storage", (value) => `${value} GB`, "max"],
	["batteryHours", "Battery life", (value) => `${value} hours`, "max"],
	["weightKg", "Weight", (value) => `${value} kg`, "min"],
	["screenInches", "Screen", (value) => `${value} inches`],
];

export function renderComparison(container, laptops) {
	if (laptops.length < 2) {
		container.innerHTML =
			'<div class="rounded-2xl border border-dashed border-line p-10 text-center"><h2 class="text-2xl font-display">Good decisions start with a comparison.</h2><p class="mt-3 text-muted">Select two to four of your favorites above to see the details side by side.</p></div>';
		return;
	}
	container.innerHTML = `<div class="max-w-full overflow-x-auto rounded-2xl border border-line" role="region" aria-label="Laptop comparison" tabindex="0"><table class="w-full min-w-[720px] border-collapse text-left text-sm"><caption class="sr-only">Selected laptop specifications. Best numeric values are marked Best.</caption><thead><tr><th scope="col" class="min-w-36 bg-soft p-5 font-mono text-xs uppercase">The shortlist</th>${laptops.map((laptop) => `<th scope="col" class="min-w-48 bg-surface p-5"><img src="${escapeHTML(laptop.image)}" alt="" class="mb-3 h-28 w-full object-contain"><a href="details.html?id=${laptop.id}" class="text-lg hover:text-accent">${escapeHTML(laptop.name)}</a></th>`).join("")}</tr></thead><tbody>${specs
		.map(([key, label, format = String, direction]) => {
			// Calculate winners from only the selected laptops; ties all receive the badge.
			const best = direction
				? Math[direction](...laptops.map((laptop) => laptop[key]))
				: null;
			return `<tr class="border-t border-line"><th scope="row" class="bg-soft p-5 font-medium">${label}</th>${laptops.map((laptop) => `<td class="p-5 ${direction && laptop[key] === best ? "bg-soft font-bold text-accent" : "bg-surface"}">${escapeHTML(format(laptop[key]))}${direction && laptop[key] === best ? '<span class="mt-1 block font-mono text-[10px] uppercase tracking-widest">Best</span>' : ""}</td>`).join("")}</tr>`;
		})
		.join("")}</tbody></table></div>`;
}
