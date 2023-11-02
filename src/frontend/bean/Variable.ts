import Domain from "./Domain.ts";
import {JSONArray, JSONPrimitives} from "../Types.ts";

export type JSONVariable = {
    domain: JSONArray
    value?: JSONPrimitives
}

class Variable<T> {

    private readonly domain: Domain<T>;
    private value?: T;
    private readonly relatedVariables: Set<Variable<T>>;

    public constructor(domain: Domain<T>, value?: T) {
        this.domain = domain;
        this.value = value;
        this.relatedVariables = new Set<Variable<T>>();
    }

    public removeValueFromDomain(value: T) {
        this.domain.removeValueFromDomain(value);
    }

    public insertValueInDomain(value: T) {
        this.domain.insertValueInDomain(value);
    }

    public getDomain(): Domain<T> {
        return this.domain;
    }

    public getRelatedVariables() {
        return this.relatedVariables;
    }

    public getValue() {
        return this.value;
    }

    public setValue(value: T) {
        this.value = value;
    }

    public unsetValue() {
        this.value = undefined;
    }

    public isSet(): boolean {
        return typeof this.value !== "undefined";
    }

    public toJSON(): JSONVariable {
        const result: JSONVariable = {
            domain: this.domain.toJSON() as JSONArray
        }
        if (this.isSet()) {
            result.value = this.value as JSONPrimitives | undefined;
        }
        return result;
    }

    public static fromJSON<T extends JSONPrimitives>(json: JSONVariable): Variable<T> {
        let validationOk = typeof json === "object" && "domain" in json;

        if (validationOk && Domain.validateJSON(json.domain)) {
            const domain = new Domain(json.domain) as unknown as Domain<T>;

            return new Variable(domain);
        }

        throw new Error(`Unexpected JSONVariable object: ${JSON.stringify(json)}`);
    }

}

export default Variable;