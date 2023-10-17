import Domain from "./domain";

type JSONPrimitives = number | string | boolean | null;
type JSONArray = JSON[];
type JSONObject = {[key: string]: JSON};
type JSON = JSONPrimitives | JSONArray | JSONObject;

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

    public setValue(value: T) {
        this.value = value;
    }

    public unsetValue() {
        this.value = null;
    }

    public static fromJSON(jsonObject: JSONObject) {
        return new Variable(
            Domain.fromJSON(jsonObject["domain"] as JSONArray),
            jsonObject["value"]
        );
    }

    public toJSON(): JSONObject {
        return {
            "domain": this.domain.toJSON(),
            "value": this.value as JSONPrimitives
        };
    }
}

export default Variable;