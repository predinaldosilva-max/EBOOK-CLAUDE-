> Atualização 21/11/2026: Admin com autenticação própria publicado e login confirmado pelo proprietário. As observações de Access e de painel não publicado abaixo descrevem a auditoria inicial. Estado atual e passos restantes: IMPLANTACAO-MANUAL.md e RELATORIO-DE-ENTREGA.md. Migração 0001 e cliente novo ainda pendentes; não há conferência privada integral do D1 daqui. Previews candidatos agora isolam o D1 comercial.

# Auditoria e plano — licenças de 30 dias

Base comprovada: produção 2.2.6, commit GitHub `7f189f6ae6d5033ebc3a01203539b9e051eaf5d6`. Branch de trabalho `feature/licensing-30days-admin`. A implantação anterior foi conferida por conteúdo de 18 arquivos e testes CI (run 44901644813). Nesta etapa a branch inicia exatamente nesse commit.

## Estado observado no código

| Área | Implementação atual | Decisão |
|---|---|---|
| Worker cliente | `server/worker.mjs`, `usa-work-kit`, `wrangler.jsonc` | Preservar rotas e validações legadas; acrescentar caminho temporário |
| Banco | D1 `usa-work-kit-db`, binding `DB`; ID na configuração atual | Mesmo banco; nenhum banco comercial paralelo |
| Tabelas | `licenses`, `attempts`, `audit`, `test_sessions`, em `schema.sql` | Nenhum UPDATE/ALTER dos registros legados na migração |
| Credencial | SHA-256 em `licenses.password_hash`; formato UW- + 16 hex | Preservar; novas chaves poderão ter 32 hex |
| Dispositivo | Hash de token aleatório de instalação de 32 bytes em localStorage | Não identifica hardware; navegadores/perfis/PWA podem ter armazenamento separado |
| Ativação | UPDATE atômico com comparação de `installation_hash`; sem expiração comercial | Manter para legado; política temporária em tabela separada |
| Teste 001 | `is_test=1`, sessões com token e expiração individual de 30 dias | Preservar exatamente; não transformar em licença temporária comercial |
| Admin | Apenas POST `/api/admin/reset`, segredo `ADMIN_TOKEN`, auditoria; não há gerador nem painel | Preservar endpoint; novo Worker independente, Access validado no servidor |
| Financeiro | `usa-work-kit-finance-v2:<owner>` no localStorage, `owner` depende da licença | Renovação deve conservar proprietário autorizado anterior |
| Cofre | IndexedDB `usa-work-kit-protection-v1/vaults`, chave `owner`; AES-GCM UWKV1 com AAD owner/revisão | Não recifrar nem mudar chave; nova licença transporta proprietário comprovado no servidor |
| Offline | Inicialização exige validação; revalidação a cada 5 minutos, falha bloqueia | Manter limite; lease monotônico para prazo enquanto aberto |
| Funções | Proteção, diagnóstico, histórico, evidências, PDF/ZIP, financeiro, mapa, calculadoras, metas, despesas, mensagens, PT/ES/EN | Não modificar comportamento |
| Deploy | Cloudflare conectado ao GitHub; push de branches pode gerar previews | Não fazer push antes da configuração final; não usar produção para testes |

Segredos já encontrados por nome: `RATE_SECRET`, `ADMIN_TOKEN`. Nenhum valor foi lido/exposto. O novo painel precisará de configuração Access e de um segredo separado para cifrar sementes de lotes; não reutilizar token legado.

## Limitação original de acesso real (registro histórico)

Terminal Wrangler sem autenticação. Navegador Cloudflare exige login; solicitação segura recusada. Portanto NÃO foi possível consultar o inventário real, verificar a contagem 50, exportar o D1 nem confirmar plano/Access/secrets. Os identificadores comerciais 001–050 são informados pelo proprietário, não conferidos no D1 nesta etapa. Nenhum registro de produção foi alterado.

O proprietário pediu para deixar a configuração Cloudflare para o final, pelo desktop. Implementação/testes isolados prosseguem. Publicação final depende dessa etapa manual e NÃO será declarada concluída antecipadamente.

## Arquitetura e segurança

Tabelas aditivas de política temporária e lotes; nenhuma alteração da tabela original. Prazo de 2.592.000.000 ms desde primeira ativação, em UTC. Revalidação nunca estende prazo. Renovação valida a credencial anterior e a instalação no servidor e conserva `data_owner`; nenhum reagrupamento por simples valor informado pelo navegador. Backups UWKV1 e chave de recuperação ficam intactos.

Worker Admin separado e fechado por padrão: JWT Access RS256 verificado (assinatura, emissor, audiência, validade e allowlist), em todas as rotas e recursos; mutações exigem origem exata e cabeçalho próprio. Lotes até 2.000 em blocos pequenos, idempotentes e transacionais. Banco recebe hashes e semente cifrada AES-GCM; reexportação exige autenticação e o segredo correto.

## Recuperação e rollback antes de qualquer implantação

1. Exportar D1 com Wrangler para arquivo seguro no computador do proprietário. Não enviar o dump ao GitHub/chat.
2. Registrar contagem e resumo criptográfico dos registros legados por ferramenta local, sem imprimir hashes individuais de senhas.
3. Aplicar apenas a migração aditiva, conferir que todas as linhas originais permanecem iguais; não executar seeds em produção.
4. Configurar e verificar o Admin fechado antes de liberar geração. Publicar cliente somente após os testes e os metadados novos.
5. Rollback antes de emitir licenças: voltar Worker/cliente à 2.2.6; manter tabelas novas e dados. Não aplicar down migration destrutiva.
6. Depois de emitir licenças temporárias, NÃO voltar ao validador antigo: ele não conhece vencimento. Rollback deve manter a validação temporária e desativar somente geração/UI nova; preservar `license_terms` e lotes. Em emergência falhar fechado, nunca promover temporárias a legadas.
7. Dados locais: exportar financeiro e cópia cifrada antes de mudanças; nenhuma limpeza de localStorage/IndexedDB. Na renovação manter owner e chave originais. Troca de aparelho continua exigindo reset autorizado e recuperação manual com backup/chave.
