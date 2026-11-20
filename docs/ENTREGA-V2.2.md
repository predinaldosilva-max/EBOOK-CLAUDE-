# USA Work Kit v2.2 — mapa pessoal e identidade

## Escopo
Base de produção f81abbc17e8bfeefc4d64aaaca6aa44bb3230571 (v2.1.0), preservada. Branch feature-earnings-map-v2.2; ponto local recovery-before-v2.2. Nenhuma alteração no Worker, D1, autenticação, licenças, checkout ou landing page.

## Removido
Formação de preço de serviços: cálculo de orçamento por horas/materiais/margem tem menor aderência ao trabalho com ofertas de plataformas. Removidos rota, tela, ícone, motor e traduções exclusivos, além de testes desse recurso. Campos compartilhados com Mensagens continuam. Rascunhos legados são reconhecidos somente pela migração de backup e preservados em `archivedQuotes`, exportáveis em Relatórios. Nenhuma exclusão silenciosa; o arquivo local original não é apagado antes de um salvamento válido.

## Mapa de Ganhos Real
Novo módulo de cálculo puro e UI dentro do mesmo cofre IndexedDB/AES-GCM por licença. Captura plataforma, total já com gorjeta, milhas, minutos já com espera, loja e data/hora/fuso automáticos. Região, espera medida e redução de gorjeta são opcionais. Não há pedido de credenciais ou compartilhamento; `schema`, `source: manual`, `sharing: local-only` deixam explícita a origem. Não existe coleta coletiva implementada.

Configuração veicular nova e compartilhada a partir do Controle de Despesas: MPG, preço por galão, desgaste e outros custos por milha, mínimos por hora/milha e meta diária. O controle antigo não tinha MPG/combustível. Importação opcional do custo por milha da calculadora para desgaste zera combustível e pede revisão; nenhum custo é contado duas vezes. Confirmar as configurações também atualiza custo/milha e mínimo/hora no rascunho da calculadora de entregas, com aviso visível; campos restantes e receitas anteriores são preservados. Custos históricos mantêm snapshot da configuração, não são recalculados silenciosamente após mudança.

Fórmulas: combustível = milhas × preço/MPG; custos = combustível + desgaste/milha × milhas + outros/milha × milhas; líquido = total − custos; líquido/h = líquido × 60/minutos; líquido/milha = líquido/milhas. Zero milhas gera indicador indeterminado, não Infinity. Critério de Aceite: ambos os mínimos atendidos; No limite: ambos ao menos 90% dos mínimos ou milhas zero; Recuse: demais casos. Orientação matemática independente da plataforma, sem aceitação automática.

Janelas de 3 horas por dia da semana e fuso; mínimo de 10 pedidos totais e 3 por janela. Rankings ponderam os ganhos pelo tempo total, sem média ingênua das taxas individuais. Lojas são agrupadas com região quando informada. Espera desconhecida não vira zero. Melhores/piores e sugestão para o dia vêm somente da amostra pessoal, sem previsão de demanda. Meta considera líquido dos pedidos do dia atual. Os dados do mapa não duplicam as receitas antigas: o dashboard financeiro legado permanece com seu escopo anterior; Relatórios oferece acesso ao mapa para exportação após desbloquear o cofre.

Pedidos podem ser corrigidos ou excluídos com confirmação. CSV usa o exportador existente e protege fórmulas; impressão/PDF pelo diálogo do navegador. Registros entram automaticamente no UWKV1. Limite de 10.000 pedidos, sujeito ao limite total do cofre de 30 MiB de JSON; não é armazenamento ilimitado. Objetivo de cadastro em 10 segundos depende do usuário, teclado e preenchimento prévio; não medido como estudo de usabilidade.

## Proteção e direitos
Faixas centralizadas em `BANDS`: 0–19 Risco baixo, 20–39 Risco moderado, 40–59 Cuidado, 60–100 Alerta máximo. Fator grave continua impondo alerta máximo independentemente da soma. Mensagem por faixa, 2–3 ações prioritárias e aviso visível de índice declarado, não probabilidade. Bandas/índice anteriores permanecem legíveis sem modificar ou invalidar backups v1.

Fontes jurídicas existentes passam a mostrar nome da autoridade, abrangência municipal/estado ou política contratual, revisão e aviso de mais de seis meses. A legislação continua limitada ao catálogo verificado NYC/Seattle. Não foi ampliada a abrangência jurídica nem alterada a data de revisão para fingir nova pesquisa. Aviso fixo sobre caráter informativo e variações por estado, cidade e contrato. Não oferece parecer jurídico.

## Contestação e recuperação
Modelos por plataforma (Instacart/DoorDash/Uber Eats/Grubhub; genérico para outras) e pelos dez tipos existentes de ocorrência. Inglês por padrão, acompanhado do modelo traduzido no idioma de interface. Texto livre permanece no idioma original e edições no inglês não são traduzidas automaticamente: não há tradutor externo nem envio de documentos. Sem fatos inventados ou promessa de reativação.

Guia aberto no primeiro uso do cofre, chamada na home e lembrete a cada 7 dias. Chave separada, arquivo baixado, confirmação humana de guarda e teste de leitura/descriptografia/validação sem substituir dados. Testar não é apagar o cofre. Backup pode incluir snapshot financeiro cifrado; restauração valida a mesma licença e restaura o snapshot quando presente. O financeiro local só é substituído depois de confirmar gravação. A gravação do cofre e do financeiro não é uma transação única entre IndexedDB/localStorage: se falhar a segunda gravação, o erro é mostrado e os dados financeiros anteriores permanecem, permitindo nova tentativa. A opção de incluir financeiro pode ser desmarcada em cofres próximos do limite; financeiro também mantém backup JSON separado. Lembretes não são garantia de que o arquivo foi salvo. Perder a chave original torna o backup cifrado irrecuperável; novo cofre não recupera o anterior.

## Identidade visual
Original fornecido IMG_2937.jpeg preservado sem alteração em assets/brand-original.jpeg e utilizado no destaque e splash. Paleta observada: verde escuro #0c2923, sálvia #477762, prata #d9e6de e detalhe dourado #c6ba8c. Tokens em css/tokens.css; fonte de sistema; raios, sombra e espaçamentos definidos ali. Ícone vetorial UK adaptado do ícone nativo existente, com versão PNG 180/192/512, favicon, manifest e cores PWA. Faixas têm texto e cores distinguíveis verde/amarelo/laranja/vermelho; não dependem apenas de cor.

## Testes e revisão
Novos testes cobrem cálculo, limiares, espera desconhecida, amostra, fuso, migração de rascunho, criptografia, backup, teste não destrutivo, falha de escrita, adulteração, licença errada, idiomas, modelos e navegação. Suíte anterior preservada com exclusão apenas dos testes do recurso retirado. Execução nativa Chromium desktop/mobile e WebKit é feita no GitHub, pois sockets do Chromium local são recusados neste ambiente. Os dados de teste são fictícios.

Aceite físico antes de substituir produção: testar no iPhone/Android cadastro de pedido, configuração de custos, CSV/PDF, fechar/reabrir cofre, UWKV1 e teste de leitura; conferir aparência do logotipo e rótulos das faixas. Não limpar registros reais para testar. A prévia tem origem diferente; usar código completo de licença de teste 001 e cofre da própria prévia. O cofre de licença 001 é isolado por instalação.
