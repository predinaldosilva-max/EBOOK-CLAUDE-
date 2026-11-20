# USA Work Kit v2.1.0 — implementação preventiva

## 1. Estado e preservação

Base: v2.0.8, commit acfbd4f6046f44abfe48bcf77018babdaf026fcc. Recuperação remota: branch `backup-before-preventive-v2.1.0`. Desenvolvimento: `feature-daily-protection-20261120`. A nova versão precisa de validação física antes de ser anunciada como pronta para venda. A aprovação do iPhone da versão anterior não substitui esse aceite.

Não foram modificados server/worker.mjs, schema.sql, wrangler.jsonc, checkout, página de vendas, hashes das licenças, autenticação, reset administrativo ou identificação financeira. Não executar fixtures contra D1 remoto. A restrição visual a computadores foi removida no app para cumprir o novo requisito de desktop; a mesma validação de licença continua obrigatória. A página de vendas mantém suas regras anteriores.

## 2. Recursos implementados

- Meu Diagnóstico: plataforma/local/data/fuso, horários opcionais, 16 perguntas condicionais, respostas Sim/Não/Não sei, notas e medidas corretivas. Rascunho incompleto cifrado; relatório completo salvo automaticamente após pausa de 700 ms. Mensagem distingue salvamento completo de rascunho. Campos vazios nunca viram Não.
- Índice determinístico de 0–100, faixas 0–19/20–39/40–59/60–100; fator grave impõe classificação crítica. Não sei gera aviso de incerteza separado, sem representar resposta negativa. Não é probabilidade; não há calibração estatística, garantias ou limite seguro para bots.
- Meu Histórico: lista, revisões imutáveis, correção por nova revisão, exclusão, gráficos de 7/30 dias e filtro de plataforma. Cada versão armazena respostas, pesos, versão do modelo e recomendações emitidas (snapshot em inglês), além das datas locais.
- Minha Defesa: preserva incidentes, anexos originais, SHA-256, revisões, áudio MP4 compatível, localização consentida, backup/restauração e exclusão anteriores. Relatórios diários selecionáveis integram PDF e ZIP; apenas os registros e anexos escolhidos entram no pacote. Histórico completo das revisões diárias selecionadas incluído.
- Notificações: análise assistida do texto colado por palavras-chave; trechos de motivo/ação/prazo são reproduzidos, sem verificar remetente, calcular prazo jurídico, interpretar imagem ou inventar informação. Texto pode ser salvo como declaração não verificada no diário.
- Contestação: rascunho em inglês por padrão, editável, com motivo, cidade/estado/data declarados e indicação de campos faltantes. Exportação em PT/ES/EN preserva textos livres no idioma original. Sem envio automático e sem argumentos factuais inventados.
- Meus Direitos: catálogo local datado e limitado a NYC/Seattle, com fontes oficiais e links das quatro plataformas principais. Não determina cobertura nem legalidade da desativação.

Nenhuma função antiga foi removida. A defesa documental anterior foi organizada na aba Minha Defesa. As seis ferramentas financeiras e permissões opcionais foram preservadas.

## 3. Dados, integridade e limites

Sem migração D1. Campos opcionais `dailyReports`, `dailyDraft` e `protectionAudit` permanecem dentro do JSON AES-GCM do cofre IndexedDB existente, por licença. Backups UWKV1 anteriores continuam aceitos; restauração exige mesma licença e chave original. A chave nunca é enviada ao servidor. O arquivo cifrado é escrito atomicamente e com detecção de revisões concorrentes. Falha de escrita não substitui os dados anteriores; mensagem de sucesso depende da confirmação da escrita.

Limites mantidos: 5 MiB por arquivo, 20 MiB de originais por cofre, 200 incidentes, 100 revisões por incidente; JSON claro até 30 MiB e backup até 45 MiB. Novos limites: 500 relatórios diários, 100 revisões por relatório, 5.000 eventos locais de auditoria, 20 registros por seleção de dossiê. Os limites não equivalem a garantia de espaço disponível no aparelho. Exclusão de relatório conserva somente seu identificador, ação e horário no log local; excluir o cofre elimina também o log. Downloads externos são responsabilidade do usuário e permanecem fora do cofre.

Retenção local até exclusão pelo usuário, sem expiração automática ou sincronização. Navegador/SO podem remover armazenamento local; exigir backup manual externo e chave em local seguro. Limpar navegador, perder aparelho/chave ou trocar de origem pode tornar dados inacessíveis. Não solicitar documentos migratórios, senhas ou códigos de delivery. Evitar dados identificáveis de clientes que não sejam necessários. PDF/ZIP são exportações em claro e exigem guarda cuidadosa.

Hash detecta alteração dos bytes em relação ao hash registrado; não prova verdade, autoria ou data original. Datas/auditoria usam relógio do aparelho, sem carimbo independente. Não há certificado jurídico ou serviço pago de timestamp. Histórico cifrado pode ser substituído por backup anterior pelo próprio titular; não é registro imutável externo.

