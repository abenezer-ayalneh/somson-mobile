import { Component, inject } from '@angular/core'
import { IonButton, IonIcon } from '@ionic/angular/standalone'

import { Theme } from '../../theme/theme'

@Component({
	selector: 'app-explore-container',
	templateUrl: './explore-container.component.html',
	styleUrls: ['./explore-container.component.scss'],
	imports: [IonButton, IonIcon],
})
export class ExploreContainerComponent {
	protected readonly theme = inject(Theme)
}
