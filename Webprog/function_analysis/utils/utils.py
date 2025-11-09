from sympy import parse_expr, symbols
from sympy import latex

def render_latex(expr_str):
    """Render a string as LaTeX using SymPy."""
    try:
        expr = parse_expr(expr_str, evaluate=False)
        return latex(expr)
    except:
        return expr_str

def format_domain(domain_obj):
    """Format domain object to human-readable string."""
    if hasattr(domain_obj, 'as_relational'):
        return str(domain_obj.as_relational('x'))
    return str(domain_obj)

def safe_eval(expr_str, var_name='x'):
    """Safely evaluate expression at a point."""
    try:
        x = symbols(var_name)
        expr = parse_expr(expr_str, evaluate=False)
        return lambda val: expr.subs(x, val).evalf()
    except:
        return lambda val: float('nan')