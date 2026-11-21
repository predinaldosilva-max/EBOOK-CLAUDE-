# Correção do loop na abertura do login

O Worker encaminhava `/login` ao binding ASSETS como `/login.html`. A configuração HTML padrão do Cloudflare converte `/login.html` em um redirecionamento 307 para `/login`. Assim, cada abertura produzia outra resposta para a mesma URL, terminando em ERR_TOO_MANY_REDIRECTS. O problema era do código administrativo, não da chave do cofre, dos cookies ou dos segredos configurados pelo proprietário.

Reprodução com o serviço real de arquivos do Miniflare/workerd, sem servidor estático simulado: antes da correção, GET `/login` devolvia `307 Location: /login`. Depois da correção, devolve `200` com o HTML do formulário. `/login.html` pode fazer um único redirecionamento normal para `/login`, que termina em 200.

Correção mínima: `localAuthRoute` encaminha a requisição canônica original ao binding ASSETS, sem reescrever sua URL. Nenhuma credencial, tabela, licença, cliente, finança, criptografia ou chave de recuperação é alterada. Os valores cadastrados no Cloudflare continuam válidos.

O helper de integração e dos navegadores usa agora o serviço real de arquivos do Miniflare, com `run_worker_first=true` e roteamento HTML padrão. A simulação anterior lia arquivos diretamente do disco e não reproduzia os redirecionamentos canônicos da infraestrutura. Foram acrescentadas verificações explícitas de três aberturas consecutivas do login, conteúdo HTML e ausência de redirecionamento para a própria página.

Publicação: atualizar somente o commit fixado no Build command do Worker `usa-work-kit-admin`, salvar e executar Retry build. Manter o Deploy command com `--keep-vars`, as oito variáveis existentes e `GENERATION_ENABLED=false`. Não aplicar SQL adicional nem gerar outra configuração privada. Confirmar login, saída e nova entrada depois da implantação. Não restaurar o D1 nem reverter ao commit anterior com o loop; se necessário, desativar somente o painel administrativo até corrigir.

Referência oficial do comportamento de HTML: https://developers.cloudflare.com/workers/static-assets/routing/advanced/html-handling/
