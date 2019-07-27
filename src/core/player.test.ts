import { Player, newPlayer, drawCard, activate, noMana, filledMana, manaSlots } from "./player";
import { cards, card } from './card'

const expectDraw = (drawCount: number, before: Player, after: Player) => {
    expect(after.hand.length).toBe(before.hand.length + drawCount)
    expect(after.deck.length).toBe(before.deck.length - drawCount)
    expect(after.deck.concat(after.hand)).toIncludeSameMembers(before.deck.concat(before.hand))
}

describe('Player', () => {
    describe('#newPlayer', () => {
        const initialDeck = [0, 0, 1, 1, 2, 2, 2, 3, 3, 3, 3, 4, 4, 4, 5, 5, 6, 6, 7, 8].map(card)
        const player = newPlayer()

        test('player starts the game with 30 Health and 0 Mana slots', () => {
            expect(player.health).toBe(30)
            expect(player.mana).toEqual([])
        })

        test('player starts with a deck of 20 Damage cards with the following Mana costs: 0,0,1,1,2,2,2,3,3,3,3,4,4,4,5,5,6,6,7,8', () => {
            expect(player.deck).toIncludeSameMembers(initialDeck)
        })
    })

    describe('#drawCard', () => {
        const emptyHandedPlayer = { ...newPlayer(), deck: [], hand: [], }

        test('draw 0 card when deck is empty and hand is empty does nothing', () => {
            expect(drawCard(0, emptyHandedPlayer)).toEqual(emptyHandedPlayer)
        })

        test('draw more than 0 card when deck is empty and hand is empty does nothing', () => {
            expect(drawCard(2, emptyHandedPlayer)).toEqual(emptyHandedPlayer)
        })

        test('draw all the card from deck', () => {
            const before = { ...newPlayer(), deck: [card(1), card(2)], hand: [] }
            const after = { ...newPlayer(), deck: [], hand: [card(1), card(2)] }

            expect(drawCard(2, before).hand).toIncludeSameMembers(after.hand)
            expect(drawCard(2, before).deck).toIncludeSameMembers(after.deck)
        })

        test('draw more than all card from deck', () => {
            const before = { ...newPlayer(), deck: [card(1), card(2)], hand: [] }
            const after = { ...newPlayer(), deck: [], hand: [card(1), card(2)] }

            expect(drawCard(6, before).hand).toIncludeSameMembers(after.hand)
            expect(drawCard(6, before).deck).toIncludeSameMembers(after.deck)
        })

        test('draw less than all card from deck', () => {
            const before = { ...newPlayer(), deck: [card(1), card(2), card(3)], hand: [] }
            const after = drawCard(1, before)

            expect(after.hand.length).toBe(1)
            expect(after.deck.length).toBe(2)
            expect(after.deck.concat(after.hand)).toIncludeSameMembers([card(1), card(2), card(3)])
        })

        test('draw less than all card from deck while having card in hand', () => {
            const before = { ...newPlayer(), deck: [card(1), card(2)], hand: [card(3)] }
            const after = drawCard(1, before)

            expect(after.hand.length).toBe(2)
            expect(after.hand).toContainEqual(card(3))
            expect(after.hand).toIncludeAnyMembers(before.deck)

            expect(after.deck.length).toBe(1)
            expect(after.deck.concat(after.hand)).toIncludeSameMembers(before.deck.concat(before.hand))
        })
    })

    describe('#activate', () => {
        describe('receives 1 Mana slot up to a maximum of 10 total slots and filled', () => {
            test('activate new player gives 1 filled mana slot', () => {
                expect(activate(newPlayer()).mana).toEqual(filledMana(1))
            })

            test('if having half filled mana slot, add 1 and fill all of them', () => {
                const player = {
                    ...newPlayer(),
                    mana: manaSlots(
                        filledMana(1),
                        noMana(2)
                    )
                }

                expect(activate(player).mana).toEqual(filledMana(4))
            })

            test('if mana slot is 10, activation will not add more slot but still fill mana', () => {
                const player = {
                    ...newPlayer(),
                    mana: manaSlots(
                        filledMana(6),
                        noMana(4)
                    )
                }

                expect(activate(player).mana).toEqual(filledMana(10))
            })
        })

        describe('draws a random card from the deck', () => {
            test('got 1 new card from deck', () => {
                const player = newPlayer()
                expectDraw(1, player, activate(player))
            })

            test('Bleeding: take 1 damage when deck is empty', () => {
                const player = { ...newPlayer(), deck: [], health: 10 }
                expect(activate(player).health).toBe(9)
            })

            test('Bleeding: take no damage when deck is not empty', () => {
                const player = { ...newPlayer(), deck: [card(1)], health: 10 }
                expect(activate(player).health).toBe(10)
            })

            test('Overload: discard the drawed card when hand is bigger than 5 card', () => {
                const before = {
                    ...newPlayer(),
                    deck: [card(1)],
                    hand: cards(
                        [3, card(2)],
                        [2, card(3)]
                    )
                }

                const after = activate(before)

                expect(after.hand).toIncludeSameMembers(before.hand)
                expect(after.deck).toEqual([])
            })
        })
    })
})