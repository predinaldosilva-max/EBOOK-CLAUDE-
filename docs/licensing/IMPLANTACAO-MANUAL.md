# Finalização pelo dashboard Cloudflare

## Situação confirmada em 21/11/2026

- Cliente comercial: usa-work-kit, versão 2.2.6, base 7f189f6ae6d5033ebc3a01203539b9e051eaf5d6.
- Admin publicado em https://usa-work-kit-admin.pr-edinaldosilva.workers.dev/; login próprio confirmado pelo proprietário. Sem Access/Zero Trust e sem novas credenciais necessárias.
- D1 usa-work-kit-db, binding DB; contagem original confirmada pelo proprietário: 50 licenças, uma de teste, nenhuma desativada.
- Migração administrativa 0002 já executada. Migração 0001 de lotes/validade ainda pendente.
- GENERATION_ENABLED=false. Não liberar antes da atualização do cliente.
- Candidato completo 2.3.0-rc1 preparado; não confundir testes locais/CI com publicação.

## 1. Preservar dados e preparar o banco

Guardar uma exportação privada do banco pelo dashboard, quando disponível. Não enviar dump, hashes ou segredos ao chat/GitHub. Guardar backups locais financeiros e cifrados do aparelho usado nos testes. Não apagar armazenamento nem reinstalar a PWA.

No D1 → usa-work-kit-db → Console, executar somente migrations/0001_temporary_licenses.sql. Esse arquivo cria quatro tabelas novas e três índices. Não contém ALTER, UPDATE ou DELETE. Não executar schema.sql, fixtures ou reseed em produção.

Conferir o resultado e as contagens de licenses. Em ambiente com Wrangler autenticado, scripts/licensing-snapshot.py faz fotografia privada antes/depois de todas as colunas das licenças e informa somente contagem de linhas alteradas/ausentes. Sem acesso autenticado daqui, essa comparação privada não foi declarada realizada.

## 2. Publicar o aplicativo atualizado

Somente depois da migração e dos testes aprovados. Worker usa-work-kit, mesmo banco e endereço. Fazer deploy do candidato revisado com `npx wrangler deploy --config wrangler.jsonc --keep-vars`. Não alterar RATE_SECRET, ADMIN_TOKEN ou qualquer segredo do cliente.

Previews da configuração candidata apontam a um identificador fictício isolado, nunca ao D1 comercial. Sem banco de preview real, um preview deve falhar fechado; isso não impede o deploy normal de produção.

Conferir no endereço publicado os arquivos novos, versão e validação legada antes de liberar geração. Não tentar chaves antigas de compradores em outro aparelho. A licença de teste mantém sua regra original.

## 3. Publicar a interface simples do Admin

Worker usa-work-kit-admin; configuração wrangler.admin.jsonc; comando `npx wrangler deploy --config wrangler.admin.jsonc --keep-vars`. Não substituir o projeto cliente e não regenerar credenciais. A atualização simplifica a orientação de geração; não solicita outra senha no painel.

## 4. Liberar geração e testar uma chave

No Admin Settings → Runtime variables and secrets, editar GENERATION_ENABLED de false para true e escolher Deploy. Somente depois dos passos anteriores.

Entrar no painel, quantidade 1, Gerar lote. Copiar a chave e testar em instalação de teste. A validade começa apenas na primeira ativação e dura 720 horas. Segunda instalação deve ser recusada. Não mudar datas no banco real para simular vencimento; esses cenários são testados em D1 isolado.

Verificar renovação no mesmo aparelho preservando dados financeiros/cofre/chave original, exportação e comportamento no iPhone/Android. As 50 legadas permanecem sem vencimento e somente leitura no novo Admin.

## Contenção

GENERATION_ENABLED=false pausa novos lotes sem interromper a validação das chaves já emitidas. Depois de emitir temporárias, não restaurar o validador/frontend 2.2.6: ele não conhece vencimento e continuidade do proprietário. Corrigir aditivamente, conservar as tabelas e nunca importar um dump sobre ativações legítimas sem avaliação.
