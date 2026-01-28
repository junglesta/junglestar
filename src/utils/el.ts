// src/utils/el.ts
//
//open external links in new window
export function openExternalLinksInNewWindow(): void {
	const links = document.links;

	for (let i = 0; i < links.length; i++) {
		if (links[i].hostname !== window.location.hostname) {
			if (!links[i].target || links[i].target !== '_blank') {
				links[i].target = '_blank';
			}

			if (!links[i].rel || !links[i].rel.includes('noopener')) {
				links[i].rel = 'noreferrer noopener';
			}

			if (!links[i].classList.contains('open_in_new_window')) {
				links[i].classList.add('open_in_new_window');
			}
		}
	}
}

// mailto links
export function markMailtoLinks(): void {
	const links = document.querySelectorAll('a[href^="mailto:"]');

	links.forEach((link) => {
		if (!link.classList.contains('mailto_link')) {
			link.classList.add('mailto_link');
		}
	});
}
