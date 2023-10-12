class Domain<T> {
    private domain: Array<T>;

    public constructor(values: Array<T>) {
        this.domain = values
    }

    public removeValueFromDomain(value: T) {
        if (this.domain.includes(value)) {
            this.domain.splice(this.domain.indexOf(value), 1);
        }
    }

    public insertValueInDomain(value: T) {
        if (!this.domain.includes(value)) {
            this.domain.push(value);
        }
    }

    public getIndexOf(value: T) {
        return this.domain.indexOf(value);
    }

    public contains(value: T) {
        return this.domain.includes(value);
    }

    public copy(): Domain<T> {
        return new Domain(this.domain);
    }

    public toArray() {
        return this.domain;
    }
}

export default Domain;