> Versão 1.1.0: o acesso agora é validado no servidor; abertura e revalidação exigem internet. Orientações antigas sobre acesso local/offline foram substituídas. Consulte ../../IMPLANTACAO.md.

# Atualização 1.0.3 — senhas individuais

10 testes adicionais em tests/access.js aprovados: 50 hashes distintos, ausência de senhas originais no código, normalização, entrada inválida, tela bloqueada, senha errada, senha correta, acesso lembrado, token desconhecido e armazenamento indisponível. Total: 88 verificações automatizadas, incluindo os 5.000 cenários anteriores. A identificação de celulares e o acesso foram testados com ambiente simulado; validação física no iPhone/Android continua pendente.

Proteção apenas local: link sem senha não libera a interface; compartilhar senha libera outros navegadores. Manipulação do código/armazenamento pode contornar a barreira. Não é licença vinculada a aparelho.

# Atualização 1.0.2 — bloqueio de desktop

11 verificações novas aprovadas em tests/device.js: iPhone Safari/Chrome, Android Chrome/Samsung Internet; bloqueio Windows, Mac, Linux, iPad, tablet Android e identificação desconhecida; saída antes de carregar dados ou iniciar calculadoras no desktop. Mais 67 verificações anteriores reaprovadas, incluindo 5.000 cenários. Total: 78 verificações automatizadas.

Identificações de dispositivos são simuladas, não aparelhos físicos. Testes de interface desktop descritos abaixo são históricos da versão 1.0.1; na 1.0.2 esse uso é intencionalmente bloqueado. Os testes reais no iPhone e Android continuam pendentes.

# Relatório de testes — 1.0.1

Execuções: 14 e 15/11/2026, data de Brasília. Ambiente: Node.js 24 e Chrome de desktop em ambiente remoto. Dados fictícios, não incluídos no produto.

## Testes automatizados

Comando: `node tests/test.js`.
Resultado final: **67 verificações automatizadas aprovadas** (41 em test.js e 26 em quality.js), incluindo **5.000 cenários de cálculo** gerados com referência independente. Mais **4 testes de build/publicação** do repositório aprovados.

A bateria adicional cobre entradas coercíveis inválidas, 20.000 registros, rejeição acima do limite, recuperação após falha de armazenamento, rascunhos no backup, datas e anos bissextos, proteção de chaves de protótipo, CSV numérico, cache e fallback offline do service worker.

Cobertura: exemplos conhecidos de entrega, cinco modalidades de trabalho, metas e margem; campos vazios, negativos, NaN, infinito, limite numérico, duração/meta zero; zero milhas; resultado negativo; projeções; persistência, edição, exclusão e round trip JSON; versão incompatível, IDs duplicados, datas impossíveis, drafts malformados, arquivo com valores negativos; falha de armazenamento e conteúdo corrompido; conciliação de relatório; escape HTML, proteção de fórmulas em CSV; paridade das chaves PT/ES e existência dos recursos vinculados.

## Testes no navegador

| Teste | Resultado observado |
|---|---|
| Entrega: 20 + 5, 10 milhas × 0,50, 30 min totais | Resultado 20; 40/h; 2,50/milha |
| Registrar corrida | Histórico atualizado, dado persistiu ao recarregar |
| Trabalho: 20/h × 40h − 100, 5 dias | Bruto 800; resultado 700; 17,50/h; semanal 700; mensal 3.033,33 |
| Salvar fonte de renda | Registro exibido no histórico |
| Meta 1.200, acumulado 750, 3 dias, 20h a 25/h | Restante 450; 150/dia; 18h necessárias; 62,5%; projeção 1.250 |
| Mudança para espanhol e retorno | Rótulos, avisos e números traduzidos; valores preservados |
| Despesa | Criação 30; edição para 35; marcação paga; total atualizado |
| Exclusão de despesa | Confirmação exibida; ao aceitar, registro removido e total zerado |
| Relatório integrado | Receita 825 − custos 105 − despesas 35 = 685 |
| Exportação CSV | Download concluído pelo navegador |
| Exportação JSON | Download concluído pelo navegador |
| Restaurar o JSON exportado | Seletor de arquivo, confirmação e mensagem de restauração concluída |
| Preço: 4h × 25 + 20 + 10, margem 20% | Base 130; preço 162,50; adicional 32,50 |
| Orçamento e relatório imprimíveis | Botão acionado e conteúdo completo gerado em printArea; arquivo PDF final não validado |
| Mensagem em inglês personalizada | Nome, serviço, valor e data substituídos; cópia confirmada |
| Layout estreito | Iframe com largura nominal 390 px, útil 375 px; painel e entrega inspecionados; scrollWidth = clientWidth = 375 |
| Cache offline | Servidor de prévia desligado; página recarregada pelo cache; pagamento alterado de 20 para 30; resultado 30 e 60/h, com histórico preservado |

