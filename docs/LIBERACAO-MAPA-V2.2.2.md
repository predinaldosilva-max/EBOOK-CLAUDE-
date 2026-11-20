# USA Work Kit 2.2.2 — correção do Mapa de Ganhos

Esta liberação incorpora as correções documentadas na auditoria do PR #12 e substitui a restrição de publicação da versão anterior após aprovação dos testes. Nenhuma fórmula financeira, senha, licença, cofre, registro existente ou arquitetura de armazenamento foi alterada.

## Correções

- A avaliação já preenchida recalcula o resultado e o veredito imediatamente ao confirmar novos custos.
- A prévia de edição usa os custos históricos do pedido, iguais aos usados no salvamento.
- O custo total mostra combustível, desgaste e outros custos separadamente, com indicação de que o total já inclui combustível.
- Custos confirmados ficam visíveis; alterações ainda não confirmadas e importação opcional da calculadora têm avisos claros em português, espanhol e inglês.
- O cache PWA foi versionado para entregar a correção aos aparelhos existentes, sem limpar dados locais.

## Regra preservada

Desgaste e outros custos são US$/milha. Outros custos de US$2/milha são US$20 para dez milhas. O campo não representa custo fixo por pedido. A receita já inclui a gorjeta; os minutos já incluem a espera. O mapa não acessa contas de plataformas.

## Matriz ampliada

`tests/earnings-release-matrix.test.mjs`: três rodadas de 92.820 combinações, total de 278.460. Cada rodada cruza 50 estados + D.C., as sete opções cadastradas de plataforma, vinte nomes de lojas e treze distâncias (0; 0,01; 0,1; 0,5; 1; 5; 10; 25; 50; 100; 250; 1.000; 3.000 milhas). Tempos variam de 0,1 a 1.440 minutos; custos e critérios são verificados por referência matemática independente. Inclui perda, milhas zero, valores decimais e limites inválidos. Os nomes de lojas e estados são dados declarados, não integrações ou cotações reais de mercado. Não há regra tributária local ou preço de combustível automático por estado.

Não se trata de testar literalmente todos os nomes de estabelecimentos nem todos os números possíveis: são uma matriz finita, casos de fronteira e os testes aleatórios já existentes. O motor financeiro é o mesmo em todos os estados.

## Validação

A suíte completa é executada três vezes, com sementes distintas para os cenários matemáticos gerados. O GitHub Actions repete nove jornadas gerais e nove jornadas específicas de auditoria em Chromium desktop, Chromium móvel e WebKit móvel. Os casos A–D da auditoria continuam cobertos, incluindo a distinção entre custo por milha e custo por pedido, igualdade entre oferta/registro, configurações confirmadas, edição histórica, persistência, exportação e isolamento de dados.

Aprovação automatizada não equivale a teste de hardware físico. O proprietário já confirmou os testes físicos do cofre anteriormente. Após receber 2.2.2, confirmar no iPhone e no Android: oferta recalcula após confirmar custos; pedido salvo continua após reabrir; editar pedido antigo preserva custos históricos. Não é necessário repetir microfone/GPS para esta correção.

## Recuperação

Produção anterior: b421095efe26c4893f3a0825f7bd843cacb08677, preservada no histórico Git. Publicação por merge do PR #12 após sucesso dos testes; nenhuma migração D1. Reversão de código não restaura automaticamente dados locais; backups continuam necessários.
