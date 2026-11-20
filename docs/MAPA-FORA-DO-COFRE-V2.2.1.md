# USA Work Kit 2.2.1 — Mapa fora do cofre

O mapa abre diretamente após o acesso por licença, sem chave de recuperação. Os pedidos ficam no armazenamento local financeiro separado por licença. Não recebem a criptografia extra do cofre e não são enviados a servidores. O aviso informa essa diferença nos três idiomas.

A Proteção de Conta permanece criptografada. Seus registros, evidências, autenticação e banco D1 não foram alterados.

## Dados anteriores

No mapa, “Copiar pedidos do cofre antigo” permite desbloquear o cofre e confirmar a cópia. O destino precisa estar sem pedidos. A origem criptografada permanece intacta. Nenhuma cópia automática ou exclusão de origem ocorre.

## Backup e exportação

O JSON em Relatórios inclui configurações e pedidos do mapa; a restauração valida todos os cálculos. O próprio mapa exporta CSV e impressão/PDF. Backups antigos do cofre continuam aceitos. A cópia financeira opcional dentro do backup do cofre também inclui o mapa atual. Os totais financeiros anteriores permanecem com seu escopo anterior, evitando duplicação de receitas registradas manualmente.

## Destaques

Proteção de Conta: fundo amarelo-claro. Mapa de Ganhos: azul-claro, imediatamente abaixo. Cores em tokens centrais, botões verdes e texto escuro.

## Verificação

Suíte npm test e quatro testes Python de build executados com sucesso. Testes DOM cobrem acesso sem chave, custos, CSV, persistência, isolamento por licença, conflito de migração e cópia explícita preservando origem. Navegadores Chromium desktop, Chromium móvel e WebKit móvel executam os fluxos no GitHub Actions; consultar o resultado do commit correspondente. WebKit automatizado não substitui teste físico no iPhone.

Ponto de recuperação: branch backup-before-map-separation. Produção/main preservada; entrega na prévia para revisão.