A conferência de 390 px é uma simulação de viewport no Chrome de desktop. NÃO é teste em iPhone/Android. O teste de servidor desligado prova o cache naquela sessão; não prova comportamento de limpeza de cache, primeira instalação ou persistência em dispositivos reais.

## Verificação do pacote

- ZIP criado com caminhos relativos sob USA-WORK-KIT/.
- Integridade do ZIP conferida e conteúdo extraído em outra pasta.
- Mesmas 67 verificações executadas na cópia extraída, incluindo os 5.000 cenários.
- Arquivos HTML/CSS/JS, imagens, manifesto, service worker, manuais e documentação incluídos.
- Sem node_modules, credenciais, dados do usuário, arquivos de backup de teste ou ferramentas do ambiente.
- Inspeção de código: nenhuma chamada a API paga, CDN ou serviço externo. O único fetch é de recursos estáticos da mesma origem no service worker.

## Pendências que não podem ser apresentadas como aprovadas

1. **Safari em iPhone real**: abertura, instalação HTTPS, entradas decimais, impressão, exportação/restauração e offline após reiniciar.
2. **Chrome em Android real**: mesmos fluxos e abertura de arquivo local no gerenciador específico.
3. **Safari de desktop**: abertura file://, LocalStorage e exportações; não disponível no ambiente.
4. **Arquivo PDF final**: conteúdo e chamada de impressão conferidos, mas paginação/renderização final do PDF e diálogo de impressão de cada plataforma não verificados.
5. **Abertura file:// da cópia extraída em navegador real**: integridade, recursos e testes Node aprovados; teste visual file:// não executado. O navegador usado na revisão serviu os mesmos arquivos por localhost e depois por cache.
6. **Publicação comercial e acesso do comprador**: não realizados. Publicação de teste atualizada para 1.0.1. Restrição de GitHub Pages documentada em HOSPEDAGEM.md.
7. **Kiwify**: produto/checkout/upload e compra de teste não executados; vídeo opcional não produzido.

Conclusão técnica: núcleo e seis módulos implementados, com verificações descritas acima. Não declarar “totalmente testado em celulares” ou “pronto para vender sem ressalvas” antes de concluir as pendências relevantes ao público móvel.

## Regressão adicional no Chrome — 15/11/2026

- Oito telas em larguras nominais 320, 390, 768 e 1.200 px: 32 combinações, nenhuma com overflow horizontal do documento. Navegação horizontal móvel é intencional.
- Despesa com nome literal `<b>QA & teste</b>`, valor 80, paga: troca PT→ES preservou nome, valor, vencimento e checkbox; gravação correta. O nome foi exibido como texto, sem HTML ativo.
- Edição para 95 e ES→PT: valor preservado, salvamento correto e total 95 após recarregar.
- Esses testes são de Chrome desktop com viewport em iframe; não simulam o motor Safari nem substituem dispositivos reais.

Nenhuma quantidade finita de cenários representa todos os testes possíveis. Não se atribui cobertura percentual de código a esta bateria.

- Duas abas reais do mesmo navegador: mudança de despesa paga para pendente refletida na outra aba sem recarregar.
- Publicação GitHub Actions: execução 43736047005 concluída com sucesso.

- Regressão adicional: entrada decimal .50 aceita. Instalação de cache atualizada para solicitar arquivos com cache reload, evitando assets HTTP antigos em novas versões.
