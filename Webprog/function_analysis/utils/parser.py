import re
from sympy import *
from sympy.parsing.sympy_parser import (
    parse_expr,
    standard_transformations,
    implicit_multiplication_application,
)

LOCALS = {
    'pi': pi, 'e': E, 'oo': oo, 'inf': oo,
    'sin': sin, 'cos': cos, 'tan': tan,
    'log': log, 'ln': log, 'exp': exp, 'sqrt': sqrt,
    'Sum': Sum
}

def parse_input(raw_input: str):
    raw_input = raw_input.strip()
    if not raw_input:
        raise ValueError("Empty input")

    # Replace ^ with **
    raw_input = raw_input.replace('^', '**')

    # Remove f(x) = part
    expr_str = raw_input
    if '=' in raw_input:
        expr_str = raw_input.split('=', 1)[1].strip()

    if not expr_str:
        raise ValueError("No expression after '='")

    # Detect variable
    var_name = 'x'
    clean = expr_str.lower()
    for word in ['exp', 'sin', 'cos', 'log', 'ln', 'sqrt', 'pi', 'e', 'sum', '∑']:
        clean = clean.replace(word, '')
    for v in ['n', 'k', 'x', 't']:
        if v in clean:
            var_name = v
            break

    # Detect type
    expr_type = 'function'
    lower = raw_input.lower()
    if 'a_' in raw_input or '_n' in raw_input or (var_name == 'n' and 'sum' not in lower and '∑' not in lower):
        expr_type = 'sequence'
    elif 'sum' in lower or '∑' in raw_input:
        expr_type = 'series'

    x = symbols(var_name)

    # Handle piecewise
    if 'if' in expr_str and ';' in expr_str:
        pieces = []
        for part in expr_str.split(';'):
            part = part.strip()
            if 'if' in part:
                e_part, c_part = part.rsplit('if', 1)
                e_parsed = parse_expr(e_part.strip(), local_dict=LOCALS, evaluate=False)
                c_parsed = parse_expr(c_part.strip(), local_dict=LOCALS, evaluate=False)
                pieces.append((e_parsed, c_parsed))
        expr = Piecewise(*pieces) if pieces else parse_expr(expr_str, local_dict=LOCALS, evaluate=False)
    else:
        # Handle series
        if expr_type == 'series':
            if '∑' in expr_str:
                inner = expr_str.replace('∑', '').strip('() ')
                expr = Sum(parse_expr(inner, local_dict=LOCALS, evaluate=False), (x, 1, oo))
            else:
                summand = parse_expr(expr_str, local_dict=LOCALS, evaluate=False)
                expr = Sum(summand, (x, 1, oo))
        else:
            expr = parse_expr(expr_str, local_dict=LOCALS, evaluate=False)

    return {
        'expression': raw_input,
        'parsed_expr': str(expr),
        'type': expr_type,
        'variable': var_name
    }