## 4. Critérios do índice

Pesos iniciais de produto, não estimados de dados de banimento:

| Fator afirmativo | Pontos | Impõe crítico |
|---|---:|---|
| Uso de ferramenta automatizada | 5 | Não |
| Seleção/aceitação automática de pedidos | 45 | Sim |
| Ferramenta pede credenciais/códigos | 35 | Sim |
| Ferramenta acessa dados privados | 20 | Não |
| Não conhece permissões (resposta Não) | 10 | Não |
| Compartilhou credenciais | 40 | Sim |
| Dispositivo de terceiro | 10 | Não |
| Autenticação suspeita | 10 | Não |
| Atividade desconhecida | 30 | Sim |
| Aviso de múltiplas contas | 20 | Não |
| Reclamação | 5 | Não |
| Cancelamento/problema relevante | 5 | Não |
| Advertência | 20 | Não |
| Solicitação de identidade, isoladamente | 0 | Não |
| Notificação de segurança | 10 | Não |
| Incidente relevante | 5 | Não |

As quatro perguntas sobre permissões/funcionamento dependem da resposta Sim sobre automação. Solicitação legítima de identidade não é tratada como infração. Falta de certeza não autoriza declarar a conta segura. Recomendações para automação orientam revisar regras e interromper usos incompatíveis, nunca ocultar uso ou burlar detecção.

Configuração técnica em `protection-preventive.js` (`DEFAULT`, pesos e `VERSION`); alterar critérios requer nova versão e revisão dos testes. Cada registro conserva os parâmetros usados. Não há ajuste automático por desempenho nem API de IA.

## 5. Fontes e limites jurídicos

Verificação de catálogo: 19/11/2026; não há atualização jurídica em tempo real.

- NYC DCWP: https://www.nyc.gov/site/dca/about/new-laws-rules.page — Lei Local 34/2026, vigência prevista em 17/01/2027; confirmar cobertura, alterações e litígios. Texto oficial: https://legistar.council.nyc.gov/LegislationDetail.aspx?GUID=265D0ED3-FB2F-48B9-AF70-79973B11E094Int&ID=7480055 . Atualização DCWP: https://www.nyc.gov/site/dca/news/075-26/dcwp-issues-on-amazon-uber-instacart-s-lawsuit-against-nyc-delivery-worker . Não presumir aplicabilidade retroativa.
- Seattle OLS: https://www.seattle.gov/laborstandards/ordinances/app-based-worker-ordinances/app-based-worker-deactivation-rights-ordinance — SMC 8.40, trabalhadores cobertos desde 01/01/2025, fiscalização temporariamente limitada. Confirmar condições e procedimentos diretamente.
- Instacart: https://www.instacart.com/shoppers-terms
- DoorDash: https://help.doordash.com/en-us/dashers/article/how-to-appeal-dasher-account-deactivations?ctry=us&divcode=nc
- Uber: https://www.uber.com/us/en/legal/general-community-guidelines/
- Grubhub: https://driver-support.grubhub.com/hc/en-us/articles/33198547098644-Delivery-Partner-Deactivation-Challenge-Procedure

Privacidade: avaliar enquadramento do operador, contratos, dados tratados e estados atendidos antes da comercialização ampla; arquitetura local não equivale a certificação de conformidade. A CPPA informa critérios de cobertura CCPA e obrigações específicas para prestadores/contratados: https://cppa.ca.gov/faq.html . Não é possível concluir aplicabilidade apenas pelo tamanho atual do aplicativo. Direitos de exclusão/exportação local estão disponíveis, mas documentos baixados e dados de licenciamento no servidor têm ciclos distintos; não apresentar exclusão do cofre como exclusão de todos os dados comerciais. Outras leis estaduais não foram mapeadas integralmente. Revisão por profissional habilitado é necessária para parecer sobre uma situação concreta.

Não substitui advogado habilitado; não impede juridicamente desativação, não garante reativação ou admissibilidade de documentos. Fora do catálogo, informar ausência de fonte verificada, não ausência de direitos.

## 6. Validação executada e pendências

Localmente: npm test passou com 68 testes Node (incluindo 14 novos testes), 41 testes das ferramentas, 26 verificações de qualidade, verificação de entrada desktop/mobile e 300 verificações integradas com Worker/D1 locais. Quatro testes Python de publicação passaram. Dois conjuntos de 5.000 combinações verificam cálculos financeiros e índice. npm audit sem vulnerabilidades conhecidas nas dependências instaladas. `git diff --check` e sintaxe dos módulos novos verificados.

