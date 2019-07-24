import R from 'ramda'

export const subtractList = <T>(minuened: T[], subtrahened: T[]) => {
    let _minuened: T[] = R.clone(minuened)
    let _subtrahended: T[] = R.clone(subtrahened)

    _subtrahended.forEach(elem => {
        const index = R.indexOf(elem, _minuened)
        if (index !== -1) {
            _minuened.splice(index, 1)
        }
    })

    return _minuened
}