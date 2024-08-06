function onSwupEnabled() {
	swup.hooks.on('visit:start', () => {
		document
			.querySelectorAll('.swup.transition-fade:not(.is-previous-container)')
			.forEach((container) => {
				if (container instanceof HTMLElement) {
					container.style.opacity = '0';
				}
			});
	});

	swup.hooks.on('content:replace', () => {
		const url = swup.getCurrentUrl();

		// Rerun all inline scripts.
		const pages = document.querySelectorAll('.page-frame');
		pages.forEach((page) => {
			const scripts = page.querySelectorAll('script');
			scripts.forEach((script) => {
				if (!script.textContent) return;
				const clonedScript = document.createElement('script');
				clonedScript.textContent = script.textContent;

				const parent = script.parentElement;
				if (parent) {
					parent.appendChild(clonedScript);
				}
				script.remove();
			});
		});

		// Update the sidebar.
		const prevPageLink = document.querySelector('.sidebar-content [aria-current="page"]');
		const currPageLink = document.querySelector(`.sidebar-content a[href="${url}"]`);

		prevPageLink?.removeAttribute('aria-current');
		currPageLink?.setAttribute('aria-current', 'page');
	});
}

if ('swup' in window) {
	onSwupEnabled();
} else {
	document.addEventListener('swup:enable', onSwupEnabled);
}
