import { subtractList } from './list'

describe('List', () => {
    describe('#subtractList', () => {
        test('returns [] when both args are []', () => {
            expect(subtractList([], [])).toEqual([])
        })

        test('removes elements that exists in the second list from the first list', () => {
            expect(subtractList([1, 2, 3, 4], [, 3])).toEqual([1, 2, 4])
        })

        test('equality determines by value not reference', () => {
            expect(subtractList([{ a: 1 }, { a: 2 }], [{ a: 1 }])).toEqual([{ a: 2 }])
        })

        test('all elements are removed once per existance in second list regardless of duplication', () => {
            expect(subtractList([1, 1, 1, 2, 3], [1, 1, 3])).toEqual([1, 2])
        })
    })
})