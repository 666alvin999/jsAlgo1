import Variable from "../bean/variable.ts";

class SillySolver<T> {

    public* gt(variables: Array<Variable<T>>) {
        if (variables.length === 0) {
            yield [];
        } else {
            for (let value of variables[0].getDomain().getDomain()) {
                let test;

                do {
                    test = this.gt([...variables.slice(0,1), ...variables.slice(1)]).next();
                    yield [value, ...test.value];
                } while (!test.done)
            }
        }
    }

}

export default SillySolver;