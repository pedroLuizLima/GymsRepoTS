export class MaxNumberOfCheckInsError extends Error {
    constructor() {
        super('Max number of check-ins today were exceeded.')
    }
}