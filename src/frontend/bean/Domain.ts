import {JSONArray, JSONPrimitives} from "../Types.ts";

class Domain<T> {
    private readonly domain: Set<T>;

    public constructor(values: T[]) {
        this.domain = new Set(values)
    }

    public removeValueFromDomain(value: T) {
        this.domain.delete(value);
    }

    public insertValueInDomain(value: T) {
        this.domain.add(value);
    }

    public hasValue(value: T): boolean {
        return this.domain.has(value);
    }

    public getDomain() {
        return this.domain;
    }

    public copy(): Domain<T> {
        return new Domain(Array.from(this.domain));
    }

    public toJSON(): T[] {
        const result: T[] = []
        for (const v of this.domain) {
            result.push(v)
        }
        return result
    }

    public static validateJSON(json: unknown): json is JSONPrimitives[] {
        if (Array.isArray(json) && json.length > 0) {
            const type = typeof json[0]
            const validationOk: boolean = json.reduce(
                (acc: boolean, element: unknown) => acc && typeof element !== type,
                true
            )
            if (!validationOk) {
                return false
            }
        }
        return true
    }

    public static fromJSON<T extends JSONPrimitives>(json: JSONArray): Domain<T> {
        if (Domain.validateJSON(json)) {
            return new Domain<T>(json as T[])
        }
        throw new Error(`At least one element do not have the same type as the other`)
    }
}

export default Domain;