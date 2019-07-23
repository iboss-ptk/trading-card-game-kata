import { start, Card, initialDraw } from "./game";

describe('Game', () => {
    describe('preparation', () => {
        const game = start()

        test('each player starts the game with 30 Health and 0 Mana slots', () => {
            expect(game.activePlayer.health).toBe(30)
            expect(game.activePlayer.mana).toEqual([])

            expect(game.opponent.health).toBe(30)
            expect(game.opponent.mana).toEqual([])
        })

        test('each player starts with a deck of 20 Damage cards with the following Mana costs: 0,0,1,1,2,2,2,3,3,3,3,4,4,4,5,5,6,6,7,8', () => {
            const initialDeckManaCosts = [0, 0, 1, 1, 2, 2, 2, 3, 3, 3, 3, 4, 4, 4, 5, 5, 6, 6, 7, 8]
            const deckManaCosts = (deck: Card[]) => deck.map(card => card.manaCost).sort()

            expect(deckManaCosts(game.activePlayer.deck)).toEqual(initialDeckManaCosts)
            expect(deckManaCosts(game.opponent.deck)).toEqual(initialDeckManaCosts)
        })

    })
})