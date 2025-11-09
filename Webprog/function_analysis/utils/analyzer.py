# utils/analyser.py — Add sequence/series analysis
from sympy import *
from sympy.calculus.util import continuous_domain
from sympy.series.series import series

def analyze_function(expr_str, var_name, expr_type='function', educational_mode=False):
    x = symbols(var_name)
    expr = parse_expr(expr_str, evaluate=False)
    results = {}

    # Shared: Form & Domain
    results['form'] = latex(expr)
    try:
        if expr_type == 'function':
            domain = continuous_domain(expr, x, S.Reals)
        else:  # sequence/series: domain is natural numbers
            domain = Interval(1, oo, left_open=False, right_open=True)  # n ≥ 1
        results['domain'] = str(domain)
    except Exception as e:
        results['domain'] = f"Error: {e}"

    # Type-specific analysis
    if expr_type == 'sequence':
        # a_n analysis
        try:
            # Limit as n→∞
            lim = limit(expr, x, oo)
            results['limit'] = latex(lim) if lim.is_finite else "Diverges"
        except:
            results['limit'] = "Unknown"

        try:
            # Monotonicity: check a_{n+1} - a_n
            next_term = expr.subs(x, x + 1)
            diff = simplify(next_term - expr)
            if diff.is_positive:
                results['monotony'] = "Increasing"
            elif diff.is_negative:
                results['monotony'] = "Decreasing"
            else:
                results['monotony'] = "Not monotonic"
        except:
            results['monotony'] = "Unknown"

        # Arithmetic/Geometric?
        try:
            # Arithmetic: a_{n+1} - a_n = constant
            d = simplify(expr.subs(x, x+1) - expr)
            if d.is_number:
                results['type'] = f"Arithmetic (d = {latex(d)})"
            else:
                # Geometric: a_{n+1}/a_n = constant
                r = simplify(expr.subs(x, x+1) / expr)
                if r.is_number and r != 0:
                    results['type'] = f"Geometric (r = {latex(r)})"
                else:
                    results['type'] = "Neither"
        except:
            results['type'] = "Unknown"

        # Extrema (for sequences: min/max over n≥1)
        results['extrema'] = "Check first few terms"

    elif expr_type == 'series':
        # ∑ a_n analysis
        summand = expr.function if isinstance(expr, Sum) else expr
        results['summand'] = latex(summand)

        try:
            # Convergence
            conv = expr.is_convergent() if isinstance(expr, Sum) else None
            if conv is True:
                results['convergence'] = "Converges"
            elif conv is False:
                results['convergence'] = "Diverges"
            else:
                results['convergence'] = "Unknown"
        except:
            results['convergence'] = "Unknown"

        try:
            # Sum (if convergent)
            if isinstance(expr, Sum):
                s = expr.doit()
                results['sum'] = latex(s) if s.is_finite else "No closed form"
            else:
                results['sum'] = "Not a Sum object"
        except:
            results['sum'] = "Cannot compute"

        # Reuse sequence analysis on summand
        seq_results = analyze_function(str(summand), var_name, 'sequence')
        results['summand_analysis'] = seq_results

    else:
        # Original function analysis (your existing code here)
        # ... (keep all your function analysis logic)
        pass

    return results