import '@material/web/checkbox/checkbox.js'
import type {MdDialog} from '@material/web/all.js'
import '@material/web/chips/chip-set.js'
import '@material/web/chips/filter-chip.js'
import '@material/web/select/filled-select.js'
import '@material/web/select/select-option.js'
import {withController} from '@snar/lit'
import {FormBuilder} from '@vdegenne/forms/FormBuilder.js'
import {customElement} from 'custom-element-decorator'
import {html, LitElement} from 'lit'
import {withStyles} from 'lit-with-styles'
import {query, state} from 'lit/decorators.js'
import '../card-element.js'
import {alphabets, alphabetSections, pickStrategies} from '../constants.js'
import '../material/dialog-patch.js'
import '../material/item-patch.js'
import {store} from '../store.js'
import {renderThemeElements} from '../styles/theme-elements.js'
import {themeStore} from '../styles/themeStore.js'
import styles from './settings-dialog.css?inline'

let F = new FormBuilder(store)

@customElement({name: 'settings-dialog', inject: true})
@withStyles(styles)
@withController(themeStore)
@withController(store)
export class SettingsDialog extends LitElement {
	@state() open = false

	@query('md-dialog') dialog!: MdDialog

	render() {
		return html`
			<md-dialog
				?open=${this.open}
				@closed=${() => (this.open = false)}
				style="max-width:min(100vw - 18px, 540px);width:100%;max-height:min(100vh - 12px, 950px);height:100%;"
			>
				<header slot="headline" class="select-none">
					<md-icon>settings</md-icon>
					Settings
				</header>

				<form slot="content" method="dialog" id="form" class="">
					<div>
						Welcome!<br />
						Refresh the page at any time to bring this menu back.<br />
						Use <b>Space</b> to jump onto the next character.
					</div>

					<card-element headline="Alphabet">
						${store.F.FILTER('Alphabet', 'alphabet', alphabets as any, {
							behavior: 'only-one',
						})}
						<md-divider inset></md-divider>
						${store.F.FILTER(
							'Sections',
							'alphabetSections',
							alphabetSections as any,
							{
								behavior: 'one-or-more',
								type: 'number',
							},
						)}
					</card-element>

					<card-element headline="Pick">
						${store.F.SELECT('Strategy', 'pickStrategy', pickStrategies, {
							menuPositioning: 'popover',
						})}
						${store.F.SWITCH(html`<div class="ml-2">Loop</div>`, 'loop', {
							type: 'button',
							checkbox: false,
						})}
					</card-element>

					<card-element headline="theme">
						${renderThemeElements()}
						${store.F.SWITCH('Funky', 'funky', {
							supportingText: 'Randomize on character change.',
							type: 'button',
						})}
					</card-element>
				</form>

				<div slot="actions">
					<md-filled-button form="form" autofocus>Enter</md-filled-button>
				</div>
			</md-dialog>
		`
	}

	async show() {
		if (this.dialog.open) {
			const dialogClose = new Promise((resolve) => {
				const resolveCB = () => {
					resolve(null)
					this.dialog.removeEventListener('closed', resolveCB)
				}
				this.dialog.addEventListener('closed', resolveCB)
			})
			this.dialog.close()
			await dialogClose
		}
		this.open = true
	}

	close(returnValue?: string) {
		return this.dialog.close(returnValue)
	}
}

declare global {
	interface Window {
		settingsDialog: SettingsDialog
	}
	interface HTMLElementTagNameMap {
		'settings-dialog': SettingsDialog
	}
}

export const settingsDialog = (window.settingsDialog = new SettingsDialog())
