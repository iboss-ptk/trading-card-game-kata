import { draw } from "./card";
import { subtractList } from '../lib/list'

describe('Card', () => {
    describe('#draw', () => {
        test('draw nothing from empty deck results in no card', () => {
            expect(draw(0, [])).toEqual([])
        })

        test('draw something from empty deck results in no card', () => {
            expect(draw(1, [])).toEqual([])
        })

        test('draw n card from non-empty deck results in n random card from deck', () => {
            const deck = [
                { manaCost: 0 },
                { manaCost: 1 },
                { manaCost: 2 },
                { manaCost: 3 },
            ]
            const cards = draw(2, deck)

            expect(cards.length).toBe(2)
            expect(subtractList(deck, cards).length).toEqual(deck.length - cards.length)
        })
    })
})