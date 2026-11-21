# USA Work Kit — manual operacional do licenciamento

## Situação desta entrega

O Admin está publicado em https://usa-work-kit-admin.pr-edinaldosilva.workers.dev/ e o login com usuário, senha escolhida e Google Authenticator foi confirmado pelo proprietário. Não existe segunda senha para gerar chaves. O segredo de lotes é usado internamente pelo servidor.

O cliente comercial ainda é 2.2.6. A publicação do candidato completo, a migração 0001 e a liberação de geração permanecem pendentes. Ver IMPLANTACAO-MANUAL.md. Não regenerar credenciais nem alterar BATCH_EXPORT_KEY.

## Política comercial

- As chaves legadas continuam com a regra original. A chave de teste continua como teste. O novo painel as mostra somente para consulta.
- Cada nova chave libera 30 dias corridos, exatamente 720 horas, desde a primeira ativação no servidor. Criar/entregar/exportar uma chave não inicia o prazo.
- As novas credenciais têm formato `UW-` seguido de 32 caracteres hexadecimais aleatórios derivados criptograficamente. As antigas de 16 caracteres continuam aceitas.
- Não existe débito recorrente. Receba o pagamento e entregue a nova chave manualmente. Não há integração de pagamentos.
- O vínculo é com a instalação/navegador que armazena um identificador aleatório. Não é identificação física infalível do celular. Safari, outro navegador, perfil privado ou uma PWA podem ter armazenamento diferente.

## Entrar e sair do painel

1. Abra https://usa-work-kit-admin.pr-edinaldosilva.workers.dev/.
2. Digite seu usuário e a senha escolhidos e o código atual do Google Authenticator cadastrado para este painel.
3. Clique Entrar uma vez. Confira a visão geral e a contagem de legadas.
4. Use Sair do painel para encerrar a sessão. Fechar a aba não garante a saída.

A sessão dura 30 minutos. Não há uma segunda senha para gerar chaves. Para substituir as credenciais do administrador, usar a configuração privada preservada; não regenerar chaves por falha isolada de login. Não alterar BATCH_EXPORT_KEY para trocar usuário/senha/Google.

## Gerar e entregar uma chave

1. Em **Gerar chaves de 30 dias**, deixe quantidade 1.
2. Opcionalmente identifique o lote; evite dados pessoais desnecessários.
3. Clique Gerar lote. Ao concluir aparece a chave com botão **Copiar chave**.
4. Confirme o pagamento por seu processo manual e envie a chave somente ao comprador autorizado.
5. O comprador abre o aplicativo oficial e insere a chave completa. Somente essa ativação inicia os 30 dias.

## Gerar 50, 500 ou 2.000 chaves

1. Informe a quantidade desejada (qualquer inteiro de 1 a 2.000 por lote).
2. Identifique o lote ou revendedor, se necessário.
3. Clique Gerar lote. O processamento acontece em blocos de 20; o progresso mostra o total gerado.
4. Se a conexão cair, **não gere outro lote**. Clique **Atualizar**, localize o lote incompleto e use **Retomar**.
5. Quando estiver concluído, clique **Exportar CSV**. O arquivo contém somente chave e validade em dias após a ativação, sem senha administrativa, hashes, identificação de aparelho ou dados de clientes.
6. Abra o CSV e confira a quantidade antes de entregar ao revendedor. Ele recebe apenas as chaves; nunca recebe acesso administrativo, D1 ou Cloudflare.
7. Cada chave funciona individualmente. A ativação de um comprador não inicia o prazo das outras.

É possível reexportar um lote concluído com autenticação administrativa. O D1 guarda os verificadores SHA-256 e uma semente do lote cifrada com AES-GCM, não uma lista de chaves em texto puro. **Preserve o segredo de exportação e seu backup seguro.** Sem ele não é possível reconstruir as chaves ainda não entregues a partir do banco. Chaves já entregues continuam sendo validadas pelos hashes; perder esse segredo não cria novas credenciais nem muda o vencimento. Nunca compartilhe o CSV em grupos públicos nem o envie ao GitHub.

## Consultar e administrar

- Visão geral: total, disponíveis, ativadas, vencidas, revogadas, legadas e lotes.
- Consulta: chave completa ou identificador, lote e filtro de estado. A busca por chave usa POST; a credencial não é colocada na URL.
- Disponível: chave gerada, sem primeira ativação e sem prazo iniciado.
- Ativada: prazo iniciado e ainda válido.
- Vencida: chegou à hora de vencimento em UTC.
- Revogada: bloqueada por administrador. Não apaga registros locais.
- Legada: mantém a política antiga. No painel não existem ações para expirar, revogar ou resetar essas linhas.
- Revogar temporária: exige confirmação e motivo, fica no histórico. Não apaga os dados do comprador.
- Redefinir dispositivo temporário: exige confirmação e motivo. Revoga a autorização anterior e permite nova ativação. **Não recomeça nem estende os 30 dias**.
- Para trocar de aparelho após o vencimento, o administrador pode usar **Autorizar recuperação** na consulta de uma nova chave ainda **Disponível**. É necessário confirmar manualmente a titularidade/pagamento, informar a chave ou ID anterior do USA Work Kit e justificar a operação. O servidor registra o vínculo e a auditoria; a primeira ativação mantém o proprietário antigo, mas inicia os 30 dias da nova credencial. A chave 001 não pode ser fonte dessa operação. Uma chave já ativada não pode receber outro proprietário. O backup e a chave original do cofre continuam necessários.

