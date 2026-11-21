"""Build estático: exporta somente os arquivos públicos aprovados."""
from pathlib import Path
from html.parser import HTMLParser
from urllib.parse import urlsplit, unquote
import shutil

ROOT = Path(__file__).resolve().parents[1]
PUBLIC = ('index.html', 'styles.css', 'app.js', 'config.js', 'device-access.js', 'assets/capa.png', 'assets/capa.webp', 'assets/favicon.svg')

# USA WORK KIT: recursos locais para teste em celulares, em subdiretório isolado.
PUBLIC += ('usa-work-kit/assets/icon-180.png', 'usa-work-kit/assets/icon-192.png', 'usa-work-kit/assets/icon-512.png', 'usa-work-kit/assets/icon.svg', 'usa-work-kit/css/style.css', 'usa-work-kit/index.html', 'usa-work-kit/js/app.js', 'usa-work-kit/js/calculators.js', 'usa-work-kit/js/reports.js', 'usa-work-kit/js/storage.js', 'usa-work-kit/js/translations.js', 'usa-work-kit/manifest.webmanifest', 'usa-work-kit/sw.js')

PUBLIC += ('usa-work-kit/js/license-access.js', 'usa-work-kit/js/earnings-insights.js', 'usa-work-kit/js/earnings-insights-text.js')

PUBLIC += ('usa-work-kit/js/platform-rules-data.js', 'usa-work-kit/js/platform-rules.js', 'usa-work-kit/js/protection-timeline.js')

PUBLIC += ('usa-work-kit/js/protection-intelligence-i18n.js', 'usa-work-kit/js/platform-policy-ui.js', 'usa-work-kit/js/protection-timeline-ui.js')

# New local protection assets only; no database, fixture or secret is published.
PUBLIC += ('usa-work-kit/js/earnings.js','usa-work-kit/js/earnings-ui.js','usa-work-kit/js/v22-i18n.js','usa-work-kit/css/tokens.css','usa-work-kit/assets/brand-original.jpeg', 'usa-work-kit/js/protection-daily-i18n.js','usa-work-kit/js/protection-preventive.js','usa-work-kit/js/protection-daily-ui.js', 'usa-work-kit/js/protection-i18n.js', 'usa-work-kit/js/vault.js', 'usa-work-kit/js/protection-ui.js', 'usa-work-kit/js/protection-reports.js', 'usa-work-kit/js/vendor/pdf-lib.min.js', 'usa-work-kit/js/vendor/fontkit.umd.min.js', 'usa-work-kit/js/vendor/fflate.js', 'usa-work-kit/js/vendor/pdf-lib.LICENSE', 'usa-work-kit/js/vendor/fontkit.LICENSE', 'usa-work-kit/js/vendor/fflate.LICENSE', 'usa-work-kit/assets/DejaVuSans.ttf', 'usa-work-kit/assets/DejaVuSans.LICENSE')

class Resources(HTMLParser):
    def __init__(self):
        super().__init__()
        self.resources = []
    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        if tag in ('img', 'script') and attrs.get('src'):
            self.resources.append(attrs['src'])
        if tag == 'link' and attrs.get('href') and attrs.get('rel') != 'canonical':
            self.resources.append(attrs['href'])

def build(destination=None):
    destination = Path(destination) if destination else ROOT / 'dist'
    # Não permitir apagar diretórios arbitrários nem seguir links simbólicos.
    if destination != ROOT / 'dist':
        raise ValueError('O destino permitido é somente dist/ deste projeto')
    if destination.is_symlink():
        raise ValueError('dist não pode ser link simbólico')
    parser = Resources()
    parser.feed((ROOT / 'index.html').read_text())
    for resource in parser.resources:
        parts = urlsplit(resource)
        if parts.scheme or parts.netloc or parts.path.startswith('/') or unquote(parts.path) not in PUBLIC:
            raise ValueError(f'Recurso não permitido ou incompatível com subdiretório: {resource}')
    for name in PUBLIC:
        src = ROOT / name
        if not src.is_file() or src.is_symlink() or ROOT not in src.resolve().parents:
            raise ValueError(f'Arquivo público ausente ou não regular: {name}')
    if destination.exists():
        shutil.rmtree(destination)
    destination.mkdir()
    for name in PUBLIC:
        target = destination / name
        target.parent.mkdir(parents=True, exist_ok=True)
        shutil.copyfile(ROOT / name, target)
    (destination / '.nojekyll').write_text('')
    print(f'Build concluído: {len(PUBLIC) + 1} arquivos públicos em dist/')
    return destination

if __name__ == '__main__':
    build()
