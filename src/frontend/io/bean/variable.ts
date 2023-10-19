import Domain from "./domain";
import {JSONArray, JSONObject, JSONPrimitives} from "../../Types.ts";

class Variable<T> {

    private value: T | null;
    private readonly relatedVariables: Set<Variable<T>>;

    public constructor(private domain: Domain<T>, value?: T) {
        this.value = value ? value : null;
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

        this.value = null;
    }

    public static fromJSON(jsonObject: JSONObject): Variable<any> {
        return new Variable(
            Domain.fromJSON(jsonObject["domain"] as JSONArray)!,
            jsonObject["value"]
        );
    }

    public toJSON(): JSONObject {
        return {
            "domain": this.domain.toJSON(),
            "value": this.value as JSONPrimitives
        };
    }

    private moreThanOneRelatedVariableHasValue(value: T) {
        return Array.from(this.relatedVariables).filter(variable => variable.getValue() === value).length > 1;
    }
}

export default Variable;