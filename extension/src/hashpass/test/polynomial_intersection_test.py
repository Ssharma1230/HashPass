import numpy as np
import sympy as sp

def find_linear_cubic_intersections_sympy(a, b, c, d, p, q):
    """
    Find real intersection points (x, y) between:
      L(x) = p*x + q  and  C(x) = a*x^3 + b*x^2 + c*x + d,
    using Sympy's symbolic solver.
    """
    x = sp.Symbol('x', real=True)

    # Define the polynomial a*x^3 + b*x^2 + (c - p)*x + (d - q)
    polynomial = a*x**3 + b*x**2 + (c - p)*x + (d - q)

    # Solve for x
    solutions = sp.solve(sp.Eq(polynomial, 0), x, dict=True)

    # Extract the x-values
    x_solutions = [sol[x] for sol in solutions]

    # Filter real solutions
    real_x_solutions = []
    for x_val in x_solutions:
        # Sympy might give a symbolic expression; let's see if it's real
        # We'll evaluate numerically and check if the imaginary part is ~ 0
        x_eval = x_val.evalf()
        if abs(x_eval.as_real_imag()[1]) < 1e-12:
            real_x_solutions.append(x_eval)

    # Compute y-values
    points = []
    for x_val in real_x_solutions:
        # Evaluate the linear function L(x) = p*x + q
        y_val = (p*x_val + q).evalf()
        points.append((x_val, y_val))

    return points

def calculate_salt_indicies(input_string):
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

    intersection_points = find_linear_cubic_intersections_sympy(cubic_constant, squared_constant, linear_constant, zeroth_constant, linear_func_slope, y_intercept_value)
    print(intersection_points)

    y_values = [pt[1] for pt in intersection_points]
    print(y_values)

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

my_string = input("Enter a string: ")
calculate_salt_indicies(my_string)

