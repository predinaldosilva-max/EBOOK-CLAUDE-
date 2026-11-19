# Simulação de recusa de armazenamento — 19/11/2026

Executado node --test tests/storage-refusal.test.mjs sobre a versão v2.0.7. Dois testes aprovados, com DOM simulado nos perfis iPhone e Android.

O teste primeiro salva ocorrência e foto em IndexedDB isolado. Em seguida aborta deliberadamente a transação de escrita do cofre, incluindo a tentativa com novo anexo, simulando indisponibilidade de gravação. Confere aviso storageError junto ao botão, preservação de descrição/anexo pendente e botão habilitado para repetir. Não há nova confirmação de sucesso. Nova instância do cofre confirma igualdade integral dos dados persistidos com o estado anterior à falha, incluindo originais e revisões.

Retirada a falha, a mesma tentativa armazena a nova ocorrência e seu anexo. Confere dois registros/arquivos e preservação exata do registro e foto anteriores. Nenhum erro de interface não tratado registrado.

Limite: transação abortada controladamente com fake-indexeddb e JSDOM; não foi produzido QuotaExceededError nativo nem enchido um iPhone/Android físico. Verifica o caminho de recusa de escrita e sua recuperação, não todas as políticas de armazenamento/remoção de cada sistema operacional.

Nenhum arquivo do aplicativo, backend, banco de produção ou configuração foi alterado. Nenhum dado no telefone do proprietário foi apagado ou modificado. Os testes e esta documentação ficam em branch de validação, sem publicação nova do aplicativo.
