import {
	getFavorites,
	readStored,
	toggleFavorite,
	writeStored,
} from "./storage.js";

export const money = (value) =>
	new Intl.NumberFormat("en-US", {
		style: "currency",
		currency: "USD",
		maximumFractionDigits: 0,
	}).format(value);
export const escapeHTML = (value) =>
	String(value).replace(
		/[&<>"']/g,
		(char) =>
			({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
				char
			],
	);

export function showMessage(message) {
	document.querySelector("#notification").textContent = message;
}

export function setupShell(active) {
	// Restore the shared theme before rendering the page content.
	document.documentElement.dataset.theme = readStored("theme", "battery");
	const links = [
		["index.html", "Home"],
		["laptops.html", "Explore laptops"],
		["favorites.html", "Favorites"],
		["compare.html", "Compare"],
	];
	document.querySelector("#header").innerHTML =
		`<div class="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-5 py-5 sm:px-8"><a href="index.html" class="flex items-center gap-3 font-bold tracking-tight"><span class="flex size-10 items-center justify-center rounded-xl bg-accent font-mono text-lg text-on-accent" aria-hidden="true">lf.</span><span>laptop finder<span class="block font-mono text-[10px] font-normal uppercase tracking-widest text-muted">The student edition</span></span></a><button id="menu-toggle" class="btn-secondary md:hidden" aria-expanded="false" aria-controls="navigation">Menu</button><nav id="navigation" aria-label="Main navigation" class="hidden w-full flex-col gap-2 md:flex md:w-auto md:flex-row md:items-center">${links.map(([href, label]) => `<a href="${href}" ${active === href ? 'aria-current="page"' : ""} class="rounded-full px-4 py-2 text-sm font-bold transition hover:bg-soft ${active === href ? "bg-soft text-accent" : "text-muted"}">${label}${href === "favorites.html" ? ' <span data-favorite-count class="font-mono"></span>' : ""}</a>`).join("")}<button id="theme-toggle" class="btn-secondary text-xs" aria-label="Switch color theme"></button></nav></div>`;
	document.querySelector("#footer").innerHTML =
		'<div class="mx-auto flex max-w-7xl flex-col justify-between gap-3 px-5 py-7 text-xs text-muted sm:flex-row sm:px-8"><p><strong class="text-ink">Less guesswork. More possibility.</strong> A laptop for your next chapter.</p><p>SW302 / Student Laptop Finder / 2026</p></div>';
	document.querySelector("#menu-toggle").addEventListener("click", (event) => {
		const open = event.currentTarget.getAttribute("aria-expanded") !== "true";
		event.currentTarget.setAttribute("aria-expanded", String(open));
		document.querySelector("#navigation").classList.toggle("hidden", !open);
		document.querySelector("#navigation").classList.toggle("flex", open);
	});
	document.querySelector("#theme-toggle").addEventListener("click", () => {
		const theme =
			document.documentElement.dataset.theme === "battery"
				? "performance"
				: "battery";
		document.documentElement.dataset.theme = theme;
		writeStored("theme", theme);
		syncSavedUI();
	});
	document.addEventListener("click", (event) => {
		const button = event.target.closest("[data-favorite]");
		if (button) toggleFavorite(Number(button.dataset.favorite));
	});
	window.addEventListener("app-message", (event) => showMessage(event.detail));
	window.addEventListener("saved-change", syncSavedUI);
	window.addEventListener("storage", () => {
		document.documentElement.dataset.theme = readStored("theme", "battery");
		window.dispatchEvent(new Event("saved-change"));
	});
	syncSavedUI();
}

export function syncSavedUI() {
	const favorites = getFavorites();
	document.querySelectorAll("[data-favorite-count]").forEach((element) => {
		element.textContent = favorites.length;
	});
	document.querySelectorAll("[data-favorite]").forEach((button) => {
		const saved = favorites.includes(Number(button.dataset.favorite));
		button.setAttribute("aria-pressed", String(saved));
		button.textContent = saved ? "♥ Saved" : "♡ Save";
		button.setAttribute(
			"aria-label",
			`${saved ? "Remove from" : "Add to"} favorites`,
		);
	});
	const toggle = document.querySelector("#theme-toggle");
	if (toggle)
		toggle.textContent =
			document.documentElement.dataset.theme === "performance"
				? "◐ Performance Mode"
				: "◒ Battery Saver Mode";
}

export function renderCards(container, laptops) {
	container.innerHTML = laptops.length
		? laptops
				.map(
					(laptop) =>
						`<article class="laptop-card"><div class="relative bg-soft p-6"><span class="rounded-full border border-line bg-surface px-3 py-1 font-mono text-[10px] uppercase tracking-widest">${escapeHTML(laptop.category)}</span><a href="details.html?id=${laptop.id}" tabindex="-1" aria-hidden="true"><img src="${escapeHTML(laptop.image)}" alt="" class="mt-3 h-40 w-full object-contain" loading="lazy" width="560" height="360"></a></div><div class="flex flex-1 flex-col p-5"><p class="eyebrow">${escapeHTML(laptop.brand)}</p><h3 class="mt-2 text-lg font-bold"><a class="hover:text-accent" href="details.html?id=${laptop.id}">${escapeHTML(laptop.name)}</a></h3><p class="mt-2 text-xs text-muted">${laptop.ramGB} GB RAM <span aria-hidden="true">/</span> ${laptop.storageGB} GB SSD <span aria-hidden="true">/</span> ${laptop.screenInches}″</p><p class="mt-2 text-xs text-muted">Up to ${laptop.batteryHours}h battery · ${laptop.weightKg} kg</p><div class="mt-auto flex flex-wrap items-center justify-between gap-3 pt-6"><strong class="text-2xl tracking-tight">${money(laptop.price)}</strong><button class="btn-secondary px-4" data-favorite="${laptop.id}">Save</button></div></div></article>`,
				)
				.join("")
		: '<div class="col-span-full rounded-2xl border border-dashed border-line p-10 text-center"><h2 class="text-xl font-bold">Nothing here just yet.</h2><p class="mt-2 text-muted">Try a different search or save a laptop from the catalogue.</p><a class="btn-action mt-5" href="laptops.html">Explore laptops</a></div>';
	syncSavedUI();
}

export function renderSkeleton(container, count = 3) {
	container.setAttribute("aria-busy", "true");
	container.innerHTML = Array.from(
		{ length: count },
		() =>
			'<div class="laptop-card animate-pulse" role="status" aria-label="Loading laptop"><div class="h-56 bg-soft"></div><div class="space-y-4 p-5"><div class="h-3 w-20 rounded bg-soft"></div><div class="h-6 w-3/4 rounded bg-soft"></div><div class="h-3 rounded bg-soft"></div><div class="h-10 w-1/2 rounded bg-soft"></div></div></div>',
	).join("");
}

export async function loadPage(container, callback) {
	renderSkeleton(container);
	try {
		await callback();
	} catch (error) {
		container.innerHTML = `<div role="alert" class="col-span-full rounded-2xl border border-line bg-surface p-8"><h2 class="text-xl font-bold">A small connection hiccup.</h2><p class="mt-3 text-muted">${escapeHTML(error.message)}</p><button class="btn-action mt-5" id="retry">Try again</button></div>`;
		document
			.querySelector("#retry")
			.addEventListener("click", () => location.reload());
	} finally {
		container.removeAttribute("aria-busy");
	}
}
