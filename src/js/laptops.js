import { fetchLaptops } from "./api.js";
import { loadPage, renderCards, setupShell } from "./ui.js";

setupShell("laptops.html");
const catalogue = document.querySelector("#catalogue");
const form = document.querySelector("#filters");
form.addEventListener("submit", (event) => event.preventDefault());
loadPage(catalogue, async () => {
	const laptops = await fetchLaptops();
	function updateResults() {
		const search = document.querySelector("#search").value.trim().toLowerCase();
		const category = document.querySelector("#category").value;
		const price = document.querySelector("#price").value;
		const ram = Number(document.querySelector("#ram").value);
		const [key, direction] = document.querySelector("#sort").value.split("-");
		const filtered = laptops.filter(
			(laptop) =>
				`${laptop.name} ${laptop.brand}`.toLowerCase().includes(search) &&
				(!category || laptop.category === category) &&
				(price === "" || laptop.price <= Number(price)) &&
				laptop.ramGB >= ram,
		);
		const sorted = [...filtered].sort((a, b) =>
			direction === "asc" ? a[key] - b[key] : b[key] - a[key],
		);
		renderCards(catalogue, sorted);
		document.querySelector("#result-count").textContent =
			`${sorted.length} of ${laptops.length} laptops`;
	}
	form.addEventListener("input", updateResults);
	form.addEventListener("reset", () => setTimeout(updateResults, 0));
	updateResults();
});
