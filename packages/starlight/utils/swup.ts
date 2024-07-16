import Swup from 'swup';

console.log('initializing swup...');
globalThis.swup = new Swup({
	containers: ['.swup.page-frame'],
});

swup.hooks.on('visit:start', () => {
	document
		.querySelectorAll('.swup.transition-fade:not(.is-previous-container)')
		.forEach((container) => {
			console.log('container =>', container);
			if (container instanceof HTMLElement) {
				container.style.opacity = '0';
			}
		});
});

swup.hooks.on('content:replace', () => {
	const pages = document.querySelectorAll('.page-frame');
	pages.forEach((page) => {
		console.log('page =>', page);
		const scripts = page.querySelectorAll('script');
		console.log('scripts =>', scripts);
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
});
