import { evaluate, sqrt, multiply, subtract, polynomialRoot } from 'mathjs';

function convertFirstFourToAscii(inputString: string): number[] {
    // Slice the first 4 characters
    const firstFour = inputString.slice(0, 4);

    // Convert each character to its ASCII decimal value
    const asciiValues = firstFour.split('').map(char => char.charCodeAt(0));

    console.log(`String entered: ${inputString}`);
    console.log(`First 4 characters: ${firstFour}`);
    console.log("ASCII decimal equivalents:", asciiValues);

    return asciiValues;
}

function solveCubicEquation(a: number, b: number, c: number, d: number): number[] {
    // Solve the cubic equation using math.js
    const roots = polynomialRoot(d,c,b,a);

    // Filter out non-real roots
    return roots.filter((r) => typeof r === 'number');
}

function findIntersectionsCubicLine(a: number, b: number, c: number, d: number, p: number, q: number): [number, number][] {
    // Form the cubic equation: a*x^3 + b*x^2 + (c - p)*x + (d - q) = 0
    const roots = solveCubicEquation(a, b, c - p, d - q);

    // Compute intersection points
    return roots.map(x => [x, p * x + q]); // Line equation: y = p*x + q
}

function solveQuadraticEquation(a: number, b: number, c: number): number[] {
    const discriminant = subtract(multiply(b, b), multiply(4, multiply(a, c)));

    if (evaluate(`${discriminant} < 0`)) {
        return []; // No real roots
    } else if (evaluate(`${discriminant} == 0`)) {
        return [evaluate(`-(${b}) / (2 * ${a})`)]; // One real root
    } else {
        const sqrtD = sqrt(discriminant) as number;
        return [
            evaluate(`(-${b} + ${sqrtD}) / (2 * ${a})`),
            evaluate(`(-${b} - ${sqrtD}) / (2 * ${a})`)
        ];
    }
}

function calculateIntersectionPoints(inputString: string): number[] {
    const asciiVals = convertFirstFourToAscii(inputString);

    const cubicConstant = asciiVals[0];
    const squaredConstant = asciiVals[1];
    const linearConstant = asciiVals[2];
    const zerothConstant = asciiVals[3];

    // Compute derivatives
    const cubicDerivative = cubicConstant * 3;
    const squaredDerivative = squaredConstant * 2;
    const linearDerivative = linearConstant * 1;

    // Compute the discriminant
    const discriminantDividend = ((squaredDerivative ** 2) - (4 * cubicDerivative * linearConstant)) * -1;
    const discriminantDivisor = 4 * cubicDerivative;
    const quotient = discriminantDividend / discriminantDivisor;

    const linearFuncSlope = Math.floor(quotient) + 1;

    // Find roots of the derivative equation
    const roots = solveQuadraticEquation(cubicDerivative, squaredDerivative, linearDerivative - linearFuncSlope);
    console.log("Roots of derivative equation:", roots);

    const yInterceptRange: number[] = [];
    roots.forEach(root => {
        const evaluatedConstant = (cubicConstant * (root ** 3)) + (squaredConstant * (root ** 2)) + (linearConstant * root) + zerothConstant - (linearFuncSlope * root);
        yInterceptRange.push(evaluatedConstant);
    });

    const yInterceptValue = (yInterceptRange[0] + yInterceptRange[1]) / 2.0;

    console.log(`Linear function: l(x) = ${linearFuncSlope}x + ${yInterceptValue}`);

    const intersectionPoints = findIntersectionsCubicLine(cubicConstant, squaredConstant, linearConstant, zerothConstant, linearFuncSlope, yInterceptValue);
    console.log("Intersection points:", intersectionPoints);

    return intersectionPoints.map(point => point[1]);
}

function calculateSaltIndices(yValues: number[]): number[] {
    if (yValues.length < 3) return [];

    const index1 = Math.abs(Math.floor(yValues[0])) % 10;
    const index2 = Math.abs(Math.floor(yValues[1])) % 10;
    const index3 = Math.abs(Math.floor(yValues[2])) % 10;

    return [index1, index2, index3];
}


export const CalculateSalts = async (input_text: string): Promise<number[]> => {
    const intersection_y_values = calculateIntersectionPoints(input_text);
    const salt_indicies = calculateSaltIndices(intersection_y_values)
    console.log(salt_indicies)
    return salt_indicies;
}