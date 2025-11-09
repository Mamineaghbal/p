# utils/plotter.py
import numpy as np
from sympy import lambdify, Symbol, S, oo, Sum
from sympy.calculus.util import continuous_domain
from sympy.parsing.sympy_parser import parse_expr, standard_transformations, implicit_multiplication_application
import warnings
warnings.filterwarnings('ignore')

def generate_plot_data(expr_str: str, var_name: str = 'x', expr_type: str = 'function', num_points: int = 1000):
    transformations = standard_transformations + (implicit_multiplication_application,)
    expr = parse_expr(expr_str, transformations=transformations, evaluate=False)
    x = Symbol(var_name)

    # Handle sequences
    if expr_type == 'sequence':
        n_vals = np.arange(1, 21)
        f = lambdify(x, expr, modules=['numpy'])
        y_vals = f(n_vals)
        x_clean = [float(n) for i, n in enumerate(n_vals) if np.isfinite(y_vals[i])]
        y_clean = [float(y_vals[i]) for i in range(len(n_vals)) if np.isfinite(y_vals[i])]
        return [{'x': x_clean, 'y': y_clean}]  # ← return list

    # Handle series
    if expr_type == 'series':
        if isinstance(expr, Sum):
            summand = expr.function
        else:
            summand = expr
        f = lambdify(x, summand, modules=['numpy'])
        N = 20
        n_vals = np.arange(1, N + 1)
        partial_sums = []
        total = 0.0
        for n in n_vals:
            try:
                term = f(n)
                if np.isfinite(term):
                    total += term
                else:
                    total = float('nan')
            except:
                total = float('nan')
            partial_sums.append(float(total) if np.isfinite(total) else float('nan'))
        return [{'x': n_vals.tolist(), 'y': partial_sums}]  # ← return list

    # Handle functions — split by domain intervals
    try:
        domain = continuous_domain(expr, x, S.Reals)
    except Exception:
        domain = S.Reals

    traces = []
    intervals = []

    if domain == S.EmptySet:
        pass
    elif domain.is_Interval:
        intervals = [_bound_interval(domain)]
    elif domain.is_Union:
        for sub in domain.args:
            if sub.is_Interval:
                intervals.append(_bound_interval(sub))
    else:
        intervals = [(-10, 10)]

    for a, b in intervals:
        if b <= a:
            continue
        pts = max(200, min(2000, num_points // max(1, len(intervals))))
        xs = np.linspace(a, b, pts)
        f = lambdify(x, expr, modules=['numpy'])
        try:
            ys = f(xs)
            x_clean, y_clean = [], []
            for xv, yv in zip(xs, ys):
                if np.isfinite(yv):
                    x_clean.append(float(xv))
                    y_clean.append(float(yv))
            if x_clean:
                traces.append({'x': x_clean, 'y': y_clean})
        except Exception:
            continue

    return traces if traces else [{'x': [], 'y': []}]

def _bound_interval(interval):
    a, b = interval.start, interval.end
    DEFAULT_LEFT = -10
    DEFAULT_RIGHT = 10
    a_val = DEFAULT_LEFT if a == -oo else float(a.evalf()) if a.is_finite else DEFAULT_LEFT
    b_val = DEFAULT_RIGHT if b == oo else float(b.evalf()) if b.is_finite else DEFAULT_RIGHT
    if a == -oo and b != oo:
        a_val = b_val - 20
    if b == oo and a != -oo:
        b_val = a_val + 20
    return (a_val, b_val)