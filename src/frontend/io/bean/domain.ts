type JSONPrimitives = number | string | boolean | null
type JSONArray = JSON[]
type JSONObject = {[key: string]: JSON}
type JSON = JSONPrimitives | JSONArray | JSONObject

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

    public hasValue(value: T): boolean {
        return this.domain.includes(value);
    }

    public copy(): Domain<T> {
        return new Domain(this.domain);
    }

    public toJSON(): JSONArray {
        return this.domain as JSONArray
    }

    public static fromJSON(jsonDomain: JSONArray) {
        if (
            typeof jsonDomain[0] === "number"
            || typeof jsonDomain[0] === "string"
            || typeof jsonDomain[0] === "boolean"
            || typeof jsonDomain[0] === null
        ) {
            return new Domain<typeof jsonDomain[0]>(jsonDomain);
        }
        else {
            return new Domain([]);
        }
    }
}

export default Domain;