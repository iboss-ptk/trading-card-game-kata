import R from 'ramda'
import shuffle from 'lodash/shuffle'

export type Card = {
    manaCost: number
}
export const draw = (count: number, deck: Card[]) =>
    R.take(count, shuffle(deck))