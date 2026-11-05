import importlib.util
from pathlib import Path
import unittest

ROOT = Path(__file__).resolve().parents[1]
spec = importlib.util.spec_from_file_location('site_build', ROOT / 'scripts/build.py')
module = importlib.util.module_from_spec(spec)
spec.loader.exec_module(module)

class BuildTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.output = module.build()
    def test_exact_public_artifact(self):
        actual = {p.relative_to(self.output).as_posix() for p in self.output.rglob('*') if p.is_file()}
        self.assertEqual(actual, set(module.PUBLIC) | {'.nojekyll'})
    def test_output_matches_source(self):
        for name in module.PUBLIC:
            with self.subTest(name=name):
                self.assertEqual((ROOT / name).read_bytes(), (self.output / name).read_bytes())
    def test_reject_arbitrary_destination(self):
        with self.assertRaises(ValueError):
            module.build(ROOT / 'docs')
    def test_no_paid_or_internal_files(self):
        self.assertFalse(any(p.suffix.lower() in {'.pdf', '.zip', '.bat', '.command', '.py', '.md'} for p in self.output.rglob('*')))

if __name__ == '__main__':
    unittest.main()
