import {cquerySelector} from 'html-vision'
import toast from 'toastit'
import {DEV} from './constants.js'
import {getSettingsDialog, openSettingsDialog} from './imports.js'
import {store} from './store.js'

const inputNames = ['INPUT', 'TEXTAREA', 'MD-FILLED-TEXT-FIELD']
export function eventIsFromInput(event: Event) {
	return (event.composedPath() as HTMLElement[]).some((el) => {
		return (
			inputNames.includes(el.tagName) || el.hasAttribute?.('contenteditable')
		)
	})
}

window.addEventListener('keydown', async (event: KeyboardEvent) => {
	if (DEV) {
		console.log(event)
	}
	if (event.ctrlKey) {
		return
	}

	if (eventIsFromInput(event)) {
		return
	}

	const button = cquerySelector(`[key="${event.key}"]`)
	if (button) {
		button?.click()
		return
	}

	switch (event.key) {
		case 'd':
			// ;(await getThemeStore()).toggleMode()
			break
		case ' ':
			if ((await getSettingsDialog()).open) return
			store.loadNextCharacter()
			break

		case 'r':
			store.reset()
			break

		case 's':
			openSettingsDialog()
			break

		case '-':
			if (!event.altKey) {
				store.fontSizePx -= 10
				// toast(store.fontSizePx)
			} else {
				store.fontWeight -= 10
				if (store.fontWeight < 100) {
					store.fontWeight = 100
				}
				// toast(store.fontWeight)
			}
			break
		case '=':
			if (!event.altKey) {
				store.fontSizePx += 10
				// toast(store.fontSizePx)
			} else {
				store.fontWeight += 10
				if (store.fontWeight > 900) {
					store.fontWeight = 900
				}
				// toast(store.fontWeight)
			}
			break
		case 'ArrowUp':
			store.fontBottomOffsetPx += 10
			break
		case 'ArrowDown':
			store.fontBottomOffsetPx -= 10
			break
	}
})

export {}
