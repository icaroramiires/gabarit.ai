import { randomUUID } from 'crypto';

export class UniqueEntityID {
    private value: string;

    constructor(id?: string) {
        this.value = id ? id : randomUUID();
    }

    public toString() {
        return this.value;
    }

    public toValue() {
        return this.value;
    }

    public equals(id: UniqueEntityID): boolean {
        if (id === null || id === undefined) {
            return false;
        }
        if (!(id instanceof this.constructor)) {
            return false;
        }
        return id.toValue() === this.value;
    }
}
