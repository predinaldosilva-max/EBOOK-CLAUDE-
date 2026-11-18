# USA Work Kit — verificação ampliada v2.0.1

18/11/2026. Base oficial: 78cc44a88ac24de51b0ed9d461f2fa1cb4ad900b (v2.0.0). Correções restritas à interface do cofre e atualização do cache; backend, autenticação, esquema D1 e configuração Cloudflare preservados.

## Resultado executado

418 verificações aprovadas: 36 casos Node, 41 testes básicos, 26 verificações de qualidade (incluem 5.000 cenários matemáticos), 11 verificações de dispositivo, 300 assertions de integração financeira e 4 testes do build público. Os perfis iPhone/Android de interface são DOM simulado; não equivalem a Safari ou Chrome físicos.

- Ferramentas financeiras: entregas, comparação de ofertas, cinco modalidades de trabalho, metas, despesas/criação/edição/exclusão, precificação, 30 modelos de mensagens, cópia, relatórios, CSV, backup/restauração e recarga. Integração usa Worker real em workerd e D1 local com licença fictícia; sem escrever em produção.
- Proteção: 20 ocorrências fictícias (10 categorias em Instacart e DoorDash), com 60 anexos de teste PNG/WAV/PDF e 40 revisões. Categorias: gorjeta, cancelamento, cliente, estabelecimento, falha técnica, contestação de entrega, acusação, incidente de segurança, desativação e outros. Não são afirmações de que cada ocorrência causa desativação.
- Originais: bytes e SHA-256 conferidos; revisões anteriores preservadas. Entrada HTML fica como texto. HTML/SVG executável disfarçado de PNG, vazios, campos inválidos e coordenadas fora dos limites foram rejeitados.
- Recurso: modelos em PT/ES/EN, seleção de ocorrências e anexos, PDF legível nos três idiomas, relatório de múltiplas páginas, ZIP com exatamente os originais selecionados. Extração independente com pdftotext conferida. Nenhum registro DoorDash ou áudio não selecionado apareceu no recurso de teste Instacart.
- Recuperação: restauração em nova instância de IndexedDB com a mesma licença e chave, sem depender do aparelho antigo. Outra licença, chave errada e cópia adulterada recusadas. Exclusão removeu originais sem uso. Backup e chave externos continuam necessários.
- Limites: 200 ocorrências, 100 revisões por ocorrência, 20 anexos por revisão, 5 MiB por arquivo e 20 MiB de originais por cofre. Excesso recusado sem gravar parcialmente nem alterar o último estado válido. Arquivo grande sintético testa tamanho/armazenamento, não decodificação de imagem.
- Autenticação: ativação única concorrente, validação, licença de teste, reset autorizado, revogação do aparelho anterior, origem indevida e falhas de configuração. Testes locais, sem usar senhas reais.

## Defeitos reproduzidos e corrigidos

1. Novo registro ou edição podia descartar anexo pendente sem confirmação. Agora ações de novo/editar/backup/fechar/excluir ocorrência e restauração consultam o aviso de perda de anexos quando aplicável. Cancelar conserva o formulário e os arquivos. Remoção integral do cofre já exige confirmação destrutiva.
2. Selecionar foto após gravar áudio substituía o áudio ainda não salvo. Agora a seleção acrescenta arquivos à lista pendente. Teste com MediaRecorder simulado comprovou áudio e foto no mesmo registro.
3. Digitar no recurso não renovava o tempo de atividade do cofre. Eventos de entrada, teclado e ponteiro renovam a contagem; teste de relógio simulado comprovou que edição ativa mantém o cofre aberto e 10 minutos sem atividade o fecham.
4. Limpeza do formulário cancela o temporizador anterior de rascunho, evitando que ele atue no formulário seguinte. Formatos de dados e chaves permanecem os mesmos.

Cache e rótulos passam a v2.0.1 para distribuir o ajuste aos navegadores existentes.

## Limites da conclusão

Não houve teste físico novo de microfone, GPS, downloads, armazenamento cheio, encerramento forçado do sistema ou aparência em Safari/Android. GPS, microfone e temporizador foram simulados; indisponibilidade de microfone tem alternativa textual/manual. O proprietário relatou aprovação anterior em iOS e Android, mas isso não substitui esses ensaios específicos.

Os dados do cofre são locais cifrados; não há cópia automática na nuvem. Limpeza do navegador ou perda do aparelho sem backup e chave pode perder provas. Rascunhos não persistem anexos pendentes. Abertura/revalidação continua exigindo internet. Não se declara funcionamento offline integral.

O modelo do recurso tem três idiomas; a narrativa livre conserva o idioma escrito. PDF pode recusar caracteres fora da fonte suportada, com aviso, enquanto o ZIP mantém UTF-8. PDF/ZIP de envio não são cifrados. O pacote ZIP serve para organização: enviar PDF/originais nos formatos aceitos pelo canal oficial, sem presumir que a plataforma aceite ZIP ou áudio.

Não foi realizado envio real de recurso nem interação com contas de delivery. Não há garantia de impedir desativação ou obter reativação. O módulo organiza relatos/evidências; não monitora contas de terceiros e não comprova veracidade, autoria ou horário certificado. Hash comprova consistência dos bytes registrados.

A venda deve descrever exatamente esse escopo. Cobrança recorrente automatizada, Profit Hunter, GPS de turnos em segundo plano e planejamento tributário ampliado não integram esta versão.

## Referências públicas consultadas

- Instacart: https://company.instacart.com/shopper-community/ensuring-the-integrity-of-the-instacart-platform
- DoorDash: https://help.doordash.com/en-us/dashers/article/how-to-appeal-dasher-account-deactivations?ctry=us&divcode=nc

São orientações públicas, sem acesso a contas. O usuário deve seguir a notificação e os canais oficiais aplicáveis ao próprio caso. Não foram incorporadas regras automáticas ou listas de motivos presumidos.

## Reprodução e rollback

Executar npm ci, npm test e python3 -m unittest discover -s tests -p 'test_*.py' -v. Para gerar exemplos fictícios: UWK_QA_OUTPUT=/caminho/saida node --test tests/protection-expanded.test.mjs. Os testes nunca devem apontar fixtures para o D1 de produção.

Rollback do ajuste: retornar frontend e cache ao commit 78cc44a88ac24de51b0ed9d461f2fa1cb4ad900b. Não restaurar D1 nem apagar IndexedDB/localStorage para reverter interface. Nenhuma migração ou novo serviço pago.
