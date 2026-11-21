# Auditoria inicial — inteligência local aditiva

Base: c63163f4738c9df906a65994e1e9efec07da9500 (2.2.5).
Branch local: feature/local-rules-timeline-insights. Não fazer push: Cloudflare está conectado ao GitHub e pode publicar prévias automaticamente. Nenhuma configuração de produção será alterada para contornar isso.

| Recurso | Situação observada no código | Arquivos | Adição prevista |
| --- | --- | --- | --- |
| Acesso e licença | Servidor Worker/D1; instalação e licença determinam proprietário local | app.js, server/worker.mjs | Nenhuma |
| Cofre | IndexedDB usa-work-kit-protection-v1; AES-GCM, AAD inclui proprietário e revisão; UWKV1 | vault.js | Campo opcional de eventos; sem trocar chave, formato ou versão do banco |
| Diagnóstico | Modelos históricos v1/v2, índice 0–100 e faixas; grava respostas, pesos e recomendações | protection-preventive.js, protection-daily-ui.js | Regras relacionadas apenas na apresentação; preservar resultados assinados pelos modelos |
| Histórico | Revisões, filtros por plataforma e gráficos de 7/30 dias | protection-daily-ui.js | Linha do tempo compacta na aba existente |
| Defesa | Ocorrências, originais, SHA-256, histórico, PDF, ZIP e contestação editável | protection-ui.js, protection-reports.js | Seleção/vínculo explícito dos eventos; nenhum envio automático |
| Direitos | Fontes das plataformas e informação jurídica local com datas | protection-preventive.js, protection-daily-ui.js | Regras por plataforma e selo sem substituir fontes existentes |
| Mapa | Fora do cofre; localStorage por proprietário; registros com custos e configuração histórica; espera com waitKnown; janelas de 3h com fuso; CSV/backup | earnings.js, earnings-ui.js, storage.js, app.js | Módulo determinístico separado; até 3 cartões no topo |
| Demais ferramentas | Entregas, trabalho, metas, despesas, mensagens, relatórios | app.js, calculators.js, reports.js | Nenhuma alteração de comportamento |
| Testes | Node, JSDOM/fake IndexedDB, matrizes financeiras, cofre histórico, PWA e jornadas Chromium/WebKit | tests/, usa-work-kit/tests/ | Acrescentar testes específicos e executar regressão |

## Persistência e reversibilidade

Não há sincronização de documentos. O cofre é separado por proprietário. O Mapa usa usa-work-kit-finance-v2:<proprietário>; não será levado ao cofre. Custos salvos no pedido são snapshots e não serão recalculados com preços atuais. O campo de gorjeta já está incluído no total. Espera ausente não significa espera zero.

Os novos eventos terão campo opcional e próprio, validado sem obrigar backups antigos a conter esse campo. Nenhuma migração automática na abertura. Só gravar novos campos após ação explícita do usuário. Não alterar resultados históricos do diagnóstico: a validação compara o modelo/resultado salvo.

Insights são derivados, não persistidos: não precisam de migração. A entrada deve ser validada e nunca modificada. Ganho/hora agregado = soma dos resultados líquidos / soma das horas, não média simples dos índices por pedido. Separar fusos nas janelas e nas comparações semanais. Não estimar espera ausente.

## Fontes e divergências observadas em 2026-11-21

- DoorDash Contract Violations FAQs permite link no e-mail **ou** botão Start appeal no app; a exclusividade do e-mail fornecida no pedido não será anunciada como oficial.
- Grubhub Fraudulent Use Policy fala em pausa/bloqueio na terceira violação em 90 dias; Delivery Partner Deactivation Policy fala em desativação. Preservar ambas as fontes, escopo e linguagem, sem inventar irreversibilidade. O procedimento de contestação oferece formulário e resposta ao e-mail; prazos variam por mercado.
- Página de clientes da Instacart sobre Financial Risk and Account Security não será aplicada automaticamente a shoppers. Fonte corporativa sobre troca de dispositivo foi localizada na busca, mas sua abertura redirecionou para o site europeu; fica pendente até confirmar acesso ao documento aplicável.
- Não usar documentos DoorDash de consumidores australianos ou DashForce para declarar regras gerais de Dashers nos EUA.

