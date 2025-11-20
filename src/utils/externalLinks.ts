//open external links in new window
export function openExternalLinksInNewWindow(): void {
	const links = document.links;

	for (let i = 0; i < links.length; i++) {
		if (links[i].hostname !== window.location.hostname) {
			links[i].target = "_blank";
			links[i].rel = "noreferrer noopener";
			links[i].classList.add("open_in_new_window");
		}
	}
}
