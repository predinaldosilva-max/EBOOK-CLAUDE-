# Auditoria técnica — Mapa de Ganhos USA Work Kit

Data: 20/11/2026. Produção auditada: b421095efe26c4893f3a0825f7bd843cacb08677. Correção isolada: e49a3df95301c5bb9a238fd44c8724f20dab325d, PR #12. Produção não atualizada por esta auditoria.

## 1. Diagnóstico

Combinação de interpretação das unidades e duas falhas comprovadas de interface. Não foi encontrado erro na fórmula de combustível, duplicação automática de combustível ou desconto oculto. Não há evidência suficiente para atribuir a divergência específica ao preenchimento do usuário ou identificar a configuração efetivamente salva no telefone. Valores digitados sem confirmação, configurações salvas anteriormente e resultado de oferta desatualizado são causas possíveis; apenas as transições de interface foram reproduzidas e confirmadas em teste.

A auditoria anterior não havia exercitado essas duas transições de interface. Os novos testes as reprovam antes da correção e aprovam depois.

## 2. Fórmulas e fontes

`usa-work-kit/js/earnings.js`:

- `settings` (linha 6): configura MPG, preço por galão, desgaste/milha, outros/milha, mínimos e meta. Custos podem ser zero; MPG e mínimos precisam ser positivos. MPG 1–300, custos unitários 0–100.
- `calculate` (linha 8): combustível = milhas × preço/MPG; desgaste = milhas × desgaste/milha; outros = milhas × outros/milha; custo total = combustível + desgaste + outros; líquido = total recebido − custo total; líquido/h = líquido × 60/minutos; líquido/milha = líquido/milhas (indefinido com milhas zero).
- `verdict` (linha 9): ACEITE quando os dois mínimos líquidos são atendidos; NO LIMITE quando ambos atingem pelo menos 90% dos mínimos; RECUSE nos demais casos. Com milhas zero, NO LIMITE por falta de taxa por milha, explicitamente explicado na tela.
- `record` (linha 10): usa `calculate`, salva hora, fuso, métricas e cópia dos custos confirmados. Gorjeta já integra a receita; espera já integra os minutos e não é somada novamente.
- `analyze` (linha 13): mínimo global de dez pedidos; cada janela precisa de três; médias ponderadas pelo tempo. Loja/região e plataforma derivam somente dos pedidos salvos na coleção local.

`usa-work-kit/js/app.js`, `renderEarnings` (linhas 108–111): novo pedido usa configurações confirmadas; edição preserva configurações históricas do pedido. Confirmar custos no mapa atualiza custo/milha e mínimo/h na calculadora. Não existe leitura automática de despesas para descontar outro combustível no mapa.

`usa-work-kit/js/storage.js`, `setOwner/load/save/validate`: armazenamento local separado por licença e validado. Cada navegador/aparelho tem coleção própria, sem sincronização automática. Backups e cópia manual são fluxos distintos.

`usa-work-kit/js/earnings-ui.js`, `mount/form/summary`: renderiza campos, prévias e classificação. `v22-i18n.js` define os rótulos PT/ES/EN. O campo `otherPerMile` já era rotulado como US$/milha, mas a apresentação não explicitava suficientemente a multiplicação nem mostrava cada parcela.

## 3. Explicação dos US$22,28

Com os parâmetros narrados interpretados segundo o código — desgaste 1/milha e outros 2/milha:

- Combustível: 10/25 × 3,20 = 1,28.
- Desgaste: 10 × 1 = 10.
- Outros: 10 × 2 = 20.
- Custo total: 31,28. Líquido: -1,28. RECUSE.

Portanto, **22,28 não é o resultado desses parâmetros confirmados**.

Uma reprodução exata dos valores relatados ocorre com desgaste **0,10/milha**, outros **2/milha**:

1,28 + 1 + 20 = **22,28**; 30 − 22,28 = **7,72**; 60 minutos ⇒ **7,72/h**; 10 milhas ⇒ **0,772/milha**, exibido **0,77**; mínimos 15/h e 1,50/milha ⇒ **RECUSE**.

Essa é uma configuração compatível, não uma prova dos dados salvos no aparelho. Outros pares de desgaste/outros cuja soma seja 2,10/milha também produzem o resultado. A configuração histórica pode ser conferida nas colunas de desgaste, outros, combustível e MPG do CSV do pedido, sem fornecer senha ou chave.

Comparando a reprodução com a expectativa de 13,28: outros aumenta de 2 para 20 (+18); desgaste diminui de 10 para 1 (-9); diferença líquida de custos = +9. Não há um item oculto de 9.

## 4. Significado do botão de importação

O texto “Usar custo por milha da calculadora como desgaste; combustível = zero” era **um botão opcional**, não indicação de que o combustível já foi zerado.

Só o clique copia o custo agregado da calculadora para o campo desgaste e põe o preço do combustível em zero no formulário. Depois é preciso confirmar. Outros custos permanecem como estavam. Se o valor agregado importado já os inclui, adicioná-los outra vez pode duplicar custos por decisão de configuração; o app não identifica automaticamente a composição desse valor. O botão agora explica a importação, a necessidade de revisão e que os outros custos não são alterados.

## 5. Cenários A–D