O endpoint administrativo antigo de redefinição de legadas foi preservado; não foi executado sobre chaves comerciais nesta entrega.

O painel lista os 100 lotes e eventos mais recentes. A consulta por identificador de lote permite encontrar registros mais antigos. A consulta de chaves é paginada, com 50 resultados por página.

## Renovação do comprador e preservação dos dados

1. Ao vencer, a tela informa o encerramento nos três idiomas e solicita uma nova chave.
2. O comprador insere outra chave na **mesma instalação/navegador e mesma origem oficial**.
3. O servidor confere o vínculo anterior com essa instalação, inclusive a geração de autorização, e associa a nova licença ao mesmo proprietário dos dados.
4. Os registros financeiros e o Mapa de Ganhos continuam no mesmo local. O cofre continua usando o mesmo identificador, conteúdo cifrado e chave de recuperação.
5. A nova ativação inicia um novo período de 720 horas, sem alterar o vencimento da licença antiga.

Não é necessário criar outro cofre na renovação. Não limpar dados do navegador, reinstalar às cegas ou excluir o cofre para resolver um problema de licença. A instalação anterior é parte da comprovação. A licença 001 é exclusivamente de teste e não deve armazenar evidências reais; seu histórico não é automaticamente transferido para uma licença comercial.

## Backup, vencimento e troca de aparelho

Mesmo com o acesso vencido, a tela oferece exportação dos dados financeiros locais e de uma **cópia cifrada do cofre**, se existirem na instalação. A exportação não desbloqueia o cofre nem contorna o vencimento das ferramentas.

Para recuperar o cofre ainda é necessária sua chave de recuperação original. Não é possível recuperar criptografia forte apenas comprando uma nova licença. O vencimento não elimina nenhum arquivo do armazenamento.

Troca de aparelho: antes, exportar financeiro e cofre e guardar a chave; depois, solicitar a redefinição autorizada e restaurar manualmente no proprietário correto. Não há sincronização automática. Se a comprovação da licença anterior não estiver disponível, não tentar juntar proprietários por suposição: preservar os backups e solicitar orientação para a transferência autorizada. Uma simples chave nova em outro aparelho não transporta os registros do antigo.

## Problemas comuns

| Mensagem/situação | Ação |
|---|---|
| Configuração administrativa incompleta | Conferir a configuração do login, origem, segredo de lotes e binding D1. O painel falha fechado. |
| Sessão inválida | Entrar novamente com seu usuário, senha e código atual do Google Authenticator. |
| Limite de operações | Esperar 15 minutos e retomar o lote existente. Não gerar duplicatas. |
| Queda durante geração/exportação | Atualizar a lista, retomar pelo progresso registrado e reexportar o lote pronto. |
| Chave em outra instalação | Usar o navegador autorizado ou solicitar reset justificado. |
| Chave vencida | Comprar nova chave e inserir na mesma instalação. |
| Vínculo anterior não comprovado | Guardar backups; conferir navegador, origem e reset prévio. Não excluir dados. |
| Chave de recuperação incorreta | Conferir a chave do cofre, não a chave UW de acesso; preservar cópia cifrada antes de qualquer exclusão. |
| Sem internet | A ativação e revalidação precisam do servidor. Não há autorização offline permanente. |

## Custos e capacidade

Nenhum plano pago, cobrança ou serviço externo de IA foi adicionado/ativado. O painel usa autenticação própria; não é necessário ativar Access/Zero Trust. A operação continua sujeita às franquias gratuitas da conta.

Limites documentados consultados em 21/11/2026: Workers Free 100.000 requisições/dia e 10 ms de CPU por invocação; D1 Free 5 milhões de linhas lidas/dia, 100.000 escritas/dia e 5 GB totais. Índices também contribuem para escrita. O gerador usa blocos pequenos e transações; isso não garante capacidade ilimitada. Validar uma licença também consome recursos de proteção contra abuso.

**Poder gerar 2.000 chaves não equivale a suportar 2.000 usuários simultâneos no plano gratuito.** A revalidação de uma sessão aberta ocorre a cada cinco minutos; dimensionar a operação pelos acessos e horários reais e acompanhar os limites da conta. Ao atingir a franquia, o serviço pode ficar indisponível; o sistema não contrata automaticamente um plano pago.

Fontes técnicas oficiais:
- https://developers.cloudflare.com/d1/worker-api/d1-database/
- https://developers.cloudflare.com/d1/platform/pricing/
- https://developers.cloudflare.com/workers/platform/pricing/
- https://developers.cloudflare.com/cloudflare-one/access-controls/applications/http-apps/authorization-cookie/validating-json/
