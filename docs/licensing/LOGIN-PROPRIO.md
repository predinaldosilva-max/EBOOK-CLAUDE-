# Login administrativo próprio — candidato isolado

Este branch acrescenta um modo de autenticação próprio ao Worker separado. Não modifica cliente 2.2.6, Worker de licenças, cofre, finanças ou as 50 linhas legadas. Não precisa concluir a ativação Zero Trust nem autorizar sua cobrança. O modo Access permanece disponível e não é enfraquecido: `ADMIN_AUTH_MODE=local` seleciona explicitamente o novo modo; configuração ausente ou inválida bloqueia operações.

## Segurança e limites

Login HTTPS com usuário, senha aleatória de 256 bits e TOTP SHA-1 de 6 dígitos/30 segundos (RFC 6238). Verificador PBKDF2-HMAC-SHA256 com sal aleatório de 16 bytes e 100.000 iterações, compatível com o limite Web Crypto do Worker. A senha forte aleatória é obrigatória no procedimento de configuração; não reutilizar senhas humanas fracas. Segredos ficam em variáveis Secret, nunca em JavaScript público nem GitHub. PBKDF2 não substitui a entropia da senha.

Cookie de sessão opaco aleatório de 256 bits, prefixo __Host-, Secure, HttpOnly, SameSite=Strict, sem localStorage, validade absoluta de 30 minutos pelo servidor, sem extensão automática. D1 contém somente hash do token. Toda alteração exige Origin exata, cabeçalho próprio e CSRF aleatório vinculado à sessão. Logout revoga a sessão no D1. Mudança de usuário/verificador/TOTP/segredo de sessão invalida sessões anteriores. TOTP válido é consumido por atualização atômica e não pode iniciar duas sessões. Tolerância de um passo para relógio do autenticador; horário de expiração continua do servidor.

Limite conservador: 10 tentativas por IP e 50 globais por 15 minutos, antes da derivação de senha. CF-Connecting-IP é fornecido pelo Cloudflare; nenhum X-Forwarded-For informado pelo cliente é usado. Um atacante pode causar indisponibilidade temporária ao atingir o limite global; não há bloqueio permanente nem recuperação pública. Eventos de login/logout são mantidos por até 90 dias com limpeza no próximo login bem-sucedido, sem credenciais ou IP bruto. Somente o dono autorizado no Cloudflare faz recuperação/troca dos segredos. Não enviar segredos ao suporte por chat. Esse modo exige manutenção própria de segurança; não equivale a um serviço gerenciado de identidade.

## Publicação manual após os testes

1. Guardar o commit administrativo anterior `1abc14c0ae6bbd824ad485b3ef40300972e988d0`. O cliente continua no commit publicado 7f189f6ae6d5033ebc3a01203539b9e051eaf5d6.
2. Aplicar **somente** `migrations/0002_admin_auth.sql` no D1 existente, depois de conferir que são tabelas novas. É idempotente; não altera nem exclui linhas existentes. A migração 0001 dos lotes continuará separada, após backup/conferência dos registros comerciais e antes de habilitar geração. Login funciona só com 0002; consultas de lotes precisam de 0001.
3. Baixar `admin/setup-local.html` e abrir o arquivo salvo no computador privado. Não está nos assets públicos do Worker. Gerar senha/segredos somente ali, adicionar chave TOTP manualmente no autenticador e conferir o código. Guardar cópia privada fora do GitHub.
4. No Worker **usa-work-kit-admin**, Settings > Variables and Secrets: Text `ADMIN_AUTH_MODE=local`, `ADMIN_USER` escolhido, `ADMIN_ORIGIN=https://usa-work-kit-admin.pr-edinaldosilva.workers.dev`, `GENERATION_ENABLED=false`. Secret `ADMIN_PASSWORD_RECORD`, `ADMIN_TOTP_SECRET`, `ADMIN_SESSION_SECRET`, `BATCH_EXPORT_KEY`, usando os valores locais. Se já houver lotes, preservar BATCH_EXPORT_KEY original. Nunca reutilizar RATE_SECRET ou ADMIN_TOKEN do aplicativo.
5. Publicar somente o Worker Admin com `npx wrangler deploy --config wrangler.admin.jsonc` e o commit testado deste branch, atualizando o checkout fixado em Build command. Não rodar migração nem cliente automaticamente no build.
6. Conferir /login nos três idiomas, senha incorreta, login correto, logout e nova tentativa sem sessão; conferir 30 minutos de sessão. Só liberar geração após 0001, proteção dos dados e cliente validador de 30 dias completos. A versão pública 2.2.6 não aceita ainda o novo formato de chave: não vender as novas chaves até a integração final.

## Recuperação e rollback

Perdeu senha ou autenticador: entrar na conta Cloudflare por seu procedimento seguro, gerar nova configuração em computador privado e substituir usuário/verificador/TOTP/segredo de sessão. Manter **BATCH_EXPORT_KEY** para preservar reexportação. Nenhuma recuperação pública por e-mail foi implementada. Não alterar credenciais das 50 licenças nem chaves dos cofres.

Rollback: manter geração false, remover `ADMIN_AUTH_MODE=local` ou trocar para access **somente** se Access já estiver corretamente configurado; caso contrário o painel deve continuar fechado. Reimplantar o commit administrativo anterior ou desativar apenas o Worker Admin. As tabelas novas podem permanecer; não restaurar o D1 inteiro nem apagar lotes. O app cliente não depende desta alteração.

## Cobertura

Testes de unidade: vetores RFC 6238, senha/sal, todos os segredos obrigatórios, autorização, cookie, CSRF, sessão expirada, revogação por rotação, logout, TOTP simultâneo/replay, limites global/IP, corpo inválido e preservação das licenças. Teste real workerd/D1 isolado: 2.551 chaves em lotes 1/50/500/2000 com exportação paginada, retomada, repetição e preservação exata de 50 legadas fictícias. Navegadores nativos em CI: WebKit com viewport iPhone e Chromium com viewport Android/desktop, três rodadas/idiomas. Simulações não substituem a conferência final nos aparelhos reais. Nenhum teste usa senhas comerciais reais.
