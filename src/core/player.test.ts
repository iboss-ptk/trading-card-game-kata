import { Player, newPlayer, initialPlayerDraw } from "./player";
import { Card } from './card'

describe('Player', () => {
    describe('#newPlayer', () => {
        const initialDeckManaCosts = [0, 0, 1, 1, 2, 2, 2, 3, 3, 3, 3, 4, 4, 4, 5, 5, 6, 6, 7, 8]
        const player = newPlayer()

        test('player starts the game with 30 Health and 0 Mana slots', () => {
            expect(player.health).toBe(30)
            expect(player.mana).toEqual([])
        })

        test('player starts with a deck of 20 Damage cards with the following Mana costs: 0,0,1,1,2,2,2,3,3,3,3,4,4,4,5,5,6,6,7,8', () => {
            const deckManaCosts = (deck: Card[]) => deck.map(card => card.manaCost).sort()
            expect(deckManaCosts(player.deck)).toEqual(initialDeckManaCosts)
        })
    })

    describe('#initialPlayerDraw', () => {
        test('from the deck player receives 3 random cards has his initial hand', () => {
            const initialDeckManaCosts = [0, 0, 1, 1, 2, 2, 2, 3, 3, 3, 3, 4, 4, 4, 5, 5, 6, 6, 7, 8]
            const drawedPlayer = initialPlayerDraw(newPlayer())

            const combineHandAndDeck = (player: Player) =>
                player.deck
                    .concat(player.hand)
                    .map(card => card.manaCost)
                    .sort()

            expect(drawedPlayer.hand.length).toBe(3)
            expect(combineHandAndDeck(drawedPlayer)).toEqual(initialDeckManaCosts)
        })
    })
})