import { start } from "./game";

describe('Game', () => {
    describe('preparation', () => {
        const game = start()

        test('each player starts the game with 30 Health and 0 Mana slots', () => {
            if (game.state === 'PLAYING') {
                expect(game.activePlayer.health).toBe(30)
                expect(game.activePlayer.mana).toEqual([])

                expect(game.opponent.health).toBe(30)
                expect(game.opponent.mana).toEqual([])
            } else {
                fail(`state must be 'PLAYING' but got ${game.state}`)
            }
        })
    })
})