Entrada comum: 30 recebidos, 10 milhas, 60 minutos, MPG25, combustível3,20, mínimos15/h e1,50/milha. A expectativa fornecida pressupõe **outros=2 por pedido**. A implementação recebe **outros por milha**.

| Cenário | Desgaste/milha | Esperado informado: outros2/pedido | Obtido com campo outros=2/milha | Obtido com outros=0,20/milha para estas10milhas | Resultado |
|---|---:|---:|---:|---:|---|
| A | 0,10 | 25,72 | 7,72 | 25,72 | Aprovado conforme cada unidade |
| B | 0,50 | 21,72 | 3,72 | 21,72 | Aprovado conforme cada unidade |
| C | 1,00 | 16,72 | -1,28 | 16,72 | Aprovado conforme cada unidade |
| D | 0,00 | 26,72 | 8,72 | 26,72 | Aprovado conforme cada unidade |

Com outros2/milha, todos são RECUSE; com o equivalente de 2 por este pedido, todos são ACEITE. Não foi alterada a fórmula para atender à tabela. O equivalente0,20/milha só representa2 totais quando a distância é10milhas; não é conversão universal de custo fixo. O módulo atual não oferece custo fixo extra por pedido. A regra por milha é coerente para custos operacionais rateados pela distância, mas não representa diretamente um pedágio ou estacionamento de valor fixo por entrega.

Cada cenário rodou três vezes por perfil DOM Android e iPhone (24 pedidos salvos), comparando oferta, registro, arredondamento, validação de backup e CSV, além do cálculo paralelo para a unidade por pedido. Três execuções completas do npm test passaram, com95 testes principais cada, além das suítes existentes de cálculos e integração. Quatro testes Python de build passaram.

Testes adicionais: custo zero, milhas zero sem infinito, duração zero, campos vazios, negativos, NaN/Infinity, vírgula em entrada programática, decimais válidos, valores acima do limite, configuração não confirmada, importação explícita, isolamento, preservação de pedidos e recarga. Valores internos mantêm precisão de ponto flutuante e a exibição monetária arredonda para duas casas; não há arredondamento intermediário que altere o veredito.

## 6. Correções mínimas

Antes da correção: seis grupos matemáticos aprovados, dois grupos de interface reprovados (log preservado em AUDITORIA-MAPA-TESTES-ANTES.txt).

- Oferta já preenchida: confirmar novos custos agora recalcula imediatamente o resultado e o veredito.
- Edição: prévia e salvamento usam os mesmos custos originais. A tela explica a preservação histórica.
- Exibição: combustível, desgaste, outros e custo total são mostrados separadamente; total identificado como incluindo combustível. Configuração confirmada fica visível; alterações pendentes e importação exibem aviso.
- Traduções: esclarecimentos nos três idiomas.

Somente earnings-ui.js e v22-i18n.js mudaram no código do aplicativo. Não houve alteração em earnings.js, app.js, storage.js, cofre, Proteção de Conta, servidor, D1, licenciamento ou autenticação. Nenhum dado foi apagado, recalculado retroativamente ou enviado a plataformas. Sem dependências novas/pagas.

## 7. Android/iPhone e contagem

Faltam9 significa uma coleção com um pedido; faltam10 significa coleção vazia. Avaliar oferta não equivale a registrar pedido. Aparelhos, navegadores e licenças podem ter coleções diferentes. Rankings diferentes são esperados com históricos diferentes. A meta diária usa o calendário local do aparelho; janelas de horário preservam o fuso salvo no pedido, outra fonte legítima de diferenças entre históricos.

Não foi observada falha de contagem nos testes locais. Sem os registros dos dois aparelhos, não é possível afirmar se no caso relatado houve falta de salvamento, navegador/licença diferente ou versão antiga. A arquitetura por si só explica a ausência de sincronização; não comprova a causa individual.

Validação nativa: nove jornadas específicas da auditoria aprovadas (três rodadas em Chromium desktop, Chromium móvel e WebKit móvel), com72 pedidos salvos e comparação entre oferta/registro, recarga, contagem, CSV e atualização de configurações. Outras nove jornadas gerais de regressão também passaram. Localmente e no CI: três rodadas completas,95 testes principais por rodada, sem falhas. Consultar execução44753629766, https://github.com/predinaldosilva-max/EBOOK-CLAUDE-/actions/runs/44753629766 . Perfil DOM não é telefone físico; Chromium/WebKit automatizados também não substituem o hardware real.

Após uma futura liberação, confirmar nos dois aparelhos: versão igual; custos confirmados visíveis; registrar um pedido e verificar faltam9; fechar/reabrir; comparar oferta com pedido novo; editar um pedido antigo após mudar custos; abrir CSV e conferir os custos históricos. Não é necessário repetir testes de microfone/GPS/cofre para esta alteração.

## 8. Conclusão

**Versão atualmente publicada: REPROVADO PARA VENDA até incorporar e validar as correções das duas transições de interface.** A fórmula, isoladamente, está aprovada para a regra por milha implementada. A correção não está publicada em produção; permanece no PR de auditoria para revisão.

A causa exata da configuração do teste no telefone permanece não comprovada. Antes de atribuir erro de preenchimento ao usuário, conferir os custos gravados no pedido/CSV. Se o produto precisar de outros custos fixos por pedido, será uma decisão explícita de regra de negócio, não um ajuste silencioso dos dados atuais.
