# GitHub Pages — publicação

## Estrutura
HTML/CSS/JavaScript estáticos. Sem Next.js, servidor de aplicação, dependências de produção ou etapa de instalação. Python 3 monta o artefato; Node valida a sintaxe JavaScript. O design e a configuração vazia de pagamento foram preservados.

## Build local
Na raiz do repositório:

```sh
python3 scripts/build.py
python3 -m unittest discover -s tests -p 'test_*.py' -v
node --check app.js
node --check config.js
python3 -m http.server 8000 --bind 127.0.0.1 --directory dist
```

O build gera oito arquivos: index.html, styles.css, app.js, config.js, assets/capa.png, assets/capa.webp, assets/favicon.svg e .nojekyll. A WebP otimizada é usada na página; PNG é mantida para compartilhamento social. É uma lista explícita: arquivos novos não entram automaticamente. PDFs, ZIPs, credenciais, anexos, documentação e testes não são publicados pelo workflow. Não selecione publicação da raiz por branch.

Todos os recursos são relativos, compatíveis com `/EBOOK-CLAUDE-/`, sem configuração de base de framework. Nenhuma URL de pagamento foi adicionada; salesEnabled permanece false.

## Fluxo GitHub
O workflow `.github/workflows/pages.yml` executa após push em main ou acionamento manual. Valida JavaScript, constrói e testa o artefato, envia apenas dist/ e publica pelo ambiente github-pages. O job de deploy possui somente pages:write e id-token:write; o checkout usa contents:read. Não requer token pessoal no código.

No repositório **predinaldosilva-max/EBOOK-CLAUDE-**, abrir Settings → Pages → Build and deployment → Source → GitHub Actions. Se necessário, permitir GitHub Actions em Settings → Actions → General. Depois executar o workflow “Publicar landing page no GitHub Pages” pela aba Actions. Verificar a execução concluída e a URL mostrada no job de deploy.

**Registro da etapa anterior:** o repositório era privado. Na auditoria atual, a API confirmou visibilidade pública. No GitHub Free, Pages requer repositório público; Pages para repositório privado depende de plano elegível. Não foi alterada a visibilidade. Antes de tornar o repositório público, revisar todo o conteúdo e histórico, pois a visibilidade afeta mais que o artefato do site. Manter materiais pagos, dados internos e segredos fora de um repositório público. O checkout local inicial possui apenas README no commit de origem, mas isso não substitui uma revisão completa do histórico remoto e das configurações da conta.

Endereço padrão esperado, após deploy bem-sucedido e sem domínio personalizado:
https://predinaldosilva-max.github.io/EBOOK-CLAUDE-/
Isso não é confirmação de publicação.

## Validação manual depois do deploy
Abrir a URL informada pelo GitHub em Android/Chrome, iPhone/Safari e tablet; conferir leitura, toque, zoom e orientação. Testar também Safari e Firefox desktop e leitor de tela. A emulação em Chromium não comprova compatibilidade com todos esses aparelhos. Conferir HTTPS e ausência de erros no console em produção.

## Checkout futuro e limitações comerciais
config.js reserva Hotmart/Kiwify, com URLs vazias e vendas desabilitadas. A configuração de Kiwify não faz parte desta etapa. O botão principal mantém navegação para a oferta; a compra só deve ser habilitada quando houver URL oficial, condições comerciais, entrega e suporte confirmados. A página pode ser apresentada publicamente como prévia, mas não como compra funcional.

## Estado observado nesta entrega
Código e workflow enviados à main. Build local e build remoto aprovados. Deploy não concluído: a API de deploy retornou 404 com orientação para habilitar GitHub Pages. A URL esperada retornou 404. Na auditoria atual, a visibilidade pública foi confirmada. Para continuar: habilitar Pages com Source = GitHub Actions e executar novamente o workflow. A tentativa de ativação pela integração retornou HTTP 403; essa configuração precisa ser feita pelo responsável no GitHub.
