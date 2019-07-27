import R from 'ramda'
import shuffle from 'lodash/shuffle'

export type Card = {
    manaCost: number
}
export const draw = (count: number, deck: Card[]) =>
    R.take(count, shuffle(deck))

export const card = (manaCost: number) => ({ manaCost })
export const cards = (...cs: [number, Card][]) => R.flatten(
    cs.map(([count, card]) => R.repeat(card, count)))