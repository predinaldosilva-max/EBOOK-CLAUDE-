# Restrição de interface e prévia local

## Regra aprovada
Smartphones e tablets: apresentação normal. Desktops e notebooks: tela informando “Esta página está disponível exclusivamente para dispositivos móveis. Acesse pelo seu smartphone para conhecer o Claude Masterclass.” A tela esclarece que tablets também são aceitos e que a identificação do navegador pode ser contornada.

`device-access.js` executa no head antes de exibir o conteúdo comercial. Usa identificação Android/iPhone/iPad/tablet, o sinal mobile do navegador quando disponível e a combinação Macintosh com múltiplos pontos de toque para iPadOS em modo desktop. Largura da janela não autoriza acesso. Um computador Windows com tela sensível ao toque não é classificado como tablet apenas por ter toque. Navegadores incomuns podem ser classificados incorretamente.

Não há senha, IP pessoal, token ou parâmetro de acesso administrativo. O arquivo config.js, os links de checkout e o código de compra não foram alterados. O build inclui somente os nove arquivos públicos explicitamente permitidos, sem PDF/ZIP pago.

## Seu MacBook: prévia local
No Terminal, dentro da cópia deste repositório no seu MacBook:

```sh
git pull --ff-only
python3 scripts/build.py
python3 -m http.server 8000 --bind 127.0.0.1 --directory dist
```

Abra **http://127.0.0.1:8000/** no navegador do próprio MacBook. Encerre o servidor com Control+C. É necessário ter Git e Python 3 disponíveis no Mac. Use sua cópia existente; se não tiver uma, clone somente predinaldosilva-max/EBOOK-CLAUDE- para uma nova pasta vazia. A máquina da sessão na nuvem e o MacBook são máquinas diferentes: o servidor precisa ser iniciado no MacBook para abrir nesse endereço nele.

A exceção é apenas para localhost/loopback, não para o endereço público nem para IP da rede local. Não há identificação secreta do seu aparelho: qualquer pessoa com uma cópia local também pode abrir essa cópia. Não há autenticação administrativa no site público. Isso preserva o acesso de desenvolvimento sem publicar credenciais.

## Limites explícitos
GitHub Pages entrega os arquivos estáticos a qualquer cliente. A regra oculta a apresentação comercial no navegador identificado como desktop; ela não protege arquivos ou impede download. User-Agent pode ser falsificado, o JavaScript/CSS pode ser modificado e a cópia pública do código continua acessível. Parâmetros de URL não concedem acesso. Sem execução bem-sucedida do script, a interface mantém a tela restrita por padrão, inclusive em aparelhos móveis.

Para regras antes da entrega seriam necessários servidor/proxy ou camada de borda; identificação do tipo de aparelho ainda não é prova de identidade. Acesso administrativo público protegido exige autenticação real. Nenhuma dessas mudanças adicionais foi feita.

## Testes executados
- Build Python: quatro testes de integridade aprovados; nove arquivos públicos.
- Sintaxe de device-access.js verificada; workflow atualizado para verificá-la também.
- Chromium: 12 cenários com origem pública simulada e recursos do build local: iPhone, Android, iPad, tablet Android, Windows Chrome, Windows Edge com toque, macOS Safari, macOS Chrome, desktop com janela estreita, desktop com parâmetro de URL, MacBook em loopback e iPadOS em modo desktop. Todos aprovados.
- Conteúdo comercial e aviso aparecem de forma mutuamente exclusiva. Nos cenários permitidos, capa carregada e checkout permanece desabilitado conforme configuração original. Nenhum erro JavaScript nos cenários.
- Origem pública simulada não é teste do endereço publicado. Perfis Safari/macOS/Windows são identificações emuladas no Chromium/Linux, não execução nos navegadores/sistemas reais.
- Safari/WebKit real, iPhone/Android físicos e Windows/macOS reais permanecem pendentes.
