import { TestBed } from '@angular/core/testing'
import { Router } from '@angular/router'
import { IonicModule } from '@ionic/angular'
import { TranslateLoader, TranslateModule, TranslateService, TranslationObject } from '@ngx-translate/core'
import { fireEvent, render, screen } from '@testing-library/angular'
import { firstValueFrom, Observable, of } from 'rxjs'
import { beforeEach, describe, expect, it, Mock, vi } from 'vitest'

import { ONBOARDING_PAGES } from './onboarding.constant'
import { OnboardingPage } from './onboarding.page'

/**
 * Ionic uses <ion-button> (custom elements). In jsdom they often do not appear in the a11y tree as
 * role="button", so getByRole('button', { name }) fails even when the label is visible.
 */
const getMainButton = (root: HTMLElement, text: string): HTMLElement => {
	const ionButton = Array.from(root.querySelectorAll('ion-button')).find((el) => el.textContent?.trim().includes(text))

	if (!ionButton) {
		throw new Error(`No ion-button containing "${text}"`)
	}

	return ionButton as HTMLElement
}

const APPLICATION_NAME = 'Somson'
const SKIP_BUTTON_TEXT = 'Skip'
const CONTINUE_BUTTON_TEXT = 'Continue'
const FINISH_BUTTON_TEXT = "Let's Go"
const FIRST_PAGE_TITLE = 'Track Your Routines'
const FIRST_PAGE_SUBTITLE = 'Organize your workouts into personalized routines that match your goals.'

class TranslationTestingLoader implements TranslateLoader {
	getTranslation(): Observable<TranslationObject> {
		return of({
			somson: APPLICATION_NAME,
			skip: SKIP_BUTTON_TEXT,
			onboarding: {
				contents: {
					first: {
						title: FIRST_PAGE_TITLE,
						subtitle: FIRST_PAGE_SUBTITLE,
					},
					second: {
						title: 'Welcome to Somson',
						subtitle: FIRST_PAGE_SUBTITLE,
					},
					third: {
						title: 'Welcome to Somson',
						subtitle: FIRST_PAGE_SUBTITLE,
					},
					fourth: {
						title: 'Welcome to Somson',
						subtitle: FIRST_PAGE_SUBTITLE,
					},
				},
				continue: CONTINUE_BUTTON_TEXT,
				finish: FINISH_BUTTON_TEXT,
			},
		})
	}
}

const getIndicatorButtons = (container: HTMLElement): HTMLButtonElement[] => {
	return Array.from(container.querySelectorAll('button')).filter((button): button is HTMLButtonElement => {
		return button.querySelector('div.rounded-full') !== null
	})
}

const getActiveIndicatorIndex = (container: HTMLElement): number => {
	const indicatorButtons = getIndicatorButtons(container)

	return indicatorButtons.findIndex((button) => button.firstElementChild?.classList.contains('w-8'))
}

describe('OnboardingPage', () => {
	let container: HTMLElement
	let navigate: Mock

	beforeEach(async () => {
		navigate = vi.fn().mockResolvedValue(true)

		const renderResult = await render(OnboardingPage, {
			imports: [
				IonicModule.forRoot(),
				TranslateModule.forRoot({
					loader: {
						provide: TranslateLoader,
						useClass: TranslationTestingLoader,
					},
					fallbackLang: 'en',
					lang: 'en',
				}),
			],
			providers: [
				{
					provide: Router,
					useValue: { navigate },
				},
			],
		})

		// TranslatePipe updates after the loader Observable completes; first render may still show the key.
		const translate = TestBed.inject(TranslateService)
		await firstValueFrom(translate.use('en'))
		renderResult.fixture.detectChanges()
		container = renderResult.container
	})

	it('renders app name, skip button, image, first page content, indicators, and continue button', async () => {
		expect(screen.getByText(APPLICATION_NAME)).toBeVisible()
		expect(getMainButton(container, SKIP_BUTTON_TEXT)).toBeVisible()
		expect(screen.getByRole('img', { name: 'somson' })).toBeVisible()
		expect(screen.getByText(FIRST_PAGE_TITLE)).toBeVisible()
		expect(screen.getByText(FIRST_PAGE_SUBTITLE)).toBeVisible()
		expect(getMainButton(container, CONTINUE_BUTTON_TEXT)).toBeVisible()
		expect(getIndicatorButtons(container)).toHaveLength(ONBOARDING_PAGES.length)
		expect(getActiveIndicatorIndex(container)).toBe(0)
	})

	it('skip takes the user to the last page', async () => {
		fireEvent.click(getMainButton(container, SKIP_BUTTON_TEXT))

		expect(getActiveIndicatorIndex(container)).toBe(ONBOARDING_PAGES.length - 1)
		expect(getIndicatorButtons(container)[ONBOARDING_PAGES.length - 1].firstChild).toHaveClass('w-8')
		expect(getMainButton(container, FINISH_BUTTON_TEXT)).toBeVisible()
	})

	it('clicking each page indicator navigates to that page', async () => {
		const indicatorButtons = getIndicatorButtons(container)

		for (const [index, indicatorButton] of indicatorButtons.entries()) {
			fireEvent.click(indicatorButton)

			expect(getActiveIndicatorIndex(container)).toBe(index)

			if (index === ONBOARDING_PAGES.length - 1) {
				expect(getMainButton(container, FINISH_BUTTON_TEXT)).toBeVisible()
			} else {
				expect(getMainButton(container, CONTINUE_BUTTON_TEXT)).toBeVisible()
			}
		}
	})

	it('main button moves to next page and changes text on the last page', async () => {
		for (let expectedPageIndex = 1; expectedPageIndex < ONBOARDING_PAGES.length; expectedPageIndex += 1) {
			fireEvent.click(getMainButton(container, CONTINUE_BUTTON_TEXT))
			expect(getActiveIndicatorIndex(container)).toBe(expectedPageIndex)
		}

		expect(getMainButton(container, FINISH_BUTTON_TEXT)).toBeVisible()
	})

	it('main button on the last page navigates to tabs', async () => {
		fireEvent.click(getMainButton(container, SKIP_BUTTON_TEXT))
		fireEvent.click(getMainButton(container, FINISH_BUTTON_TEXT))

		expect(navigate).toHaveBeenCalledTimes(1)
		expect(navigate).toHaveBeenCalledWith(['/tabs'])
	})

	it('main button on a non-last page does not navigate to tabs', async () => {
		fireEvent.click(getMainButton(container, CONTINUE_BUTTON_TEXT))

		expect(navigate).not.toHaveBeenCalled()
	})
})
