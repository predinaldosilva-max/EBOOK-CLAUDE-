# USA Work Kit v2.0.3 — configuração opcional de permissões

19/11/2026. Pedido do proprietário: apresentar microfone e localização depois de entrar com a chave de acesso.

## Comportamento

- Depois da validação do acesso, a primeira abertura por navegador apresenta um diálogo de configuração. Nenhuma permissão é solicitada automaticamente.
- Ativar microfone solicita getUserMedia somente após toque explícito. O stream é encerrado imediatamente após a resposta. Não há gravação nem arquivo de áudio nesta configuração.
- Ativar localização solicita uma posição pontual, com limite de espera de 10 segundos. Coordenadas não são persistidas nem anexadas a ocorrência. Não há watchPosition/rastreamento contínuo.
- Continuar ou Configurar depois fecham o diálogo e registram somente que a apresentação foi vista. Essa marca não representa autorização do navegador.
- A pessoa pode sair enquanto aguarda uma resposta. Uma autorização tardia de microfone encerra suas próprias faixas e não reabre o diálogo.
- Negação, API indisponível ou erro/timeout não impedem acesso ao aplicativo. Texto e anexos manuais permanecem disponíveis.
- Mais ferramentas → Permissões do aparelho reabre a configuração. O navegador pode voltar a pedir autorização; o app não afirma que ela é permanente.
- PT-BR, espanhol e inglês, com seletor de idioma no próprio diálogo. Nenhum serviço pago, biblioteca ou integração de delivery adicionada.

## Preservação

Autenticação, vinculação/reset de aparelho, Worker, configuração Cloudflare, schema D1, segredos e formatos de dados preservados. Base de rollback: 8b09203b6059871b852043b25c39c9f676fb7358 (v2.0.2). Cache e rótulos atualizados para v2.0.3. A primeira ferramenta da home continua sendo Proteção de Conta.

As permissões não substituem a chave de recuperação ou o backup do cofre. Fotos/arquivos continuam sendo escolhidos voluntariamente no momento de anexar; não existe solicitação antecipada de acesso a todos os arquivos.

## Validação

Sete testes novos de interface simulada: apresentação iPhone/Android sem chamadas automáticas; adiamento e reabertura; solicitação explícita com encerramento do microfone e ausência de localização salva; recusa/indisponibilidade/timeout; resposta tardia após sair; traduções; apresentação já vista sem repetição.

Suíte completa: 49 casos Node, 41 básicos, 26 verificações de qualidade com 5.000 cenários matemáticos, 11 verificações de dispositivo e 300 assertions financeiras; mais 4 testes do build público. Total: 431 verificações. Os testes anteriores de interface agora escolhem explicitamente Configurar depois antes de navegar.

Não há novo teste físico de sensores ou aparência do diálogo em Safari/Android. Esta entrega não declara concluídas as pendências físicas de microfone, GPS, downloads ou recuperação registradas na v2.0.2.
