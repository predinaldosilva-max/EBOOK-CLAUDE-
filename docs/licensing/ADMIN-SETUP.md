# Etapa 1 — gerador separado

Base: 2.2.6, commit 7f189f6ae6d5033ebc3a01203539b9e051eaf5d6.

Este branch adiciona somente o Worker administrativo, seus recursos, migração aditiva ainda não aplicada e testes. O código do aplicativo cliente, seu Worker, schema original e configuração de produção permanecem idênticos à base. Não converter, ativar, resetar ou modificar as 50 chaves existentes.

Cloudflare: novo projeto Worker `usa-work-kit-admin`, branch `admin/generator-setup`, diretório raiz `/`, sem comando de build adicional, deploy `npx wrangler deploy --config wrangler.admin.jsonc`. Usar o mesmo repositório; não substituir o projeto usa-work-kit.

Geração bloqueada por padrão: manter GENERATION_ENABLED=false até as etapas finais. O Worker responde fechado sem as configurações de autenticação, sem segredos em frontend e sem credencial administrativa fixa.

Variáveis necessárias no Admin: ACCESS_TEAM_DOMAIN, ACCESS_AUD, ADMIN_ORIGIN, ADMIN_EMAILS (segredo), BATCH_EXPORT_KEY (segredo de 32 bytes em base64), GENERATION_ENABLED. Binding DB aponta ao banco existente usa-work-kit-db. Nenhum valor real de segredo está no código.

A configuração Access deve restringir os emails do proprietário. O backend verifica assinatura RS256, emissor, audiência, validade e allowlist. Operações de alteração exigem origem exata, JSON e cabeçalho próprio.

A migração cria apenas tabelas/índices novos e será aplicada depois da proteção/conferência dos registros existentes. Não aplicar durante a criação inicial do painel.

A geração de chaves de 32 caracteres não deve ser liberada comercialmente com o cliente 2.2.6: ele ainda usa o formato legado. A integração de validade, renovação e continuidade dos dados está no candidato completo 2.3.0-rc1; será publicada somente após a conferência final. As licenças antigas continuarão sem vencimento.

Esta etapa pode criar um endereço Admin que responde configuração incompleta enquanto faltam binding, autenticação e migração. Isso é falha fechada, não gerador liberado. Não remover verificações para contornar essa condição.

Rollback desta etapa: desativar o novo Worker Admin; como nenhum código cliente nem registro de licença foi alterado, a aplicação existente permanece funcionando. Depois de emitir chaves temporárias na etapa final, não reverter o validador para uma versão que desconheça vencimento.
