/* vite only */
export const DEV = import.meta.env.DEV

export const availablePages = ['main', 'search'] as const
// true as AllValuesPresent<Page, typeof availablePages>

export type PickStrategy = 'In order' | 'Random all' | 'Pure randomness'
export const pickStrategies: PickStrategy[] = [
	'In order',
	'Random all',
	'Pure randomness',
] as const

export const alphabets = ['hiragana', 'katakana'] as const
export type Alphabet = (typeof alphabets)[number]

export const alphabetSections = [
	'Basic',
	'Dakuten/handakuten',
	'Youon',
	'Youon dakuten/handakuten',
] as const
export type AlphabetSection = 0 | 1 | 2 | 3
