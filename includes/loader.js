document.addEventListener('DOMContentLoaded', async () => {
	const els = [...document.querySelectorAll('[data-include]')];
	if (!els.length) return;

	const pendingScripts = [];

	await Promise.all(els.map(async el => {
		try {
			const res = await fetch(el.dataset.include);
			const html = await res.text();
			const doc = new DOMParser().parseFromString(html, 'text/html');
			doc.querySelectorAll('style').forEach(s => document.head.appendChild(s.cloneNode(true)));
			el.innerHTML = doc.body.innerHTML;
			doc.querySelectorAll('script').forEach(s => pendingScripts.push(s.textContent));
		} catch (e) {
			console.warn('[loader] Failed to fetch', el.dataset.include, e);
		}
	}));

	pendingScripts.forEach(src => {
		const s = document.createElement('script');
		s.textContent = src;
		document.body.appendChild(s);
	});

	// On index.html (pathname ends with / or /index.html), strip the filename
	// from nav links so section anchors work without a page reload
	const isIndex = /\/(index\.html)?$/.test(window.location.pathname);
	if (isIndex) {
		document.querySelectorAll('a[href^="index.html"]').forEach(a =>
			a.setAttribute('href', a.getAttribute('href').replace('index.html', '')));
	}

	// Mark the active nav link by matching data-page on <body>
	const page = document.body.dataset.page;
	if (page) {
		document.querySelectorAll('.nav-links a[data-page]').forEach(a => {
			if (a.dataset.page === page) a.classList.add('active');
		});
	}

	document.dispatchEvent(new CustomEvent('includes-loaded'));
});
