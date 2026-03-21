import { CommonModule } from '@angular/common'
import { Component, computed, inject, signal } from '@angular/core'
import { FormsModule } from '@angular/forms'
import { Router } from '@angular/router'
import { IonButton, IonButtons, IonContent, IonIcon, IonText } from '@ionic/angular/standalone'
import { TranslatePipe, TranslateService } from '@ngx-translate/core'
import { addIcons } from 'ionicons'
import { arrowForwardOutline, checkmarkDoneOutline } from 'ionicons/icons'

import { Theme } from '../../../theme/theme'
import { ONBOARDING_PAGES } from './onboarding.constant'

@Component({
	selector: 'app-onboarding',
	templateUrl: './onboarding.page.html',
	styleUrls: ['./onboarding.page.scss'],
	standalone: true,
	imports: [IonContent, CommonModule, FormsModule, IonButton, IonIcon, TranslatePipe, IonButtons, IonText],
})
export class OnboardingPage {
	protected readonly theme = inject(Theme)

	protected readonly translateService = inject(TranslateService)

	protected readonly router = inject(Router)

	protected readonly activePageIndex = signal<number>(0)

	protected readonly ONBOARDING_PAGES = ONBOARDING_PAGES

	protected readonly isLastPage = computed(() => this.activePageIndex() === this.ONBOARDING_PAGES.length - 1)

	constructor() {
		addIcons({ arrowForwardOutline, checkmarkDoneOutline })
	}

	protected async actionButtonClick() {
		if (this.activePageIndex() < this.ONBOARDING_PAGES.length - 1) {
			this.changePageTo(this.activePageIndex() + 1)
		} else {
			await this.router.navigate(['/tabs'])
		}
	}

	protected changePageTo(pageIndex: number) {
		this.activePageIndex.set(pageIndex)
	}

	protected skip() {
		this.changePageTo(this.ONBOARDING_PAGES.length - 1)
	}
}
