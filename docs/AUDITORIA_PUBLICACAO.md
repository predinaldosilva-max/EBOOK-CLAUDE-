# Auditoria de segurança, funcionamento e publicação

## Escopo de segurança
Em 05/11/2026, remoto confirmado como github.com/predinaldosilva-max/EBOOK-CLAUDE-, público. Fetch de todas as branches e tags; ls-remote anunciou apenas main e HEAD. Repositório não raso. Histórico anterior à auditoria: três commits, 16 blobs únicos acessíveis por essas referências, todos enumerados e inspecionados. Nenhuma branch/tag adicional acessível foi encontrada.

Não foram encontrados PDFs, ZIPs, planilhas, vídeos pagos, conteúdo integral de curso, credenciais ou links de download de produto nos arquivos versionados examinados. Foram verificadas extensões, assinaturas PDF/ZIP e padrões de chaves/tokens/segredos em todos os blobs, além de revisão dos textos, scripts, configuração e URLs. A única imagem do produto nesse histórico é a capa comercial. Não foi necessário apagar ou reescrever histórico.

Arquivos locais não versionados: diagnóstico, manifesto contendo nomes/hashes (sem o conteúdo dos materiais) e capturas da landing page. Arquivos ignorados: build e caches Python. Não são incluídos no artefato publicado. Anexos recebidos ficam fora do checkout. Nenhum material pago foi movido para o GitHub.

Limite: a auditoria abrange os objetos alcançáveis por referências Git acessíveis e arquivos locais deste checkout; não certifica objetos remotos inacessíveis, forks, caches de terceiros, configurações privadas ou inexistência universal de segredos. Não houve indício de exposição no escopo examinado.

## Artefato público
Build por lista explícita de oito arquivos: HTML, CSS, dois JavaScripts, capa WebP, capa PNG para compartilhamento, favicon e .nojekyll. Diretórios docs/, tests/, scripts/ e quaisquer arquivos de curso ficam fora do deploy. Não há formulário, analytics, chamadas à API ou dependências de produção. Configuração de pagamento contém somente valores vazios e false; não há segredo de cliente no navegador. As permissões do workflow ficam restritas aos jobs que precisam delas.

## Correções preservando design e conteúdo
- Metadados Open Graph, Twitter e URL canônica para o endereço padrão do Pages.
- Capa WebP: 90.436 bytes, contra 953.663 bytes do PNG; redução de aproximadamente 90,5% na imagem carregada pela página. O PNG é mantido para compartilhamento. Revisão visual da conversão realizada.
- Ajuste do validador do build para aceitar canonical sem tratar a URL como recurso externo carregável.
- Testes ampliados para todos os FAQs, link de salto por teclado, presença dos metadados e toque em perfis móveis.

## Testes e limites
Quatro testes unittest do build, node --check para JavaScript e git diff --check aprovados. Testes de navegador Chromium sob /EBOOK-CLAUDE-/: quatro larguras (320, 390, 768, 1440), sem transbordamento horizontal, imagens carregadas, links internos válidos, módulos, FAQs e links legais, navegação com fragmento inválido, checkout desabilitado e URLs inválidas bloqueadas; nenhum erro JavaScript/HTTP nos testes.

Perfis iPhone 13, Pixel 7 e iPad com toque emulado no Chromium. Não equivalem a execução no Safari/WebKit, aparelhos reais, Windows ou macOS. Testes físicos e leitor de tela pendentes. Acessibilidade revisada em semântica básica, foco, alt, link de salto e movimento reduzido; não constitui certificação WCAG. Revisão de WhatsApp/Facebook exige rastreadores e aparelhos reais; metadados foram adicionados, mas o resultado nesses aplicativos não foi atestado.

Rede móvel simulada: 150 ms de latência, 200.000 bytes/s de download, cache desabilitado. Os tempos são evidência local de diagnóstico, não promessa de velocidade em redes reais. Nenhuma auditoria Lighthouse ou teste de carga foi declarada.

## Checkout
Preço R$ 97 preservado; nenhum link inventado. salesEnabled=false; ambos os botões de compra permanecem desabilitados, com aviso explícito. O CTA principal leva à seção da oferta. Para integrar Kiwify depois, fornecer URL oficial e confirmar condições de entrega/suporte; configuração futura em config.js, com validação de host HTTPS. Não houve teste de compra nem entrega.

## Publicação e bloqueio
GET de Pages retornou 404. Tentativa autorizada de criar Pages via API com build_type=workflow retornou 403 “Resource not accessible by integration”. Isso é uma limitação das permissões da integração, não um erro do build. É necessária ação humana: no repositório correto, Settings → Pages → Build and deployment → Source: GitHub Actions. Depois executar o workflow “Publicar landing page no GitHub Pages” em Actions. Nenhuma alteração foi feita em outro repositório.

URL prevista: https://predinaldosilva-max.github.io/EBOOK-CLAUDE-/ . Só considerar publicada após deploy aprovado e requisição HTTPS bem-sucedida ao conteúdo correto. Neste relatório não há confirmação de publicação nem validação funcional pública concluída.

Medição local com rede simulada: 5.884 ms com PNG antes da otimização e 1.679 ms com WebP depois, incluindo espera de networkidle. Amostras isoladas, sem significância estatística e sem medição de Core Web Vitals em produção.
