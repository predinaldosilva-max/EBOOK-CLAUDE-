# Usuário, senha própria e Google Authenticator

O proprietário escolhe `ADMIN_USER` e uma senha de 16 a 256 caracteres em `ADMIN_PASSWORD` (tipo **Secret**). `ADMIN_TOTP_SECRET` (tipo **Secret**) continua sendo a chave do Google, nunca o código de seis números. Nenhum desses valores pertence às plataformas de delivery ou ao cofre dos clientes.

## Compatibilidade e segurança

Quando ADMIN_PASSWORD existe, o backend a usa como fonte da senha escolhida pelo proprietário, recebida apenas em Secret do Cloudflare. O verificador PBKDF2-HMAC-SHA256/100.000 iterações é derivado no servidor, com sal determinístico derivado do segredo de sessão e do usuário, e mantido apenas em cache limitado do isolate. Não há cadastro manual de ADMIN_PASSWORD_RECORD nesse modo. O valor antigo de ADMIN_PASSWORD_RECORD pode permanecer: é ignorado enquanto a nova senha estiver definida. Uma nova senha vazia ou inválida bloqueia, sem fallback silencioso para a antiga.

Se ADMIN_PASSWORD não existe, o modo anterior continua funcionando com ADMIN_PASSWORD_RECORD. Continuam iguais: TOTP com prevenção de replay, rate limit, cookie HttpOnly/Secure/SameSite, CSRF e origem, 30 minutos de sessão e invalidação por alteração de credenciais. Não armazenar senha em D1 nem frontend público. Trocar a senha não altera segredo de lotes, vínculo de dispositivos, licença, cofre ou dados financeiros.

As variáveis técnicas existentes devem ser preservadas: ADMIN_AUTH_MODE, ADMIN_ORIGIN, ADMIN_SESSION_SECRET, BATCH_EXPORT_KEY, GENERATION_ENABLED. Não são etapas de cadastro de novas senhas pelo usuário. Não remover esses valores nem substituí-los para tentar corrigir login. A geração comercial continua false até a integração final de 30 dias.

## Assistente local

`admin/acesso-simples.html` funciona salvo no computador. O usuário digita seu nome e sua senha. Somente a chave do Google é criada, uma vez, sem alterar a senha. QR Code é calculado integralmente no navegador; não usa sites externos. Não existe teste de códigos dependente do relógio do Mac: Google e servidor verificam o código no login. O QR contém somente o URI TOTP, não a senha.

A cópia privada `USA-WORK-KIT-ACESSO-ADMIN.json` preserva os três valores para reabertura. O assistente também lê a cópia anterior completa, conferindo internamente a senha e o verificador antes de importá-la. Não transmite o arquivo nem altera o Cloudflare. Guardar também a cópia antiga com os outros segredos técnicos. Sem a cópia correta, não é possível inferir qual chave Google está no servidor: a troca de ADMIN_TOTP_SECRET é manual e autorizada pelo proprietário.

## Publicação e operação

Depois dos testes, publicar só o Worker Admin com o commit testado e `npx wrangler deploy --config wrangler.admin.jsonc --keep-vars`. No Cloudflare, adicionar ADMIN_PASSWORD como Secret, preservar ADMIN_USER escolhido e manter/atualizar ADMIN_TOTP_SECRET para a mesma chave do QR usado pelo Google. Não precisa reaplicar SQL, mudar as 50 licenças ou refazer todas as variáveis. O login do cliente continua inalterado.

Rollback do código: remover o novo ADMIN_PASSWORD somente se houver uma configuração anterior conhecida e válida com ADMIN_PASSWORD_RECORD/TOTP. Nunca apagar dados, D1 ou BATCH_EXPORT_KEY. Se não houver credencial anterior válida, manter o painel fechado e usar o acesso autorizado à conta Cloudflare para configurar a senha própria novamente.

## Biblioteca QR gratuita

qrcode-generator, Kazuhiko Arase, licença MIT (incluída no HTML). Fonte: https://github.com/kazuhikoarase/qrcode-generator — arquivo js/dist/qrcode.js. Snapshot incorporado, SHA-256: `79ec86f82856005b1c887905cfccfcfbec3821ca61c7fd5a952faa5f778f791c`. Não há carregamento de CDN ou dependência paga. O código incorporado não contém credenciais reais.
