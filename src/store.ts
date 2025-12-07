import {PropertyValues, ReactiveController, state} from '@snar/lit'
import {FormBuilder} from '@vdegenne/forms/FormBuilder.js'
import {alphabet, AlphabetEntry} from '@vdegenne/japanese'
import {saveToLocalStorage} from 'snar-save-to-local-storage'
import {
	Alphabet,
	AlphabetSection,
	availablePages,
	PickStrategy,
} from './constants.js'
import {themeStore} from './styles/themeStore.js'
import {getRandomColor, playPronunciation} from './utils.js'

@saveToLocalStorage('japanese-alphabet-practice:store')
export class AppStore extends ReactiveController {
	@state() page: Page = 'main'
	@state() pickStrategy: PickStrategy = 'In order'
	@state() alphabet: Alphabet = 'hiragana'
	@state() alphabetSections: AlphabetSection[] = [0]
	@state() currentCharacter = ''
	@state() fontSizePx = 800
	@state() fontWeight = 400
	@state() fontBottomOffsetPx = 0
	@state() loop = false
	@state() funky = false

	F = new FormBuilder(this)

	firstUpdated() {
		this.reset()
	}

	protected updated(changed: PropertyValues<this>) {
		// const {hash, router} = await import('./router.js')
		if (changed.has('page')) {
			// import('./router.js').then(({router}) => {
			// 	router.hash.$('page', this.page)
			// })
			const page = availablePages.includes(this.page) ? this.page : '404'
			import(`./pages/page-${page}.ts`)
				.then(() => {
					console.log(`Page ${page} loaded.`)
				})
				.catch(() => {})
		}

		if (changed.has('fontSizePx')) {
			document.documentElement.style.setProperty(
				'--font-size',
				`${this.fontSizePx}px`,
			)
		}
		if (changed.has('fontWeight')) {
			document.documentElement.style.setProperty(
				'--font-weight',
				`${this.fontWeight}`,
			)
		}
		if (changed.has('fontBottomOffsetPx')) {
			document.documentElement.style.setProperty(
				'--font-bottom-offset-px',
				`${this.fontBottomOffsetPx}px`,
			)
		}
	}

	getAllCharCandidates() {
		const entries = Object.entries(alphabet)
		const sections = entries.filter((_, i) =>
			store.alphabetSections.includes(i as AlphabetSection),
		)
		const candidates = sections.flatMap(([_, values]) => values)
		return candidates
	}

	#hasntLoopedYet = true

	characters: AlphabetEntry[] = []
	loadNextCharacter() {
		const previous = this.currentCharacter
		if (this.characters.length === 0) {
			if (!this.loop && !this.#hasntLoopedYet) {
				this.currentCharacter = ''
				return
			}
			this.characters = this.getAllCharCandidates()
			this.#hasntLoopedYet = false
		}
		let character: AlphabetEntry
		switch (this.pickStrategy) {
			case 'In order':
				character = this.characters[0]!
				this.characters.splice(0, 1)
				break
			case 'Random all':
				const index = Math.floor(Math.random() * this.characters.length)
				character = this.characters[index]!
				this.characters.splice(index, 1)
				break
			case 'Pure randomness':
				const characters = this.getAllCharCandidates()
				character = characters[Math.floor(Math.random() * characters.length)]!
				break
			default:
				throw new Error('Unknown strategy')
		}
		if (character) {
			playPronunciation(character)
			if (this.funky && previous !== '') {
				themeStore.themeColor = getRandomColor()
			}
			this.currentCharacter =
				character[store.alphabet === 'hiragana' ? 'hira' : 'kata']
		}
	}

	reset() {
		this.currentCharacter = ''
		this.characters = []
		this.#hasntLoopedYet = true
	}
}

export const store = new AppStore()
