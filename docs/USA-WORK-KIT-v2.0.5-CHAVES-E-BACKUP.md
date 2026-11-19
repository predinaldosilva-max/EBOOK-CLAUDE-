# v2.0.5 — cópia de chave e restauração

O proprietário relatou desbloqueio/restauração recusados e repetição aparente da chave no celular. Não foi reproduzida a repetição nos testes: ciclos de excluir/criar geraram chaves distintas, e cada chave copiada reabriu a persistência correta. Não se afirma diagnóstico confirmado da origem da falha física.

Melhorias: botão Copiar chave completa, seleção manual se clipboard falhar; remoção de espaços/quebras/zero-width de formatação ao interpretar chave; leitura e decifragem do registro persistido antes de mostrar chave recém-criada; arquivo de restauração que não contém JSON retorna aviso traduzido de backup inválido em vez de SyntaxError; restauração bem-sucedida mostra confirmação e informa que o cofre passa a usar a chave desse backup.

Sem alteração de UWKV1, algoritmo AES-GCM, autenticação, D1 ou recuperação administrativa. Backups antigos continuam exigindo sua chave antiga. Nenhum dado de produção foi apagado nos testes. Não existe recuperação sem a chave correspondente.

Teste adicional executa três novos cofres sucessivos com chaves distintas, cópia completa, bloqueio/desbloqueio, nova instância de armazenamento, tolerância a formatação invisível, exportação/restauração com chave correspondente e rejeição de conteúdo não JSON. Suíte completa anterior a este último ajuste de fallback: 51 casos Node mais suites base/qualidade/dispositivo/integração financeira e quatro testes de build; teste focado após fallback também aprovado. Validação móvel real do fluxo relatado segue necessária. Rollback: 0cdb2857edd2642a131fc2349cd7f42b7ea40ad9.
