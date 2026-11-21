# Painel administrativo — estado atual

O Worker `usa-work-kit-admin` foi publicado no endereço https://usa-work-kit-admin.pr-edinaldosilva.workers.dev/ e o proprietário confirmou o login com usuário, senha escolhida e Google Authenticator em 21/11/2026. A autenticação é própria; Cloudflare Access/Zero Trust não é necessário.

Não gerar novas credenciais. Conservar os segredos já configurados. Os quatro valores do login são ADMIN_AUTH_MODE=local, ADMIN_ORIGIN com a origem HTTPS exata, ADMIN_USER com o usuário escolhido e ADMIN_PASSWORD como Secret. ADMIN_TOTP_SECRET e ADMIN_SESSION_SECRET também são Secrets. ADMIN_PASSWORD_RECORD antigo fica ignorado quando ADMIN_PASSWORD está presente. BATCH_EXPORT_KEY é um segredo interno e não é uma senha adicional a digitar no painel.

A geração continua pausada por GENERATION_ENABLED=false até a migração 0001 e a publicação do cliente com suporte às chaves de 30 dias. A autenticação 0002 já foi aplicada. Ver IMPLANTACAO-MANUAL.md para a sequência restante.

No formulário Gerar chaves: informar quantidade, identificação opcional e Gerar lote; não há confirmação de outra senha. As confirmações de revogação/reset/recuperação permanecem porque essas ações afetam acessos existentes.

Deploy do Admin deve usar `npx wrangler deploy --config wrangler.admin.jsonc --keep-vars` para conservar as variáveis do dashboard. O aplicativo cliente usa wrangler.jsonc e continua em Worker separado.
