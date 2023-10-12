import Domain from "./domain";

class Variable<T> {

    private value: T | null;

    public constructor(private domain: Domain<T>, value?: T) {
        this.value = value ? value : null;
    }

    public getDomain() {
        return this.domain;
    }

    public getValue() {
        return this.value;
    }

    public setValue(value: T | null) {
        this.value = value;
    }
}

export default Variable;