URLs identificadas:
- https://help.doordash.com/en-us/dashers/article/dasher-contract-violations-faqs
- https://driver-support.grubhub.com/hc/en-us/articles/4408043356436-Fraudulent-Use-Policy-and-Understanding-Account-Violations
- https://driver-support.grubhub.com/hc/en-us/articles/31896441462548-Delivery-Partner-Deactivation-Policy
- https://driver-support.grubhub.com/hc/en-us/articles/33198547098644-Delivery-Partner-Deactivation-Challenge-Procedure
- https://www.uber.com/us/en/drive/driver-app/deactivation-review/
- https://www.instacart.com/shoppers-terms

## Rollback planejado

Como não há publicação, a produção permanece na base 2.2.5. Desativar as adições retirando as inclusões dos módulos novos e seus pontos opcionais de montagem. Não apagar o campo de eventos do cofre: manter seus bytes e a leitura/exportação compatível. Se no futuro houver reversão para 2.2.5, exportar primeiro backup cifrado; o código antigo conserva campos desconhecidos do cofre, mas não os apresenta nem os valida. Não restaurar backup anterior sobre registros atuais como forma de rollback. Sem rollback de D1, pois não há migração de D1.

## Estado deste registro

Auditoria concluída. Implementação e testes das adições são registrados nos próximos checkpoints. Este documento não declara as funcionalidades novas prontas ou publicadas.

## Checkpoint 1 — implementado, sem publicação

- Motor EarningsInsights: sete tipos de insight, limites centralizados, até três cartões por prioridade, sem IA ou rede e sem alterar os registros de entrada.
- Textos PT/ES/EN em módulo separado, com valores USD, unidade por hora e indicação de que são baseados no histórico do usuário.
- Integração pequena e opcional no topo do Mapa; atualiza após salvar, excluir, restaurar/remontar e alterar configurações. Se o módulo adicional não estiver disponível, os formulários e cálculos anteriores continuam funcionando.
- Nenhuma alteração em earnings.js, storage.js, vault.js, índice, pesos, autenticação ou D1.
- Build inclui os dois arquivos novos. Novo teste verifica recursos referenciados pelo HTML interno para evitar exportação com scripts faltantes.

Executado: baseline com 136 testes principais aprovados; após adições, npm test com 153 testes principais aprovados, 39 cálculos base, 26 grupos de qualidade (5.000 cenários gerados) e integração financeira. Cinco testes Python de build aprovados. Os 17 testes novos incluem três repetições dos sete tipos, amostras insuficientes, fusos/DST, valores sem duplicar gorjeta, snapshots de custos, ausência de mutação, 9 combinações DOM/idioma e dados de 10.000 pedidos. A geração de insights para 10.000 pedidos levou 75 ms nesta máquina; não é garantia de desempenho em todos os celulares.

Pendências: catálogo e motor de regras; selos e fontes; linha do tempo criptografada, vínculo e exportação na Defesa; testes dessas adições; testes nativos de navegador e celulares; inclusão no cache estático e identificação de uma nova versão somente quando o conjunto estiver pronto. O cache 2.2.5 não foi alterado neste checkpoint, e esta branch NÃO deve ser publicada no estado parcial.

Rollback deste checkpoint: remover as duas inclusões de script no index.html e os dois pontos opcionais da UI do Mapa; remover os módulos adicionais e suas entradas no build. Não há migração ou dados de insight persistidos para desfazer. Os registros e configurações existentes permanecem intactos.

## Checkpoint 2 — catálogo e persistência da linha do tempo

