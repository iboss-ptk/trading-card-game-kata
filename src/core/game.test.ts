import { newGame, initialDraw } from "./game";
import { Player, newPlayer } from './player'
import { card } from "./card";

describe('Game', () => {
    describe('preparation', () => {
        const game = newGame()

        test('each player is initialized as new player', () => {
            expect(game.activePlayer).toEqual(newPlayer())
            expect(game.opponent).toEqual(newPlayer())
        })

        test('from the deck each player receives 3 random cards has his initial hand', () => {
            const initialDeck = [0, 0, 1, 1, 2, 2, 2, 3, 3, 3, 3, 4, 4, 4, 5, 5, 6, 6, 7, 8]
                .map(card)

            const initialDrawed = initialDraw(game)

            const combineHandAndDeck = (player: Player) =>
                player.deck.concat(player.hand)

            expect(initialDrawed.activePlayer.hand.length).toBe(3)
            expect(combineHandAndDeck(initialDrawed.activePlayer)).toIncludeAllMembers(initialDeck)

            expect(initialDrawed.opponent.hand.length).toBe(3)
            expect(combineHandAndDeck(initialDrawed.opponent)).toIncludeAllMembers(initialDeck)
        })
    })
})