# v2.2.5 — abertura no iOS e preservação dos cofres

## Causa comprovada da tela branca

O manifest da v2.2.4 iniciava em `./index.html`. O host de produção redireciona esse endereço para `/` (observado também no navegador de verificação). `Cache.addAll` seguia o redirecionamento; o service worker devolvia a resposta armazenada, com `redirected=true`, para navegações. Safari pode rejeitar essa resposta com a mensagem relatada pelo usuário: `Response served by service worker has redirections`.

O novo teste `tests/pwa-navigation.test.mjs` falhou três vezes contra o código anterior pela propriedade `redirected=true`. A correção passou nas três repetições. Isso comprova a falha de navegação; não comprova a origem de uma falha AES-GCM no cofre do usuário.

## Correção mínima

- Início canônico em `./`, preservando o identificador anterior `./index.html` no manifest para não criar outra identidade no Android.
- Cópia das respostas de navegação bem-sucedidas do mesmo domínio remove o histórico de redirecionamentos, preservando conteúdo e cabeçalhos. Respostas redirecionadas para outro domínio não são convertidas em conteúdo confiável.
- Normalização das duas entradas HTML durante a instalação do cache. URLs antigas `/index.html` continuam atendidas.
- Consultas usam somente o cache estático da versão atual.
- Nenhuma alteração em IndexedDB, localStorage, criptografia, chaves, donos de registros, acesso, licenciamento, backend ou D1. A limpeza de caches atinge apenas caches de arquivos estáticos anteriores, como já ocorria.

## Validação

Três execuções locais completas de `npm test`: cada uma com 135 testes principais aprovados, 39 testes base de cálculo, 26 grupos de qualidade e integração financeira. Quatro testes de build Python aprovados. O fluxo de CI repete essas verificações e executa os testes nativos antes da publicação.

`tests/pwa-browser.cjs` acrescenta três rodadas por motor (WebKit/Chromium): host com redirecionamento real, cache antigo, tentativa de reabertura, atualização sem limpar dados, reabertura em três URLs, mesma chave e ocorrência fictícia, HTML com servidor indisponível e isolamento entre contextos. `tests/vault-browser-upgrade.cjs` mantém 12 jornadas de atualização desde 2.2.2. Artefatos e resultados finais ficam no workflow da revisão #15. Nenhum teste usa a chave secreta ou os documentos do usuário.

## Recuperação sem excluir dados

Para uma instalação que ainda usa o cache antigo, o teste abre a raiz do mesmo domínio com `?pwa-recovery=2.2.5`, que não coincide com a chave HTML problemática do cache antigo. O service worker pode então atualizar. Esse procedimento precisa ocorrer no contexto afetado; abrir no navegador externo não garante atualizar o armazenamento da instalação de tela inicial do iPhone.

Não limpar dados do Safari, excluir o app ou criar outro cofre como tratamento desta falha. Preservar uma cópia cifrada do cofre bloqueado antes de qualquer substituição.

## Limitações e confirmação física

WebKit automatizado não equivale a executar no iPhone físico ou reproduzir a separação de armazenamento de todas as versões do iOS. A confirmação final é: abrir pelo ícone, entrar, desbloquear o cofre correspondente, fechar totalmente e reabrir com a mesma chave. Repetir no Android. A validação de acesso continua exigindo internet; o teste de HTML com conexões do servidor interrompidas não promete acesso autenticado offline. O controle de rede `setOffline` do Playwright/WebKit retornou erro interno ao navegar; a jornada usa interrupção real das conexões do servidor e registra essa limitação. Modo avião no iPhone físico continua sendo validação manual.

Um cofre criado novamente tem uma chave própria. Não existe sincronização automática entre Safari, navegador interno e app instalado. Uma chave de outro cofre não deve autenticar o atual. O erro anterior de autenticação do usuário permanece sem causa comprovada; esta publicação não é apresentada como recuperação de um cofre cuja chave não autentica.

## Fontes técnicas

- https://developers.cloudflare.com/workers/static-assets/routing/advanced/html-handling/
- https://developer.mozilla.org/en-US/docs/Web/API/Response/Response
- https://bugs.webkit.org/show_bug.cgi?id=190041
- https://developer.chrome.com/docs/capabilities/pwa-manifest-id

## Recuperação da versão

Branch `backup-production-before-v2.2.5`: commit `c48a66570fddef060a505a6e0217eb57d4aa4937`. Restaurar o código anterior não exige nem autoriza apagar os dados locais. Não publicar novamente o service worker defeituoso como solução da tela branca.
