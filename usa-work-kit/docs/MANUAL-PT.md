> Versão 1.1.0: o acesso agora é validado no servidor; abertura e revalidação exigem internet. Orientações antigas sobre acesso local/offline foram substituídas. Consulte ../../IMPLANTACAO.md.

# Manual — USA WORK KIT

## 1. Comece aqui

Desde a versão 1.0.2, use somente celular: Safari no iPhone ou Chrome no Android, pela publicação HTTPS. Computadores e tablets são bloqueados. Escolha PT-BR ou Español. Nenhuma conta é solicitada. O ZIP não é instalador móvel; consulte HOSPEDAGEM.md. Use a versão móvel do navegador e evite modo privado.

Todos os valores são USD. Milhas e horas não são convertidas. Campos monetários aceitam decimais segundo o navegador; se a vírgula não for aceita, use ponto. Os valores são exibidos na convenção do idioma selecionado. Resultados são estimativas antes de impostos.

## 2. Entregas

Informe pagamento, gorjeta somente se NÃO estiver no pagamento, milhas totais incluindo retorno/deslocamento, custo por milha, duração, espera e sua meta por hora. Não há tarifa automática: estime seu custo com combustível, desgaste, manutenção e demais custos aplicáveis.

Fórmulas: bruto = pagamento + gorjeta adicional; custo = milhas × custo por milha; resultado = bruto − custo; por hora = resultado ÷ ((minutos + espera) / 60); por milha = bruto ÷ milhas. Zero milhas torna a receita por milha não calculável. A duração deve ser positiva. Valores negativos são rejeitados, mas um resultado negativo é exibido normalmente.

Exemplo: pagamento 20, gorjeta 5, 10 milhas, custo 0,50, 25 minutos + 5 de espera → bruto 25, custo 5, resultado 20, 40/h, 2,50/milha.

Guarde a oferta A, altere os dados para B e compare resultado, ganho/hora e receita/milha. A comparação fica na sessão, não no backup. Só registre a corrida depois de concluída, uma única vez. Escolha a data real. O histórico soma o dia e a semana desde segunda-feira até hoje. Receita bruta do histórico considera todos os registros desse módulo.

## 3. Trabalho

Escolha modalidade. Por hora: valor × horas; por diária: valor × dias; por serviço: valor × quantidade; semanal e projeto: o valor informado é o total. Horas e dias são o total do período coberto pelo pagamento, não por serviço. Mantenha quantidade em 1 quando não se aplica.

Resultado = receita − despesas; ganho/hora = resultado ÷ horas. Projeção semanal = resultado ÷ dias trabalhados × dias planejados por semana (1–7). Mensal = semanal × 52/12. Isso pressupõe repetição do mesmo ritmo. Salve cada fonte de renda, com nome e data. O lançamento inteiro entra na data escolhida, inclusive pagamento semanal ou projeto; não há distribuição automática por dia. Para corrigir receita, exclua o lançamento e registre novamente.

## 4. Metas

Informe meta, resultado já acumulado após despesas, dias e horas restantes e resultado estimado/hora. Esses números são manuais, independentes do histórico, e os rascunhos são salvos automaticamente.

Restante = máximo(0, meta − acumulado). Por dia = restante/dias. Horas necessárias = restante/ganho por hora. Progresso = acumulado/meta × 100; a barra visual para em 100%, mas o percentual pode ultrapassar. Projeção = acumulado + horas disponíveis × ganho/hora. Meta deve ser positiva; zero dias ou zero ganho/hora produzem “Não calculável” onde necessário. Uma meta já atingida precisa de zero horas.

A meta salva é a atual: atualize-a ao começar cada semana. Os relatórios identificam esse retrato manual; não o confundem com histórico de metas por período.

## 5. Despesas

Preencha descrição, valor, vencimento, categoria, tipo pessoal/profissional e situação paga/pendente. Salve; use Editar, Alterar pago/pendente e Excluir no histórico. Excluir pede confirmação. O seletor mensal filtra pelo vencimento. Os totais incluem contas pagas e pendentes, não representam somente saída de caixa.

