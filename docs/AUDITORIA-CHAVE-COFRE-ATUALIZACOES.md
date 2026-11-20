# Falha relatada ao desbloquear após atualização — investigação em aberto

Data: 20/11/2026. Produção analisada: 2.2.3, commit e71e28aff0f100dd0b7f7704a7094e5f743255fc. Nenhum código do aplicativo, dado de produção, chave ou cofre do usuário foi alterado nesta investigação.

## Relato

O proprietário abriu o link oficial, bloqueou o acesso ao aplicativo, entrou com seu código de acesso, colou a chave de recuperação e recebeu “Chave incorreta ou arquivo danificado”. Relata recorrência após publicações. O erro do aparelho permanece sem causa confirmada e não deve ser tratado como resolvido por testes em dados fictícios.

## Inspeção

- `vault.js/keyFrom`: a chave é convertida para 32 bytes AES; formato inválido usa o erro wrongKey.
- `vault.js/unseal`: a autenticação AES-GCM usa a chave, IV, ciphertext e dados associados UWKV1|owner|revision. Falha de autenticação ou de interpretação JSON dentro desse bloco também usa wrongKey.
- A validação do modelo de relatórios acontece depois. Seus erros de integridade têm uma mensagem diferente; não se comprovou que a mudança de pontuação cause o erro narrado.
- A rotina de bloquear o aplicativo remove o comprovante de acesso, preservando a identificação da instalação e o banco IndexedDB. A identidade do cofre não inclui a versão do aplicativo ou a geração da licença.
- O cache PWA é atualizado; não há instrução de apagar IndexedDB. O algoritmo, a derivação da chave e os dados associados são iguais nas sete versões examinadas.
- Os campos de recuperação são password sem orientação explícita de autocomplete. Preenchimento automático é uma possibilidade a verificar no aparelho, não uma causa comprovada neste relato.
- Restaurar um backup usa a chave daquele backup; criar outro cofre gera outra chave. Não há evidência de qual dessas operações ocorreu no aparelho e nenhuma foi presumida.

## Reprodução

Foram criados cofres inteiramente fictícios executando o código original dos commits b8f6520, 3388602, 510402d, 0a20a02, b421095, 727170c e e71e28a. Os testes usam tanto o registro cifrado efetivamente gravado no IndexedDB original quanto seu backup.

`tests/vault-upgrade.test.mjs`: sete grupos aprovados. Para cada origem, abrir repetidamente na versão atual com a mesma chave, conferir descrição original, verificar que desbloquear não altera ciphertext, tentar chave errada e conferir preservação, aceitar espaços ao colar e restaurar o backup com a chave original.

`tests/vault-relogin.test.mjs`: quatorze grupos aprovados, sete origens em cada perfil DOM iPhone/Android. Abrir cofre antigo na versão atual, bloquear acesso do aplicativo, preservar armazenamento, criar uma nova instância da página, entrar novamente com código de acesso de teste e desbloquear com a mesma chave do cofre.

Resultado local: 21 grupos, 21 aprovados, zero falhas. Os fixtures contêm somente chaves e registros fictícios gerados para teste. Nenhuma chave real foi solicitada ou utilizada. Perfis DOM não são execução física no telefone do proprietário.

## Conclusão e próximo passo

Não foi reproduzida uma invalidação determinística da chave por atualização ou pelo fluxo de bloqueio/novo login. O caso concreto continua pendente. Sem acesso ao armazenamento do aparelho ou uma verificação local do par backup/chave, não é possível identificar se a chave corresponde ao registro atualmente armazenado, se há substituição de preenchimento ou se os bytes cifrados foram alterados.

Preservar o cofre atual. Não limpar dados, não excluir e não criar outro cofre. Verificar se existe um backup criptografado .uwkv anterior que já tenha sido restaurado/validado com essa chave. A eventual comparação deve ser somente leitura; não restaurar sobre os dados atuais como tentativa de diagnóstico. Não compartilhar a chave de recuperação em conversa.
