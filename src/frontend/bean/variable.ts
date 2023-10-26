import Domain from "./domain.ts";
import {JSONArray, JSONPrimitives} from "../Types.ts";

export type JSONVariable = {
    domain: JSONArray
    value?: JSONPrimitives
}

class Variable<T> {

    private value?: T;
    private readonly relatedVariables: Set<Variable<T>>;

    public constructor(private domain: Domain<T>, value?: T) {
        this.value = value;
        this.relatedVariables = new Set<Variable<T>>();
    }

    public removeValueFromDomain(value: T) {
        this.domain.removeValueFromDomain(value);
    }

    public insertValueInDomain(value: T) {
        if (!this.moreThanOneRelatedVariableHasValue(value)) {
            this.domain.insertValueInDomain(value);
        }
    }

    public getDomain() {
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

        Array.from(this.relatedVariables).map(variable => {
            variable.removeValueFromDomain(value);
        });
    }

    public unsetValue() {
        Array.from(this.relatedVariables).map(variable => {
            variable.insertValueInDomain(this.value!)
        });

        this.value = undefined;
    }

    public isSet(): boolean {
        return typeof this.value !== "undefined"
    }

    toJSON(): JSONVariable {
        const result: JSONVariable = {
            domain: this.domain.toJSON() as JSONArray
        }
        if (this.isSet()) {
            result.value = this.value as JSONPrimitives | undefined;
        }
        return result
    }

    static fromJSON<T extends JSONPrimitives>(json: JSONVariable): Variable<T> {
        let validationOk = typeof json === "object" && "domain" in json
        if (validationOk && Domain.validateJSON(json.domain)) {
            const domain = new Domain(json.domain) as unknown as Domain<T>
            return new Variable(domain)
        }
        throw new Error(`Unexpected JSONVariable object: ${JSON.stringify(json)}`)
    }

    private moreThanOneRelatedVariableHasValue(value: T) {
        return Array.from(this.relatedVariables).filter(variable => variable.getValue() === value).length > 1;
    }
}

export default Variable;