Não repita aqui despesas já embutidas no custo por milha ou no rendimento do módulo Trabalho. Os relatórios descontam ambos; repetir causa dupla contagem. Use despesas adicionais para gastos ainda não descontados.

## 6. Preço de serviços

Informe remuneração desejada pelo seu tempo, materiais, transporte, outros custos e margem sobre o preço final. Base = horas × remuneração/hora + despesas; preço = base/(1 − margem/100). Margem deve ser menor que 100%. Resultado além da remuneração = preço − base. A remuneração pelo seu trabalho já está na base; esse resultado é adicional.

Exemplo: 4 h × 25 + 20 materiais + 10 transporte = 130 de base; margem de 20% → 162,50 de preço, 32,50 adicionais. Preencha prestador, serviço, descrição, data e condições antes de imprimir. Na impressão, escolha Salvar como PDF. Não são calculados impostos, retenções ou taxas. Nenhum preço é apresentado como tarifa oficial.

## 7. Mensagens

Escolha um dos dez tipos e o idioma inglês, português ou espanhol. Personalize nome, serviço, valor e data/horário. A data é texto livre para evitar ambiguidade; escreva-a no idioma do cliente. Campos vazios aparecem entre colchetes. Revise e toque em Copiar. Se o navegador bloquear a área de transferência, selecione e copie manualmente. Nada é enviado automaticamente.

## 8. Relatórios e backup

Escolha início e fim (inclusivos). Relatórios somam receitas pela data escolhida e despesas pelo vencimento. Resultado = receitas − custos dos rendimentos − despesas adicionais. CSV inclui linhas de atividade, totais e retrato da meta atual, quando válido. O relatório impresso também agrupa fontes de renda. CSV é UTF-8 com BOM, campos entre aspas e separador vírgula. Ao importar em planilhas, escolha UTF-8 e vírgula. Conteúdos que poderiam virar fórmulas recebem apóstrofo de proteção.

PDF usa a impressão do navegador: o aplicativo monta um documento e chama Imprimir; selecione PDF no sistema. Nenhum gerador externo é usado. Documento apenas de organização, não fiscal.

Exporte backup JSON regularmente e antes de limpar dados, trocar de navegador, mover a pasta local ou atualizar o produto. Para trocar de aparelho, exporte no antigo e restaure no novo. Restaurar substitui tudo após confirmação; não mescla. Arquivos inválidos, acima de 5 MB, versões incompatíveis e registros malformados são rejeitados. Máximo validado: 20 mil registros combinados; a capacidade real pode ser menor por limite de armazenamento.

Os backups não são criptografados. Guarde-os em local seguro. Não armazene senhas, cartões, documentos ou dados bancários. Se o navegador negar armazenamento, aparece aviso e o uso fica apenas na sessão; exporte antes de fechar. Se dados corrompidos forem detectados, o salvamento é bloqueado para não sobrescrever o conteúdo anterior; restaure um backup válido.

## 9. Offline e limites

O pacote local contém os arquivos necessários; `file://` depende do navegador. A versão HTTPS usa cache do navegador após a primeira carga completa e informa a disponibilidade em Relatórios e backup. O sistema pode remover cache/dados por falta de espaço. Não há garantia de persistência, sincronização nem funcionamento offline antes da primeira carga. Testes em aparelhos reais constam como pendentes em TESTES.md.


## Acesso com senha — versão 1.0.3
Abra no celular e digite a senha individual fornecida pelo vendedor após a confirmação da compra. O navegador lembra o acesso quando o armazenamento está disponível. Para fechar o acesso, toque em Bloquear acesso. Os registros financeiros não são apagados. Se limpar os dados do navegador, será necessário informar a senha novamente. Guarde sua senha. O backup JSON de registros não inclui a senha. Não existe vinculação a um único aparelho nesta versão. O vendedor não solicita senha da Kiwify nem de aplicativos de trabalho.
