import { newGame, updateGameState, Action, Status } from "./game";
import { Player, newPlayer, filledMana, manaSlots, noMana } from './player'
import { card, cards } from "./card";
import { expectDraw } from "./player.test";
import { subtractList } from "../lib/list";
import R from 'ramda'

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

        describe('play card', () => {
            const initGameState = updateGameState(Action.start())
            test('deal damage to opponent and remove card from hand if card exists', () => {
                const gameState = R.mergeRight(
                    initGameState,
                    {
                        game: {
                            activePlayer: R.mergeRight(
                                initGameState.game.activePlayer,
                                {
                                    hand: cards([2, card(1)]),
                                    mana: filledMana(3)
                                }),
                            opponent: initGameState.game.opponent
                        }
                    }
                )
                const cardToPlay = card(1)
                const remainingHand = subtractList(gameState.game.activePlayer.hand, [cardToPlay])

                const updatedGameState = updateGameState(Action.playCard(cardToPlay), gameState)

                expect(updatedGameState.game.activePlayer.hand).toIncludeSameMembers(remainingHand)
                expect(updatedGameState.game.activePlayer.mana).toIncludeSameMembers(manaSlots(
                    filledMana(2),
                    noMana(1)
                ))
                expect(updatedGameState.game.opponent.health).toBe(gameState.game.opponent.health - cardToPlay.manaCost)
            })

            test('do nothing if card doesnt exists', () => {
                const gameState = R.mergeRight(
                    initGameState,
                    {
                        game: {
                            activePlayer: R.mergeRight(
                                initGameState.game.activePlayer,
                                {
                                    hand: cards([2, card(1)]),
                                    mana: filledMana(3)
                                }),
                            opponent: initGameState.game.opponent
                        }
                    }
                )
                const cardToPlay = card(2)
                const updatedGameState = updateGameState(Action.playCard(cardToPlay), gameState)

                expect(updatedGameState).toEqual(gameState)
            })

            test('do nothing if mana is not enough', () => {
                const gameState = R.mergeRight(
                    initGameState,
                    {
                        game: {
                            activePlayer: R.mergeRight(
                                initGameState.game.activePlayer,
                                {
                                    hand: cards([2, card(1)], [1, card(4)]),
                                    mana: filledMana(3)
                                }),
                            opponent: initGameState.game.opponent
                        }
                    }
                )
                const cardToPlay = card(4)
                const updatedGameState = updateGameState(Action.playCard(cardToPlay), gameState)

                expect(updatedGameState).toEqual(gameState)
            })

            test('swap turn if active player has no more card to play after play card', () => {
                const gameState = R.mergeRight(
                    initGameState,
                    {
                        game: {
                            activePlayer: R.mergeRight(
                                initGameState.game.activePlayer,
                                {
                                    hand: cards([1, card(1)]),
                                    mana: filledMana(3)
                                }),
                            opponent: initGameState.game.opponent
                        }
                    }
                )
                const cardToPlay = card(1)
                const updatedGameState = updateGameState(Action.playCard(cardToPlay), gameState)

                expect(updatedGameState.game.opponent.hand).toEqual([])
                expect(updatedGameState.game.activePlayer.health).toEqual(29)
            })

            test('active player win if oppenents health below or eq zero', () => {
                const gameState = R.mergeRight(
                    initGameState,
                    {
                        game: {
                            activePlayer: R.mergeRight(
                                initGameState.game.activePlayer,
                                {
                                    hand: cards([2, card(1)], [1, card(4)]),
                                    mana: filledMana(5)
                                }),
                            opponent: R.mergeRight(
                                initGameState.game.opponent, {
                                    health: 3
                                }
                            )
                        }
                    }
                )
                const cardToPlay = card(4)
                const updatedGameState = updateGameState(Action.playCard(cardToPlay), gameState)

                expect(updatedGameState.status).toEqual(Status.ACTIVE_PLAYER_WINS)
            })
        })
    })
})