As 14 novas verificações abrangem: vazios/Não sei/condicionais, todos os limites de classificação, fator grave com peso zero, pesos inválidos, 5.000 combinações independentes, datas/fusos, revisões, backup antigo, recuperação com original e hash, PDF e ZIP, exclusão de dados não selecionados, licença errada, adulteração, falha de armazenamento e repetição, conflito entre abas, catálogo geográfico, extração de notificação, gráficos e fluxo JSDOM completo de iPhone/Android/desktop. JSDOM é simulação, não Safari físico.

O Chromium local não iniciou: socket() Operation not permitted. Teste nativo separado preparado para GitHub Actions (Chromium desktop/mobile e WebKit mobile), com API fictícia apenas no teste de interface e arquivos fictícios, sem credenciais reais. A execução GitHub Actions 44665414428 aprovou os três fluxos nativos: Chromium desktop, Chromium móvel e WebKit móvel. A API de validação é uma fixture local nesse teste de interface; a autenticação real com Worker/D1 local foi validada separadamente na suíte integrada. Não equivale a Safari em iPhone físico.

Aceite manual obrigatório da nova versão no iPhone/Android: entrar com licença de teste; criar/cofre ou abrir backup de teste da mesma licença; concluir diagnóstico; confirmar salvamento; fechar e reabrir; corrigir e verificar ambas revisões; salvar incidente com foto/áudio/vídeo dentro dos limites; baixar original; gerar PDF/ZIP com diário selecionado; abrir cada download; exportar UWKV1 e restaurar com chave correta; conferir conteúdo e anexos; testar permissões concedidas/negadas. Não limpar dados legítimos para testar. Conferir interface em 320 px e desktop. O tempo aproximado de um minuto é objetivo de UX, não medição de usabilidade concluída.

## 7. Custos, publicação e rollback

Sem novos serviços, APIs externas, armazenamento pago ou mudanças Cloudflare. Playwright é dependência de desenvolvimento para testes, não é enviado ao usuário. GitHub Actions usa runner público padrão sem serviços adicionais. Dados novos permanecem no aparelho, não consomem D1/R2. O uso de Worker/D1 de licenciamento continua sujeito aos limites já existentes; não existe promessa de capacidade ilimitada.

Manter produção anterior até conferir o build de prévia e concluir aceite físico. Para rollback, usar commit base/branch de recuperação sem apagar IndexedDB/localStorage ou restaurar D1. Exportar cofre antes de alternar versões; guardar a cópia externa e chave. A UI antiga não oferece diagnóstico; não editar cofre novo numa versão antiga durante recuperação. Confirmar cada implantação por status de build e arquivos servidos, não só por merge no GitHub.


### Roteiro de aceite do índice

Na própria prévia, use o código completo da licença de teste 001 e somente dados fictícios. Essa licença possui cofre de teste separado por instalação; um backup feito noutra instalação de teste não deve ser usado para simular recuperação de cliente.

1. Preencha cidade/estado e todas as perguntas visíveis com Não. Resultado esperado: 0/100, baixa exposição, sem garantia de segurança.
2. No mesmo relatório, altere automação para Sim, informe finalidade fictícia, responda aceitação automática Sim, solicitação de credenciais Não, acesso privado Não e conhecimento das permissões Sim. Mantenha as outras respostas Não. Esperado: 50/100 e classificação crítica pelo fator grave, mesmo abaixo de 60.
3. Aguarde a mensagem de salvamento, consulte o histórico e confirme as duas versões. Feche/reabra o cofre com a chave correta e confira novamente. Não confundir essa chave com a licença de acesso.
4. Em Minha Defesa, selecione esse relatório e uma ocorrência fictícia com anexo. Gere PDF/ZIP e confira somente os itens selecionados. Exporte backup UWKV1, mantenha a chave original separada e teste a restauração na mesma instalação de teste. Não excluir registros reais para testar.


## 8. Evidências finais

Código funcional aprovado: b523c38b494a21af6fccbb4dd20299a53ccb7365.

- CI local + nativo, ambos aprovados: https://github.com/predinaldosilva-max/EBOOK-CLAUDE-/actions/runs/44665414428
- Artefato com três capturas e PDFs/ZIPs/backups fictícios: https://github.com/predinaldosilva-max/EBOOK-CLAUDE-/actions/runs/44665414428/artifacts/14597667476
- Revisão da implementação: https://github.com/predinaldosilva-max/EBOOK-CLAUDE-/pull/10
- Prévia verificada no navegador, tela de acesso v2.1.0: https://usa-work-kit-2-protecao-local-usa-work-kit.pr-edinaldosilva.workers.dev/

Não houve merge na main; a versão oficial foi preservada. A prévia exige licença válida; usar código completo de teste 001, não os dígitos 001 isolados. Não disponibilizamos credenciais neste relatório. Os arquivos do primeiro teste nativo também foram inspecionados com pdfinfo/pdftotext; o ZIP continha o original cujo hash SHA-256 foi reconferido, e UWKV1 não continha texto dos registros em claro. Apenas dados fictícios foram usados.
