import numpy as np
import sympy as sp


def find_intersections_cubic_line(a, b, c, d, p, q, tol=1e-12):
    # Form the cubic equation: a*x^3 + b*x^2 + (c - p)*x + (d - q) = 0
    poly_coeffs = [a, b, c - p, d - q]

    # Solve for x (returns up to 3 roots, possibly complex)
    roots = np.roots(poly_coeffs)

    # Filter real roots based on tiny imaginary parts
    real_roots = [r.real for r in roots if abs(r.imag) < tol]

    # For each real root, compute y from the linear function
    intersections = []
    for x_val in real_roots:
        y_val = p * x_val + q  # or a*x_val^3 + b*x_val^2 + c*x_val + d — they should match
        intersections.append((x_val, y_val))

    return intersections

def calculate_intersection_points(input_string):
    '''cubic_constant = int(input("Cubic constant: "))
    squared_constant = int(input("Squared constant: "))
    linear_constant = int(input("Linear constant: "))
    zeroth_constant = int(input("Zeroth constant: "))'''

    ascii_vals = convert_first_four_to_ascii(input_string)

    cubic_constant = ascii_vals[0]
    squared_constant = ascii_vals[1]
    linear_constant = ascii_vals[2]
    zeroth_constant = ascii_vals[3]

    # Finds the constants of the derivative of the difference function
    differencefunc_poly_cubic_derivative = cubic_constant * 3
    differencefunc_poly_squared_derivative = squared_constant * 2
    differencefunc_poly_linear_derivative = linear_constant * 1

    # Calculates the slope value 'a' using the discriminant of the derivative of the difference function
    discriminant_dividend = ((differencefunc_poly_squared_derivative ** 2) - (4 * differencefunc_poly_cubic_derivative * linear_constant)) * -1
    discriminant_divisor = 4 * differencefunc_poly_cubic_derivative
    quotient = discriminant_dividend / discriminant_divisor

    linear_func_slope = int(quotient) + 1

    # Find the roots of the derivative of the difference function
    difference_func_derivative_coeffs = [differencefunc_poly_cubic_derivative, differencefunc_poly_squared_derivative, (differencefunc_poly_linear_derivative-linear_func_slope)]
    print(difference_func_derivative_coeffs)
    roots = np.roots(difference_func_derivative_coeffs)
    print(roots)

    y_intercept_range = []
    for root in roots:
        evaluated_constant = (cubic_constant * (root ** 3)) + (squared_constant * (root ** 2)) + (linear_constant * (root)) + zeroth_constant - (linear_func_slope * root)
        y_intercept_range.append(evaluated_constant)

    y_intercept_value = (y_intercept_range[0] + y_intercept_range[1]) / 2.0


    linear_intercept_function = f"l(x) = {linear_func_slope}x + {y_intercept_value}"
    print(linear_intercept_function)

    #intersection_points = find_linear_cubic_intersections_sympy(cubic_constant, squared_constant, linear_constant, zeroth_constant, linear_func_slope, y_intercept_value)
    intersection_points = find_intersections_cubic_line(cubic_constant, squared_constant, linear_constant, zeroth_constant, linear_func_slope, y_intercept_value)
    print(intersection_points)

    y_values = [pt[1] for pt in intersection_points]
    for value in y_values:
        print(value)

    return y_values

def convert_first_four_to_ascii(input_string):
    # Slice the first 4 characters
    first_four = input_string[:4]
    
    # Convert each character to its ASCII decimal value using ord()
    ascii_values = [ord(char) for char in first_four]
    
    # Print the results
    print(f"String entered: {input_string}")
    print(f"First 4 characters: {first_four}")
    print("ASCII decimal equivalents:", ascii_values)
    return ascii_values

def calculate_salt_indicies(y_values):
    index_1 = int(y_values[0]) % 10
    index_2 = int(y_values[1]) % 10
    index_3 = int(y_values[2]) % 10

    salt_indicies = [index_1, index_2, index_3]
    return salt_indicies


    

if __name__ == "__main__":
    my_string = input("Enter a string: ")
    intersection_y_values = calculate_intersection_points(my_string)
    salt_indicies = calculate_salt_indicies(intersection_y_values)
    print("Salt indexes: "+str(salt_indicies))

