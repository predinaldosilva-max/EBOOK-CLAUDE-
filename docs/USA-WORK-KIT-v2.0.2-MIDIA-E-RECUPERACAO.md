# USA Work Kit v2.0.2 — microfone, GPS e arquivos

18/11/2026. Continuação da conferência solicitada pelo proprietário. Base: release v2.0.1, commit 07bed4f8b27190bfbf0a35113411a3c0904533e6.

## 1. Correções concretas

- O MediaRecorder entrega seus últimos dados de forma assíncrona. Salvar imediatamente após Parar podia gravar a ocorrência antes da chegada do áudio. Agora a gravação permanece pendente até finalizar; Salvar informa para aguardar e não descarta nem encerra a captura.
- A solicitação de permissão para microfone também conta como trabalho pendente. Navegação mostra o aviso existente. Uma resposta atrasada só encerra seu próprio stream; não substitui o stream nem interrompe uma captura nova.
- Eventos do gravador usam referências locais para stream e recorder. Ao sair ou bloquear o cofre, as faixas são encerradas e callbacks antigos não alteram a próxima tela.
- Falhas de outros campos não encerram genericamente uma gravação ativa. Falha do próprio gravador encerra suas faixas. Áudio vazio é informado, sem criar anexo vazio.
- A escolha de formato considera a disponibilidade de isTypeSupported e mantém MP4/M4A, WebM e Ogg com extensão correspondente. Não foi adicionada conversão de gravações nem envio a terceiros.
- Download de proteção usa um link conectado ao documento, como o módulo financeiro já fazia. Depois da preparação, permanece um link explícito para baixar manualmente caso o navegador não inicie automaticamente. O link expira em 60 segundos; é necessário gerar novamente depois disso. A mensagem pede conferir o arquivo salvo, sem alegar que o navegador o salvou.
- Cache e identificação passam a v2.0.2. Sem mudança de formato do cofre, autenticação, D1, licenças, segredos ou endereço oficial.

## 2. Verificações executadas

A suíte completa passou: 42 casos Node, 41 testes básicos, 26 verificações de qualidade com 5.000 cenários matemáticos, 11 verificações de dispositivo, 300 assertions financeiras contra Worker/D1 locais e 4 testes Python do build. Total: 424 verificações; os 5.000 cenários fazem parte das verificações de qualidade, não são somados outra vez.

Novos testes reproduzem os problemas antes da correção e passam após ela:

1. Parar áudio, salvar antes do evento final e receber os bytes depois: formulário conserva a ocorrência e salva o áudio somente depois da finalização.
2. Permissão de microfone atrasada após sair e iniciar outra captura: stream antigo termina, novo permanece ativo, e sair encerra o novo.
3. GPS negado: texto preservado e alternativa manual utilizável.
4. Callback de GPS atrasado após abrir outra ocorrência: localização não é atribuída à ocorrência nova.
5. Download de .uwkv: âncora conectada ao documento, nome correto, link manual disponível e conteúdo cifrado UWKV1.
6. MP4/AAC e WebM/Opus: amostras sintéticas de silêncio de 0,2 segundo, identificadas por ffprobe, passam pela gravação simulada, armazenamento e download com igualdade byte a byte. As amostras não são gravações de um microfone físico.
7. Negação explícita de getUserMedia: aviso, estado pendente liberado, texto preservado e anexo manual salvo normalmente.

Continuam passando os testes anteriores: 20 cenários fictícios de Instacart/DoorDash, originais/revisões/hashes, PDFs PT/ES/EN, ZIP selecionado, cofre cifrado, restauração em outro armazenamento com a mesma licença e chave, isolamento A/B, limites de tamanho, entradas inválidas, conflitos de abas, cálculos, relatórios e ativação/reset locais. Nenhuma senha comercial nem registro de comprador foi usado.

npm audit retornou zero vulnerabilidades conhecidas nas dependências instaladas. Isso não certifica ausência de falhas do aplicativo.

## 3. Conferência de navegador e limites reais

A página oficial foi aberta no Chrome compartilhado e mostrou o bloqueio esperado para computador. Não houve ativação de produção ou mudança de identificação desse navegador.

A prévia Wrangler local não iniciou: uv_interface_addresses retornou erro de sistema. O Chromium isolado também não iniciou: socket() failed: Operation not permitted. Não foram desativadas restrições do ambiente nem usados esses erros como indicação de falha do app. WebKit/Safari de teste não estava instalado.

Por isso, sensores físicos, reprodução do áudio capturado em iPhone/Android, localização real, caixa nativa de salvar/compartilhar arquivos, abertura do arquivo no app Arquivos/Downloads, restauração após reinstalação e pressão real de armazenamento permanecem sem teste físico novo. Os testes de API, temporizadores e interface acima são simulados; não equivalem a Safari ou Android reais.

O proprietário relatou anteriormente funcionamento satisfatório em seus aparelhos. Essa informação não comprova os ensaios específicos acima. Não é possível concluir tecnicamente “sem nenhum problema” ou homologação móvel integral a partir deste ambiente.

## 4. Critérios de aceite físico ainda não comprovados

Em cada sistema, usando apenas uma licença de teste e dados fictícios:

- Gravar uma frase, parar, aguardar o áudio na lista, salvar ocorrência e reproduzir o original baixado.
- Negar microfone/GPS e conferir que texto e anexos manuais continuam funcionando.
- Autorizar GPS, registrar e conferir coordenadas/precisão indicadas; não confundir posição atual com local certificado da ocorrência.
- Baixar .uwkv, PDF e ZIP; localizar e abrir os arquivos no sistema. Testar o link manual se o automático não aparecer.
- Restaurar .uwkv com a chave correta em armazenamento limpo de teste e comparar ocorrência, revisões e anexo. Não limpar dados reais sem backup verificado.
- Fechar/reabrir navegador e testar interrupção de gravação, atualização, suspensão e falta de espaço.

Essa lista é uma pendência de validação, não uma alegação de execução.

## 5. Escopo de venda e recuperação

O módulo organiza fatos, originais e recursos revisáveis. Não impede desativação, não garante reativação e não monitora contas de delivery. A decisão e o canal de recurso pertencem à plataforma. Não há login, scraping ou automação de pedidos.

Custo zero estrito e recuperação manual preservados. Sem nuvem de anexos: backup cifrado e chave são necessários para recuperar o cofre em outro aparelho com a mesma licença. PDF/ZIP do recurso e backup financeiro são separados e não substituem o backup cifrado completo. Dados locais podem ser perdidos se o navegador for limpo ou o aparelho perdido sem backup.

Não foi implementada cobrança automática de assinatura nem as fases futuras Profit Hunter, turnos/GPS em segundo plano ou planejamento tributário ampliado.

## 6. Reprodução e rollback

npm ci; npm test; python3 -m unittest discover -s tests -p 'test_*.py' -v. Os testes usam apenas fixtures locais. Não executar seeds de teste no D1 de produção.

Reversão deste ajuste: frontend e cache do commit 07bed4f8b27190bfbf0a35113411a3c0904533e6. Não restaurar D1 nem apagar IndexedDB/localStorage para reverter interface. Backups UWKV1 permanecem compatíveis.
