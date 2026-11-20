# Auditoria antes das alterações v2.2
Base f81abbc17e8bfeefc4d64aaaca6aa44bb3230571, produção v2.1.0. Backup Git: tag recovery-before-v2.2; nenhuma migração D1.

| Recurso | Implementação atual | Ação |
|---|---|---|
| Entregas | oferta/gorjeta, custo por milha, tempo, comparação, receitas | preservar |
| Trabalho | hora/dia/serviço/semana/projeto, receitas | preservar |
| Metas | planejamento semanal | preservar |
| Despesas | categorias, pago/pendente, pessoal/negócio | preservar e compartilhar configuração veicular nova |
| Preço de serviços | orçamento de mão de obra/material/margem; somente rascunho e impressão | substituir: menor aderência a delivery; arquivar rascunho antigo |
| Mensagens | modelos PT/ES/EN, cópia | preservar |
| Relatórios | totais, CSV, impressão, backup JSON por licença | incluir pedidos sem duplicar receitas |
| Proteção | IndexedDB AES-GCM, UWKV1, anexos, revisões, índice, PDF/ZIP | preservar; evoluir faixas sem invalidar relatórios v1 |
| Direitos | catálogo local NYC/Seattle, fontes de plataformas | identificar abrangência/revisão/desatualização |
| Acesso | Worker/D1, licença e instalação | intocado |

Arquitetura vanilla JS, módulos estáticos, bibliotecas locais; seis ferramentas roteadas em app.js. Estado financeiro em localStorage por licença; cofre separado e cifrado. Não há ajustes de MPG/combustível no controle de despesas existente: reaproveitar o custo/milha do rascunho de entregas como opção de importação explícita, criar configurações compartilhadas. Novos pedidos e dados de loja/região serão guardados no cofre cifrado, não em localStorage. Estatísticas ponderadas por tempo/milhas, custos estimados identificados, amostra mínima e ausência de inferência coletiva.

Identidade: imagem fornecida upload/IMG_2937.jpeg, verde escuro, verde sálvia, prata e detalhes dourados. Usar fonte de sistema e tokens únicos. Sem alterações na landing page/checkout.
