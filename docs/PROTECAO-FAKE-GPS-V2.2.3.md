# USA Work Kit 2.2.3 — diagnóstico preventivo e fake GPS

## Escopo

Inclusão de uma pergunta voluntária sobre falsificação intencional de localização, esclarecimento do índice e ajuste dos critérios de aceite automatizado. Nenhuma ferramenta de localização falsa, detecção de bots, acesso a contas, captura de pedidos ou sincronização foi implementada. O questionário não usa GPS para verificar respostas. A informação declarada continua no cofre local criptografado.

## Critérios do modelo v2

- Sem fatores declarados, respostas completas: 0/100. Todas as respostas Não com automação Não não geram fator crítico.
- Ferramenta automatizada: 5 pontos. Aceite automático: 25 pontos, sem imposição isolada de classificação máxima. Juntos, com demais fatores ausentes e permissões conhecidas: 30/100, Atenção. A recomendação continua sendo interromper usos não autorizados e consultar as regras oficiais.
- Não conhecer permissões: 10 pontos adicionais. Não nesta pergunta significa permissões desconhecidas, esclarecido no rótulo. Automação + aceite + permissões desconhecidas: 40/100, Cuidado.
- Fake GPS intencional declarado: 60 pontos e sinal prioritário crítico. Isso NÃO significa 60% de chance de desativação. Não: nenhum fator de fake GPS; Não sei: incerteza, não assumida como Não; resposta vazia: diagnóstico incompleto. Falha involuntária de GPS não equivale a declarar falsificação.
- Outros fatores graves de segurança continuam podendo produzir alerta máximo mesmo com fake GPS Não.

Faixas mantidas: 0–19, 20–39, 40–59, 60–100; fatores críticos podem sobrepor a faixa. Pesos são critérios iniciais de prioridade preventiva do produto, configuráveis e versionados, sem calibração estatística. A mudança de peso não demonstra queda real da probabilidade de desativação. Não garante segurança nem elimina violações anteriores.

## Mensagem

Falsificar localização pode violar regras e levar à desativação. A orientação é interromper o fake GPS, usar localização real e consultar suporte oficial. Não se afirma que seja a maior causa de desativação nem se recomenda uso moderado como seguro. Conteúdo nos três idiomas. O aviso de 0–100 pontos, sem porcentagem/probabilidade, permanece visível na avaliação.

## Fundamentação verificada em 20/11/2026

- Instacart, termos do Shopper App, seção 3.2: restringe automação e meios não autorizados para obter vantagem. https://www.instacart.com/shoppers-terms
- Instacart, integridade da plataforma: descreve monitoramento de dispositivos e locais inesperados. Não divulga ranking de causas de desativação. https://company.instacart.com/shopper-community/ensuring-the-integrity-of-the-instacart-platform
- Uber, página dos EUA para motoristas e entregadores: inclui manipulação do funcionamento da plataforma e GPS entre atividades que podem levar à perda de acesso. https://www.uber.com/us/en/drive/driver-app/deactivation-review/
- DoorDash, política para Seattle: inclui falsificação de localização/GPS. O escopo local dessa página não foi generalizado como lei ou regra idêntica para todas as plataformas. https://help.doordash.com/en-us/dashers/article/seattle-deactivation-policy

As fontes não estabelecem taxas de banimento, pesos estatísticos ou frequência segura de fake GPS. O relato comercial do proprietário foi considerado contexto de uso, não evidência estatística generalizável.

## Compatibilidade

O modelo antigo daily-2026-11-20-v1 permanece disponível para validar relatórios existentes sem reclassificá-los. O novo modelo é daily-2026-11-20-v2. Campos ausentes em registros antigos não são preenchidos como Não. Os resultados, pesos, revisões e recomendações antigos são preservados. A interface identifica avaliações históricas de outro modelo e orienta comparar apenas o mesmo modelo.

Não mudou a criptografia, a chave de recuperação, o formato UWKV1, o banco IndexedDB, o servidor, D1, acesso ou licenciamento. Não é necessário criar novo cofre ou gerar nova chave por causa desta atualização. Na edição de relatório antigo, a nova pergunta precisa ser respondida para salvar uma nova revisão; a revisão anterior permanece.

## Verificação

Testes específicos cobrem fake GPS Não/Sim/Não sei/vazio, aceite automático sem outros fatores, permissões desconhecidas, combinações graves, três repetições do modelo, interface iPhone/Android/desktop, histórico antigo e restauração com a mesma chave. Um fixture real do modelo anterior é comparado byte a byte para impedir alteração retroativa dos resultados.

A suíte geral executa três rodadas completas. O teste nativo em Chromium desktop, Chromium móvel e WebKit móvel também passa pelos cenários 0, 30, 60 e 90/100, alerta específico, retorno a Não, salvamento, recarga, PDF/ZIP/backup e demais ferramentas. Esses testes automatizados não equivalem a execução física em um telefone.

Publicação somente após sucesso no GitHub Actions. Backup de código da produção anterior: commit 727170c47d793d4f82241cc6d1dae419944776f4. O cache PWA usa uma nova versão; dados locais não são apagados.
