import { Injectable, signal } from '@angular/core'

import { THEME } from '../app/shared/constants/theme.constant'

@Injectable({
	providedIn: 'root',
})
export class Theme {
	theme = signal<'light' | 'dark'>('dark')

	init() {
		// Initialize the dark palette based on
		// the user saved preference or the initial value of the prefers-color-scheme media query
		const mediaQueryList = window.matchMedia('(prefers-color-scheme: dark)')

		if (localStorage.getItem(THEME)) {
			this.initializeDarkPalette(Boolean(localStorage.getItem(THEME) === 'dark'))
		} else {
			// Use matchMedia to check the user preference
			this.initializeDarkPalette(mediaQueryList.matches)
		}

		// Listen for changes to the prefers-color-scheme media query
		mediaQueryList.addEventListener('change', (mediaQuery) => this.initializeDarkPalette(mediaQuery.matches))
	}

	toggle() {
		const newTheme = this.theme() === 'light' ? 'dark' : 'light'
		this.theme.set(newTheme)
		this.toggleDarkPalette(newTheme)
	}

	// Add or remove the "ion-palette-dark" class on the html element
	private toggleDarkPalette(theme: 'light' | 'dark') {
		document.documentElement.classList.toggle('ion-palette-dark', theme === 'dark')
		localStorage.setItem(THEME, theme)
	}

	// Check/uncheck the toggle and update the palette based on isDark
	private initializeDarkPalette(isDarkPreferred: boolean) {
		this.theme.set(isDarkPreferred ? 'dark' : 'light')
		this.toggleDarkPalette(isDarkPreferred ? 'dark' : 'light')
	}
}
