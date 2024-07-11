/// <reference types="astro/client" />

type Swup = import('swup').default;

declare var swupEffects: ((swup: Swup) => void)[] | undefined;

declare var StarlightThemeProvider: {
	updatePickers(theme?: string): void;
};
