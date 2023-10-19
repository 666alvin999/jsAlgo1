import Domain from "./domain";

type JSONPrimitives = number | string | boolean | null;
type JSONArray = JSON[];
type JSONObject = { [key: string]: JSON };
type JSON = JSONPrimitives | JSONArray | JSONObject;

class Variable<T> {

    private value: T | null;
    private readonly relatedVariables: Set<Variable<T>>;

    public constructor(private posX: number, private posY: number, private domain: Domain<T>, value?: T) {
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

    public getPosX() {
        return this.posX;
    }

    public getPosY() {
        return this.posY;
    }

    public setValue(value: T) {
        console.log(this.relatedVariables);
        this.value = value;
        Array.from(this.relatedVariables).map(variable => {
            variable.removeValueFromDomain(value);
        })
    }

    public unsetValue() {
        Array.from(this.relatedVariables).map(variable => {
            variable.insertValueInDomain(this.value!)
        });

        this.value = null;
    }

    public static fromJSON(jsonObject: JSONObject): Variable<any> {
        return new Variable(
            jsonObject["posX"] as JSONPrimitives as number,
            jsonObject["posY"] as JSONPrimitives as number,
            Domain.fromJSON(jsonObject["domain"] as JSONArray)!,
            jsonObject["value"]
        );
    }

    public toJSON(): JSONObject {
        return {
            "posX": this.posX as JSONPrimitives,
            "posY": this.posX as JSONPrimitives,
            "domain": this.domain.toJSON(),
            "value": this.value as JSONPrimitives
        };
    }

    private moreThanOneRelatedVariableHasValue(value: T) {
        return Array.from(this.relatedVariables).filter(variable => variable.getValue() === value).length > 1;
    }
}

export default Variable;