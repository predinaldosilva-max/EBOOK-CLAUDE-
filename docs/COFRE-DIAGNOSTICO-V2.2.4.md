# 2.2.4 — diagnóstico seguro de desbloqueio

O relato real do proprietário no Safari continua sem causa confirmada. Não se afirma que esta mudança recupere uma chave perdida ou corrija uma falha criptográfica reproduzida no seu aparelho.

## Alterações de diagnóstico

- Campos de chave com autocomplete desligado, capitalização/correção automática desativadas e spellcheck falso. Isso reduz interferências; não prova que preenchimento automático causou o problema nem garante que todo gerenciador respeite essas preferências.
- Botão para mostrar/ocultar a chave somente no próprio aparelho e aviso de formato/comprimento sem transmitir seu conteúdo.
- Diferenciação de erro de formato `[key-format]` e falha de autenticação `[key-authentication]`. Uma chave de formato válido ainda pode não corresponder ao cofre; a autenticação também falha se os bytes cifrados foram alterados. Não é possível distinguir essas duas causas apenas da falha AES-GCM.
- Cópia do registro cifrado disponível mesmo com o cofre bloqueado. É uma exportação somente leitura: não troca a chave, não altera revisão/ciphertext nem exige descriptografar. Não é recuperação sem chave. O arquivo continua exigindo a chave original para abrir/restaurar.

Nenhuma mudança no algoritmo AES-GCM, chave de 32 bytes, AAD, formato UWKV1, identificação do cofre ou servidor/licenças. Não há tentativa de força bruta, bypass de integridade ou exclusão automática.

## Testes

Fixtures fictícios gravados por sete versões anteriores, com registros reais de IndexedDB, são abertos na versão corrente com a chave original. Os testes verificam ciphertext inalterado, backups, falhas de chave errada e abertura após bloquear o acesso e entrar de novo em novos contextos DOM iPhone e Android.

O novo teste `tests/vault-browser-upgrade.cjs` serve os arquivos reais da 2.2.2, cria o cofre na interface, troca a versão servida, aguarda troca real do service worker, recarrega, bloqueia o acesso, entra novamente e usa a chave original. Repete em WebKit e Chromium, três rodadas com cofre vazio e com ocorrência fictícia (12 jornadas), sem tocar em dados de produção.

Os testes em WebKit não reproduzem o preenchimento automático/Keychain de um iPhone físico. O caso do usuário permanece aberto até conferir o código de diagnóstico e comparar localmente a chave colada com a origem, sem compartilhar a chave em conversa.

## Procedimento no aparelho após publicação

1. Usar o mesmo link/navegador/licença, sem limpar dados ou recriar o cofre.
2. Salvar a cópia cifrada do cofre bloqueado antes de qualquer ação destrutiva.
3. Colar a chave e, opcionalmente, mostrá-la somente no aparelho para conferir com a anotação original. Não enviar foto da chave.
4. Ao tentar desbloquear, informar apenas `[key-format]` ou `[key-authentication]`.

Não declarar esta falha específica resolvida apenas porque os testes passam. A versão publicada adiciona instrumentos para diagnosticar sem perder o cofre original.
