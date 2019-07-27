import { newGame, initialDraw, updateGameState, Action, Status } from "./game";
import { Player, newPlayer, filledMana } from './player'
import { card } from "./card";
import { expectDraw } from "./player.test";

describe('Game', () => {
    describe('preparation', () => {
        const game = newGame()

        test('each player is initialized as new player', () => {
            expect(game.activePlayer).toEqual(newPlayer())
            expect(game.opponent).toEqual(newPlayer())
        })
    })

    describe('#updateGameState', () => {
        describe('start game', () => {
            const gameState = updateGameState(Action.start())

            test('game status is PLAYING', () => {
                expect(gameState.status).toBe(Status.PLAYING)
            })

            test('from the deck each player receives 3 random cards has his initial hand', () => {
                const initialDeck = [0, 0, 1, 1, 2, 2, 2, 3, 3, 3, 3, 4, 4, 4, 5, 5, 6, 6, 7, 8]
                    .map(card)

                const initialDrawed = gameState.game

                const combineHandAndDeck = (player: Player) =>
                    player.deck.concat(player.hand)

                expect(initialDrawed.activePlayer.hand.length).toBe(3)
                expect(combineHandAndDeck(initialDrawed.activePlayer)).toIncludeSameMembers(initialDeck)

                expect(initialDrawed.opponent.hand.length).toBe(3)
                expect(combineHandAndDeck(initialDrawed.opponent)).toIncludeSameMembers(initialDeck)
            })
        })

        describe('swap turn', () => {
            describe('no change in game status', () => {
                const gameState = {
                    status: Status.PLAYING,
                    game: {
                        activePlayer: { ...newPlayer(), health: 10 },
                        opponent: { ...newPlayer(), mana: filledMana(3), hand: [], health: 11 }
                    }
                }

                const updatedGameState = updateGameState(Action.swapTurn(), gameState)

                test('game status stays as playing', () => {
                    expect(updatedGameState.status).toEqual(Status.PLAYING)
                })

                test('active player and opponent are being swapped', () => {
                    expect(updatedGameState.game.activePlayer.health).toEqual(11)
                    expect(updatedGameState.game.opponent.health).toEqual(10)
                })

                test('new active player draw 1 card from deck', () => {
                    expectDraw(1, gameState.game.opponent, updatedGameState.game.activePlayer)
                })

                test('new active player increase mana slot and fill', () => {
                    expect(updatedGameState.game.activePlayer.mana).toEqual(filledMana(4))
                })
            })

            describe('bleeding til active player dies', () => {
                const gameState = {
                    status: Status.PLAYING,
                    game: {
                        activePlayer: newPlayer(),
                        opponent: { ...newPlayer(), deck: [], health: 1 }
                    }
                }

                const updatedGameState = updateGameState(Action.swapTurn(), gameState)

                test('health of active player becomes 0', () => {
                    expect(updatedGameState.game.activePlayer.health).toBe(0)
                })

                test('game status becomes ACTIVE_PLAYER_LOSES', () => {
                    expect(updatedGameState.status).toBe(Status.ACTIVE_PLAYER_LOSES)
                })
            })

        })
    })
})