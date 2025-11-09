def test_parse_simple():
    from utils import parser
    out = parser.parse_input("f(x)=x**2")
    assert 'sympy_expr' in out
