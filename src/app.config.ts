import { provideHttpClient } from '@angular/common/http'
import { ApplicationConfig } from '@angular/core'
import { PreloadAllModules, provideRouter, RouteReuseStrategy, withPreloading } from '@angular/router'
import { IonicRouteStrategy, provideIonicAngular } from '@ionic/angular/standalone'
import { provideTranslateService } from '@ngx-translate/core'
import { provideTranslateHttpLoader } from '@ngx-translate/http-loader'

import { routes } from './app/app.routes'

export const appConfig: ApplicationConfig = {
	providers: [
		{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
		provideIonicAngular({
			// mode: 'ios',
		}),
		provideRouter(routes, withPreloading(PreloadAllModules)),
		provideHttpClient(),
		provideTranslateService({
			loader: provideTranslateHttpLoader({
				prefix: './assets/i18n/',
				suffix: '.json',
			}),
			fallbackLang: 'en',
			// 	TODO: Add default language from user preference
		}),
	],
}
