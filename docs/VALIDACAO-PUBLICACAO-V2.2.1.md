# Validação para publicação — USA Work Kit 2.2.1

Data: 20/11/2026. Dados de teste fictícios; nenhum registro real de produção foi inserido, alterado ou excluído durante os testes.

## Três rodadas completas

Executado `npm test` três vezes com QA_SEED=1, 2 e 3: todas concluíram com código 0. Cada rodada passou em 86 testes Node, 39 testes básicos de cálculo e armazenamento, 26 grupos de qualidade (incluindo 5.000 cenários calculados independentemente), verificação de entrada por dispositivo e 284 verificações da integração financeira com Worker/D1 locais. Quatro testes Python de build também passaram.

| Função | Cenário normal | Limites/erro | Persistência/exportação |
|---|---|---|---|
| Calculadora de entregas | Ofertas, gorjetas, custos e comparação | Prejuízo, milhas zero, duração zero, valores inválidos | Salvar receitas, rascunho e recarregar |
| Calculadora de trabalho | Hora, dia, serviço, semana e projeto | Custos, unidades inválidas, horas zero | Receita salva, relatórios e backup |
| Metas semanais | Falta, meta diária e projeção | Meta atingida, disponibilidade zero e valores inválidos | Rascunho e navegação |
| Despesas | Criar, editar e marcar pagamento | Cancelar edição, campos vazios, excluir | Filtro, totais, recarga e restauração |
| Mensagens prontas | Modelos e personalização | Textos especiais e campos variáveis | Idiomas, copiar e navegação |
| Mapa de Ganhos | Pedidos, custos, nota e rankings | Amostra pequena, espera desconhecida, números inválidos, armazenamento falhando e nova tentativa | Edição, exclusão/cancelamento, CSV, backup, recarga, isolamento e migração explícita |
| Proteção de Conta | Diagnóstico, fatores graves e histórico | Respostas incompletas, chave incorreta, arquivo inválido e interrupções | Cofre cifrado, originais, hash, revisões, PDF, ZIP e restauração |
| Direitos e contestação | Fontes, abrangência e modelos por plataforma | Aviso de conteúdo desatualizado e dados faltantes | Três idiomas, texto editável e PDF |
| Acesso e dados | Ativar/validar pelo Worker local | Senha inválida, revogação, origem, falha de servidor/rede | Separação por licença e preservação após bloqueio |

A execução em navegadores reais é automatizada no GitHub Actions, com três rodadas em Chromium desktop, Chromium móvel e WebKit móvel (nove jornadas). Inclui criação de cofre, diagnóstico, histórico, evidências, PDF/ZIP/backup, reabertura, direitos, idiomas, largura 320px, cores da tela inicial e mapa fora do cofre com CSV e restauração financeira.

Resultado em navegadores: nove jornadas aprovadas, três por motor/perfil, sem erros JavaScript não tratados. Capturas e exportações fictícias constam no artefato 14632537165.

Publicação autorizada pelo proprietário, PR #11 mesclado em main no commit b421095efe26c4893f3a0825f7bd843cacb08677.

Resultados e evidências: https://github.com/predinaldosilva-max/EBOOK-CLAUDE-/actions/runs/44745104962

## O que requer telefone físico

Os testes anteriores do cofre, microfone, GPS e arquivos em iPhone e Android foram relatados como aprovados pelo proprietário. A alteração nova requer somente a confirmação do Mapa de Ganhos em cada aparelho:

1. **Cálculo e acesso direto:** abrir Mapa de Ganhos sem chave do cofre; configurar MPG 25, gasolina US$4/galão, desgaste US$0,20/milha e outros US$0,04/milha. Registrar US$30, 10 milhas, 60 minutos: custo US$4, líquido US$26, US$26/h e US$2,60/milha. Gorjeta já faz parte do valor total; não somar novamente. Registro fictício, sem duplicar em receitas antigas.
2. **Persistência e edição:** fechar/reabrir o app, verificar o pedido e editar o total para US$40: líquido US$36. Cancelar uma exclusão e confirmar que o pedido permanece.
3. **Arquivos e recuperação:** exportar CSV do mapa e abrir no celular; em Relatórios baixar JSON. Em ambiente sem dados reais, excluir o pedido e restaurar esse JSON para confirmar o retorno. Se houver dados reais, preservar primeiro um backup completo e não sobrescrever outro conjunto sem revisão.

WebKit automatizado não equivale a iPhone físico; Chromium móvel não equivale a Android físico. Downloads, teclado decimal e armazenamento dependem do navegador e do aparelho. Nenhum teste permite prometer ausência absoluta de falhas em todas as condições.

## Publicação e recuperação

Não há alteração em server/worker.mjs, schema.sql ou wrangler.jsonc em relação à produção anterior. Sem migração D1, alteração de senhas ou serviço pago. O cofre continua criptografado; o mapa fica em armazenamento local separado por licença, sem a camada adicional do cofre. Limpar os dados do navegador pode apagar dados locais; manter backup externo.

Ponto de recuperação da produção anterior: branch `backup-production-before-v2.2.1`, commit f81abbc17e8bfeefc4d64aaaca6aa44bb3230571. Reverter código não apaga ou restaura automaticamente dados locais do aparelho.
