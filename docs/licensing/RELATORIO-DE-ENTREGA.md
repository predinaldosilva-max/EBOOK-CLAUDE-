# Estado de entrega — licenciamento de 30 dias

## Produção observada em 21/11/2026

Cliente 2.2.6 preservado, sem publicação do candidato de validade nesta etapa. Admin publicado e login confirmado pelo proprietário. Migração administrativa 0002 aplicada; migração 0001 de lotes e validade ainda não aplicada. Geração pausada. Não classificar o novo licenciamento como pronto para venda.

## Implementação preparada

- Chaves de 30 dias (720 horas) contados da primeira ativação; decisão de validade no servidor; sem extensão por revalidação.
- Vínculo ao aparelho preservado; renovação comprova proprietário e conserva armazenamento financeiro e cofre com chave original.
- Cinquenta legadas sem prazo; migração cria apenas tabelas/índices novos. Nenhuma alteração de schema/linhas antigas pela migração.
- Lotes de 1 a 2.000, retomada/idempotência, CSV e cópia de chave única. Geração sem pedir outra senha/confirmar popup; ações de revogação/reset continuam confirmadas e auditadas.
- Login com senha escolhida, Google TOTP, sessão opaca segura de 30 minutos, limites e CSRF. Nenhum segredo em assets públicos. Segredo de exportação interno preservado.
- Previews isolados do D1 comercial; deploy de produção mantém o binding original.

## Verificações

Regressão local completa: 228 testes Node aprovados, zero falhas; núcleo/qualidade/financeiro aprovados. Workerd/D1 isolados testam lotes de 1/50/500/2.000, concorrência, validade, renovação e legadas preservadas, com credenciais fictícias. O build Admin 5725931 teve CI anterior aprovado e login real confirmado pelo proprietário.

O novo candidato inclui tests/licensing-browser.cjs para três rodadas WebKit/Chromium, além do fluxo nativo de login. A tentativa local não executou esses navegadores porque seus binários não estão instalados e o download foi bloqueado; a execução de CI do candidato completo deve ser conferida separadamente. Nenhum teste local substitui a conferência comercial final no iPhone/Android.

## Pendências externas

Backup/conferência privada do banco, migração 0001, publicação do cliente atualizado e interface simples Admin, GENERATION_ENABLED=true por último, teste de uma nova chave em produção. Não foram geradas chaves comerciais ou alteradas licenças de compradores por esta sessão. Sem acesso autenticado ao Cloudflare daqui; passos exatos em IMPLANTACAO-MANUAL.md.

## Contenção

Pausar geração sem apagar dados; não voltar ao validador antigo depois de emitir temporárias. Preservar cofre, owner e chave de recuperação. Nenhum serviço pago ou pagamento automático foi adicionado.
