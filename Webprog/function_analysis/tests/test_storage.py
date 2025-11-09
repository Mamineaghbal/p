def test_storage_roundtrip():
    from utils import storage
    fid = storage.save_function("x**2", "x**2", "function", "x", "R")
    fn = storage.get_function(fid)
    assert fn and fn['expression'] == "x**2"
