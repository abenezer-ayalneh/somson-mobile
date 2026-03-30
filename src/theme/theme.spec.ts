import { TestBed } from '@angular/core/testing'
import { afterAll, afterEach, expect, vi } from 'vitest'

import { Theme } from './theme'

describe('Theme', () => {
	let service: Theme
	let systemPrefersDark: boolean
	let onThemeChange: ((e: MediaQueryListEvent) => void) | undefined

	beforeEach(() => {
		TestBed.configureTestingModule({})
		service = TestBed.inject(Theme)
		systemPrefersDark = true
	})
	afterEach(() => {
		vi.restoreAllMocks()
		TestBed.resetTestingModule()
	})

	const matchMediaMock = vi.fn((query: string) => ({
		matches: query === '(prefers-color-scheme: dark)' && systemPrefersDark,
		media: query,
		addEventListener: vi.fn((type: string, listener: (e: MediaQueryListEvent) => void) => {
			if (type === 'change') onThemeChange = listener
		}),
	}))

	vi.stubGlobal('matchMedia', matchMediaMock)

	afterAll(() => {
		vi.unstubAllGlobals()
	})

	it('should be created', () => {
		expect(service).toBeTruthy()
	})

	it("should initialize theme based on preferred color scheme when the user's theme preference is not set", () => {
		vi.spyOn(Storage.prototype, 'getItem').mockReturnValue(null)
		const spyOnSetThemeSignal = vi.spyOn(service.theme, 'set')

		service.init()

		expect(matchMediaMock).toHaveBeenCalledOnce()
		expect(matchMediaMock).toHaveBeenCalledWith('(prefers-color-scheme: dark)')
		expect(spyOnSetThemeSignal).toHaveBeenCalledExactlyOnceWith('dark')
		expect(service.theme()).toBe('dark')
		expect(document.documentElement).toHaveClass('ion-palette-dark')
	})

	it('should use light theme when OS prefers light and nothing is stored', () => {
		vi.spyOn(Storage.prototype, 'getItem').mockReturnValue(null)
		systemPrefersDark = false

		service.init()

		expect(service.theme()).toBe('light')
		expect(document.documentElement).not.toHaveClass('ion-palette-dark')
	})

	it('should initialize theme based on user preference when the user has set a theme preference', () => {
		vi.spyOn(Storage.prototype, 'getItem').mockReturnValue('light')
		const spyOnSetThemeSignal = vi.spyOn(service.theme, 'set')

		service.init()

		expect(spyOnSetThemeSignal).toHaveBeenCalledExactlyOnceWith('light')
		expect(service.theme()).toBe('light')
		expect(document.documentElement).not.toHaveClass('ion-palette-dark')
	})

	it('should toggle theme between dark and light', () => {
		const initialTheme = service.theme()

		service.toggle()

		expect(service.theme()).not.toBe(initialTheme)
	})

	// 	Should change theme when the OS' theme change
	it('should listen to OS theme changes', () => {
		vi.spyOn(Storage.prototype, 'getItem').mockReturnValue('dark')

		service.init()

		expect(service.theme()).toBe('dark')
		expect(document.documentElement).toHaveClass('ion-palette-dark')

		onThemeChange?.({ matches: false, media: '(prefers-color-scheme: dark)' } as MediaQueryListEvent)

		expect(service.theme()).not.toBe('dark')
		expect(document.documentElement).not.toHaveClass('ion-palette-dark')
	})
})
