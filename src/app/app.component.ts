import { Component, inject, OnInit } from '@angular/core'
import { IonApp, IonRouterOutlet } from '@ionic/angular/standalone'
import { addIcons } from 'ionicons'
import { moonOutline, sunnyOutline } from 'ionicons/icons'

import { Theme } from '../theme/theme'

@Component({
	selector: 'app-root',
	templateUrl: 'app.component.html',
	imports: [IonApp, IonRouterOutlet],
})
export class AppComponent implements OnInit {
	private readonly theme = inject(Theme)

	constructor() {
		addIcons({ moonOutline, sunnyOutline })
	}

	ngOnInit(): void {
		this.theme.init()
	}
}