- Catálogo único platform-rules-data.js com 28 entradas PT/ES/EN, 14 corroboradas e 14 hipóteses/pendentes. Lista completa e verificações restantes em INTELIGENCIA-LOCAL-REGRAS.md. Fonte candidata não é comprovação da regra.
- Motor de correspondência somente contextual: não calcula índice, não transforma pedido de verificação em falha, respeita a plataforma e não considera resposta negativa/desconhecida como afirmativa. Aceite automático oculto quando automação=Não não gera correspondência.
- Campo opcional protectionTimeline no mesmo conteúdo cifrado UWKV1. Nenhuma migração ao abrir e nenhuma mudança em chave, AAD, banco, proprietário ou versão do diagnóstico. Eventos novos só são gravados por ação explícita. Revisões e relógio local não verificado ficam identificados.
- Vínculos novos exigem ocorrência da mesma plataforma e anexos pertencentes às ocorrências selecionadas do mesmo cofre. Exclusão posterior da ocorrência não apaga silenciosamente o evento nem impede desbloquear o cofre; a UI deve identificar o vínculo indisponível.
- Arquivamento de evento é reversível e preserva histórico no backup: não deve ser anunciado como apagamento definitivo. Eventos arquivados não entram na contagem.
- Contador só para a regra Grubhub verificada: janela móvel estrita de 90x24h, eventos futuros/expirados excluídos e avisos duplicados com a mesma referência contam uma vez. Sem referência, cada evento distinto conta como registro declarado; não é leitura nem confirmação do total oficial da plataforma.
- Backup e restauração existentes transportam o campo novo sem alterar a forma de recuperação. Validação estrutural de regras históricas não depende de o catálogo atual manter aquela regra: uma atualização de políticas não pode invalidar a chave/cofre antigo.

Executado neste bloco: 15 testes novos; regressão completa com 168 testes principais aprovados, além dos cálculos/qualidade/integração existentes. Cinco testes de build aprovados (47 arquivos públicos). Os testes incluem três repetições da contagem de 90 dias e três repetições de persistência/backup/isolamento do cofre com eventos e arquivo original.

Pendências: selos/diálogo de fontes e recomendações na interface; formulário/linha do tempo no Meu Histórico; seleção de eventos e referências na contestação/PDF/ZIP; testes UI e nativos de integração; cache/versão de lançamento. Nenhum deploy, push ou alteração em produção. As novas funções da Proteção ainda não foram conectadas à interface.

## Etapa concluída — integração da Proteção de Conta (21/11/2026)

Implementação local, sem push e sem deploy. A versão pública continua inalterada.

- Diagnóstico e revisões mostram referências contextuais com selo Oficial/Hipótese. Não foram modificados o modelo preventivo, suas perguntas, pesos, pontuação ou faixas. Uma correspondência não comprova uma violação.
- Meu Histórico ganhou formulário recolhido de eventos, data com offset explícito, fuso, descrição, referência, vínculos com ocorrências e originais, revisões, arquivamento reversível e restauração.
- Contador exclusivo para a regra verificada da Grubhub: janela móvel de 90 dias, sem datas futuras, sem eventos arquivados, deduplicação por referência. É contagem dos registros declarados, não consulta à plataforma.
- Minha Defesa permite selecionar eventos e, separadamente, seus arquivos vinculados. PDF contém declarações/revisões e referências; ZIP contém manifesto, texto e apenas os originais selecionados, com verificação SHA-256. Nenhum envio automático.
- Meus Direitos mantém a pesquisa geográfica existente e recebe referências compactas da plataforma escolhida no diagnóstico. Janela de fonte informa rótulo, URL, revisão, abrangência e etapa.
- Todos os textos de interface novos possuem PT/ES/EN. Selos não confirmam os fatos relatados. Metadados históricos das regras permanecem preservados mesmo se o catálogo mudar.
- Persistência: apenas campo opcional `protectionTimeline` no conteúdo já cifrado. Sem novo banco, migração destrutiva, nova chave, alteração de licenciamento ou alteração de Worker/D1.
- Cache de desenvolvimento exclusivo `usa-work-kit-v2.2.5-intelligence-local-r1` inclui os novos módulos. Preservada a correção de redirecionamento de navegação do Safari.

