/// <reference types="astro/client" />

type Swup = import('swup').default;

declare var swup: Swup;

declare var StarlightThemeProvider: {
	updatePickers(theme?: string): void;
};
