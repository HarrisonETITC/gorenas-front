export class InvalidFormItemDefaultValueException extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'InvalidFormItemDefaultValueException';
    }
}