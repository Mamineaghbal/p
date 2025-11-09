from flask import Flask, render_template, request, redirect, url_for, flash
from utils.parser import parse_input
from utils.analyzer import analyze_function
from utils.plotter import generate_plot_data
from utils.storage import (
    save_function,
    get_all_functions,
    get_function_by_id,
    delete_function as delete_function_db,
    update_function
)

app = Flask(__name__)
app.secret_key = 'mathemagical'

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/functions')
def function_list():
    functions = get_all_functions()
    return render_template('function_list.html', functions=functions)

@app.route('/functions/new', methods=['GET', 'POST'])
def new_function():
    if request.method == 'POST':
        try:
            definition = request.form['definition']
            ftype = request.form.get('type', 'function')
            domain_from = request.form.get('domain_from', 'ℝ')
            domain_to = request.form.get('domain_to', 'ℝ')

            parsed = parse_input(definition)
            fid = save_function({
                'expression': definition,
                'parsed_expr': parsed['parsed_expr'],
                'type': ftype,
                'variable': parsed['variable'],
                'domain': 'ℝ',
                'domain_from': domain_from,
                'domain_to': domain_to
            })
            flash('Function saved!', 'success')
            return redirect(url_for('function_list'))
        except Exception as e:
            flash(f'Error: {e}', 'error')
            return render_template('new_function.html')
    return render_template('new_function.html')

@app.route('/functions/<int:func_id>/edit', methods=['GET', 'POST'])
def edit_function(func_id):
    func = get_function_by_id(func_id)
    if not func:
        flash('Function not found.', 'error')
        return redirect(url_for('function_list'))
    if request.method == 'POST':
        data = {
            'expression': request.form['definition'],
            'type': request.form['type'],
            'domain_from': request.form['domain_from'],
            'domain_to': request.form['domain_to']
        }
        try:
            parsed = parse_input(data['expression'])
            data['parsed_expr'] = parsed['parsed_expr']
            data['variable'] = parsed['variable']
        except Exception as e:
            flash(f'Parse error: {e}', 'error')
            return render_template('edit_function.html', func=func)
        update_function(func_id, data)
        flash('Updated!', 'success')
        return redirect(url_for('function_list'))
    return render_template('edit_function.html', func=func)

@app.route('/functions/<int:func_id>/delete', methods=['POST'])
def delete_function(func_id):
    delete_function_db(func_id)
    flash('Deleted.', 'success')
    return redirect(url_for('function_list'))

@app.route('/analyze')
def analyze_selector():
    functions = get_all_functions()
    return render_template('analyze_selector.html', functions=functions)

@app.route('/analyze/<int:func_id>')
def analysis(func_id):
    func = get_function_by_id(func_id)
    if not func:
        flash('Function not found.', 'error')
        return redirect(url_for('analyze_selector'))
    results = analyze_function(func.parsed_expr, func.variable, func.type)
    return render_template('analysis.html', func=func, results=results)

@app.route('/educational/<int:func_id>')
def educational(func_id):
    func = get_function_by_id(func_id)
    if not func:
        flash('Function not found.', 'error')
        return redirect(url_for('analyze_selector'))
    results = analyze_function(func.parsed_expr, func.variable, func.type, educational_mode=True)
    return render_template('educational.html', func=func, results=results)

@app.route('/graph/<int:func_id>')
def graph(func_id):
    func = get_function_by_id(func_id)
    if not func:
        flash('Function not found.', 'error')
        return redirect(url_for('function_list'))
    plot_data = generate_plot_data(
        expr_str=func.parsed_expr,
        var_name=func.variable,
        expr_type=func.type
    )
    return render_template('graph.html', func=func, plot_data=plot_data)

@app.route('/canvas')
def canvas():
    functions = get_all_functions()
    all_traces = []
    for func in functions:
        try:
            traces = generate_plot_data(
                expr_str=func.parsed_expr,
                var_name=func.variable,
                expr_type=func.type
            )
            all_traces.extend(traces)
        except Exception:
            continue
    return render_template('canvas.html', plot_data=all_traces)

if __name__ == '__main__':
    app.run(debug=True)