### Evidências de execução

`npm test`: 177 testes Node; 39 verificações do núcleo; 26 grupos de qualidade, incluindo 5.000 cenários de cálculo; testes DOM e integração financeira. Novos testes de interface cobrem 3 idiomas x 3 identificações de dispositivo, PDF real, ZIP/originais, abertura/fechamento de fonte, arquivo/reabertura, backup/restauração e preservação do rascunho durante atualização do histórico. Testes de cofre repetem 3 vezes persistência, isolamento, histórico e falha de gravação. Os testes completos de diagnóstico/defesa carregam os novos módulos.

Build: 5 testes Python e exportação de 50 arquivos públicos. `git diff --check` sem problemas.

Limitação real: Chromium foi encontrado, mas sua inicialização foi bloqueada antes de carregar o app (`socket() failed: Operation not permitted`). O teste `tests/protection-intelligence-browser.cjs` está preparado, mas NÃO aprovado neste ambiente. Não houve teste físico desta adição em Safari/iPhone ou Android. Simulação DOM com user-agent não equivale ao motor WebKit nem a aparelho físico.

### Conferência manual da adição, antes de publicar

1. No iPhone e Android, abrir o mesmo endereço/origem atual e desbloquear com a chave existente. Conferir ocorrências antigas, áudio/foto/PDF e diagnóstico anterior.
2. Meu Histórico: registrar evento fictício Grubhub do tipo violação, vincular uma ocorrência e anexo, abrir o selo, editar o evento, arquivar e restaurar. Reabrir o app e conferir o mesmo registro com a mesma chave.
3. Minha Defesa: selecionar apenas esse evento e seu anexo, gerar PDF e ZIP, conferir texto e original. Exportar backup cifrado e testar restauração na mesma licença, sem apagar dados legítimos.
4. Repetir em PT/ES/EN e abrir Meus Direitos. Confirmar que fonte pendente aparece como Hipótese e que não há contador numérico para DoorDash.

### Rollback e recuperação

Não há mudança em produção para reverter. Descartar o branch não altera a produção. Para voltar o código após testes locais, conservar primeiro o backup cifrado UWKV1 e a chave, além de uma cópia do estado financeiro. Voltar ao commit base `c63163f4738c9df906a65994e1e9efec07da9500` no ambiente de teste, mantendo IndexedDB/localStorage. O código antigo não expõe os campos novos; não salvar/reexportar dados novos com código antigo como método de migração. Guardar o backup completo para reabrir com esta implementação. Não excluir banco, anexos, proprietário local ou chave. Nenhuma instrução SQL é necessária.

### Arquivos da integração desta etapa

- `js/protection-intelligence-i18n.js`: novos textos.
- `js/platform-policy-ui.js`: selos, fontes e referências compactas.
- `js/protection-timeline-ui.js`: edição, vínculos e seleção de eventos.
- `js/protection-daily-ui.js`, `js/protection-ui.js`: pontos aditivos de integração.
- `js/protection-reports.js`: seleção segura e exportação de eventos.
- `js/protection-timeline.js`, `js/vault.js`: restauração de eventos arquivados.
- `index.html`, `css/style.css`, `sw.js`, `scripts/build.py`: recursos locais e apresentação.
- `tests/protection-intelligence-ui.test.mjs`, `tests/protection-intelligence-browser.cjs`, `tests/preventive-ui.test.mjs`, `tests/pwa-navigation.test.mjs`, `tests/pwa-browser.cjs`: cobertura e cache de desenvolvimento.

Catálogo completo e pendências: `INTELIGENCIA-LOCAL-REGRAS.md` (28 regras: 14 verificadas, 14 hipóteses). Uma URL candidata preenchida não transforma a regra em oficial; a confirmação exige texto oficial compatível com a afirmação específica.
