import {withController} from '@snar/lit'
import {css, html} from 'lit'
import {withStyles} from 'lit-with-styles'
import {customElement} from 'lit/decorators.js'
import {store} from '../store.js'
import {PageElement} from './PageElement.js'

declare global {
	interface HTMLElementTagNameMap {
		'page-main': PageMain
	}
}

@customElement('page-main')
@withController(store)
@withStyles(css`
	:host {
	}
`)
export class PageMain extends PageElement {
	render() {
		return html`<!---->
			<div
				class="absolute inset-0 flex items-center justify-center overflow-hidden cursor-none"
			>
				<span
					class="jp"
					style="font-size:var(--font-size, 24px);font-weight:var(--font-weight, 400);bottom:var(--font-bottom-offset-px, 40px);"
					>${store.currentCharacter}</span
				>
			</div>
			<!----> `
	}
}

// export const pageMain = new PageMain();
