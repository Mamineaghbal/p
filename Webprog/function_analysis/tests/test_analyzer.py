def test_analyze_simple():
    from utils import parser, analyzer
    parsed = parser.parse_input("x**2")
    res = analyzer.analyze(parsed)
    assert 'derivative' in res
