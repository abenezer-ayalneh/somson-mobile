import '@testing-library/jest-dom/vitest'
import 'zone.js'
import 'zone.js/testing'

import { destroyPlatform } from '@angular/core'
import { getTestBed } from '@angular/core/testing'
import { BrowserTestingModule, platformBrowserTesting } from '@angular/platform-browser/testing'

const testBed = getTestBed()

// Vitest can re-run setup in the same process (watch mode / repeated runs).
// Reset and destroy existing platform first to avoid NG0400.
testBed.resetTestEnvironment()
destroyPlatform()

testBed.initTestEnvironment(BrowserTestingModule, platformBrowserTesting(), {
	errorOnUnknownElements: true,
	errorOnUnknownProperties: true,
})
