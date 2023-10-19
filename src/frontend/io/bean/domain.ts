import {JSONArray, JSONPrimitives} from "../../Types.ts";

class Domain<T> {
    private readonly domain: Set<T>;

    public constructor(values: Set<T>) {
        this.domain = values
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

    public copy(): Domain<T> {
        return new Domain(this.domain);
    }

    public toJSON(): JSONArray {
        return Array.from(this.domain) as JSONArray
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

            return new Domain<T>(new Set(jsonDomain as Array<T>));
        }
    }
}

export default Domain;