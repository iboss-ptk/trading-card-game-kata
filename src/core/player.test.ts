import { newPlayer, drawCard } from "./player";
import { Card, card } from './card'
import 'jest-extended';

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

            expect(drawCard(2, before).hand).toIncludeAllMembers(after.hand)
            expect(drawCard(2, before).deck).toIncludeAllMembers(after.deck)
        })

        test('draw more than all card from deck', () => {
            const before = { ...newPlayer(), deck: [card(1), card(2)], hand: [] }
            const after = { ...newPlayer(), deck: [], hand: [card(1), card(2)] }

            expect(drawCard(6, before).hand).toIncludeAllMembers(after.hand)
            expect(drawCard(6, before).deck).toIncludeAllMembers(after.deck)
        })

        test('draw less than all card from deck', () => {
            const before = { ...newPlayer(), deck: [card(1), card(2), card(3)], hand: [] }
            const after = drawCard(1, before)

            expect(after.hand.length).toBe(1)
            expect(after.deck.length).toBe(2)
            expect(after.deck.concat(after.hand)).toIncludeAllMembers([card(1), card(2), card(3)])
        })

        test('draw less than all card from deck while having card in hand', () => {
            const before = { ...newPlayer(), deck: [card(1), card(2)], hand: [card(3)] }
            const after = drawCard(1, before)

            expect(after.hand.length).toBe(2)
            expect(after.hand).toContainEqual(card(3))
            expect(after.hand).toIncludeAnyMembers(before.deck)

            expect(after.deck.length).toBe(1)
            expect(after.deck.concat(after.hand)).toIncludeAllMembers(before.deck.concat(before.hand))
        })
    })
})