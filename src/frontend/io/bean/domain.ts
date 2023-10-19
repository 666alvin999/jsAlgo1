import {JSONArray, JSONPrimitives} from "../../Types.ts";

class Domain<T> {
    private readonly domain: Array<T>;

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

    public hasValue(value: T): boolean {
        return this.domain.includes(value);
    }

    public copy(): Domain<T> {
        return new Domain(this.domain);
    }

    public toJSON(): JSONArray {
        return this.domain as JSONArray
    }

    public static fromJSON<T extends JSONPrimitives>(jsonDomain: JSONArray) {
        let validationOk: boolean = Array.isArray(jsonDomain);

        if (jsonDomain.length > 0) {
            const type = typeof jsonDomain[0];

            validationOk = jsonDomain.reduce(
                (acc: boolean, element: unknown) => {
                    return acc && typeof element !== type
                },
                true
            )

            if (!validationOk) {
                throw new Error("At least one element does not have the same type as the other")
            }

            return new Domain<T>(jsonDomain as Array<T>);
        }
    }
}

export default Domain;