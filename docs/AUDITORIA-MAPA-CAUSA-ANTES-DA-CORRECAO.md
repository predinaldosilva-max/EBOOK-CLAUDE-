# Diagnóstico antes de alterar o módulo — 20/11/2026

Fonte: produção b421095efe26c4893f3a0825f7bd843cacb08677; arquivos financeiros locais idênticos ao commit 55e62d9.

1. `earnings.js/calculate`: combustível=milhas×preço/MPG; desgaste=milhas×wearPerMile; outros=milhas×otherPerMile; custo=soma dessas três parcelas. Não há custo fixo por pedido ou leitura oculta de despesas. `record` e `verdict` usam `calculate`.
2. Com desgaste 1/milha e outros 2/milha, custo=1,28+10+20=31,28, líquido=-1,28. O resultado relatado de 22,28 não corresponde a esses parâmetros ativos.
3. Reprodução exata possível: desgaste 0,10/milha e outros 2/milha: 1,28+1+20=22,28, líquido=7,72. É uma configuração compatível, não prova dos valores salvos no telefone; outros pares cuja soma seja 2,10/milha também produzem esse valor.
4. O cálculo esperado de 13,28 usa outros=2 por pedido, unidade diferente da implementação. A diferença de 9 resulta, na reprodução compatível, de +18 em outros custos e -9 em desgaste: efeito líquido +9. Não foi encontrada uma parcela oculta de 9.
5. `earnings-ui.js/mount`: o texto de combustível zero é o rótulo de um botão opcional. Só ao clicar copia legacyCost para o campo desgaste e zera o preço do combustível; exige confirmar os custos para salvar. O botão não executa automaticamente. A configuração do mapa confirmada atualiza o custo da calculadora, e o valor da calculadora só retorna ao mapa por esse clique explícito.
6. Indícios técnicos a testar antes de corrigir: resultado da oferta não é recalculado no callback de confirmar configurações; prévia de edição usa configurações atuais, mas salvamento de edição preserva as do pedido original. Podem criar divergência visual. Também é possível digitar configurações sem confirmá-las; a avaliação continua usando as salvas.
7. `Store.setOwner` isola por licença no localStorage deste navegador. Não há sincronização entre aparelhos. `analyze.needed=max(0,10-records.length)`: 9 significa um pedido salvo; 10 significa nenhum na coleção ativa. Uma oferta simulada não cria pedido. Rankings também dependem da coleção local. Sem exportação dos aparelhos não é possível determinar qual dessas causas ocorreu no caso concreto.

Nenhuma fórmula ou funcionalidade do aplicativo foi alterada para este diagnóstico. Próximo passo: reproduzir as divergências visuais com testes e aplicar somente correções comprovadas, mantendo fórmulas e dados anteriores.
