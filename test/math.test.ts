import { add, multiply } from "../src/math";

describe("Pruebas matemáticas (Solo para ilustrar el funcionamiento de los tests)", () => {

    it("Multiplicar 5 por 3", () => {
        const result = multiply(5, 3);
        expect(result).toEqual(15);
    });

    it("Sumar 5 con 3", () => {
        const result = add(5, 3);
        expect(result).toEqual(8);
    });
});