# Resultados de validação

Executado no Chromium headless deste ambiente com Playwright, em 05/11/2026.

Passou:
- Larguras 320, 390, 768 e 1440 px sem transbordamento horizontal.
- Uma imagem de capa presente e carregada.
- Um H1 e 12 módulos presentes.
- Destinos de todos os links internos existentes.
- Expansão do primeiro módulo.
- Abertura da seção de privacidade pelo rodapé e dos termos por URL com fragmento.
- Dois checkouts desabilitados na configuração inicial.
- URLs de domínio não autorizado e protocolo inseguro mantêm os botões desabilitados.
- Zero erros JavaScript e zero respostas HTTP >= 400 no teste.
- Sintaxe app.js/config.js validada com node --check; git diff --check sem erros.
- Capturas finais geradas em previa-desktop.png e previa-celular.png; inspeção visual realizada nas capturas anteriores ao ajuste pontual de setas e texto da biblioteca.

Não executado / pendente:
- Compra, pagamento, cancelamento, entrega e autorização real nas plataformas: links oficiais ausentes.
- Execução dos projetos e testes do curso: arquivos ausentes.
- Reprodução de MP4, validação de links externos do curso e de funcionalidades nativas em conta Claude.
- Safari, Firefox, aparelhos reais e leitores de tela. Emulação de viewport não equivale a testar um celular físico.
- Auditoria completa de acessibilidade: há HTML semântico, foco visível, link de salto, acordeões nativos, texto alternativo e respeito à preferência de movimento reduzido; isso não comprova conformidade integral.
- Hospedagem e domínio públicos. Nenhum deploy foi feito.

A implementação é estática, sem etapa de compilação. Validação de sintaxe não substitui o teste em navegador, que também foi executado.

Os testes podem ser repetidos com o servidor local ativo e `node tests/browser.cjs`. Playwright e Chromium são ferramentas do ambiente; não há dependências de produção.

## Etapa GitHub Pages
- Build Python concluído e repetível: sete arquivos públicos em dist/.
- Quatro testes unittest passaram: lista exata do artefato, identidade com fontes, rejeição de destino arbitrário e ausência de arquivos internos/pagos no artefato.
- Verificação de sintaxe de JavaScript executada.
- Build servido localmente sob /EBOOK-CLAUDE-/ para testar recursos relativos como no endereço do repositório.
- Corrigido tratamento de fragmento malformado para impedir URIError na navegação; incluído caso no teste de navegador.
- Leitura Git remota e identificação do repositório validadas. A API informou repositório privado. Consultas de Pages e permissões de Actions retornaram 403 por limitação da integração.
