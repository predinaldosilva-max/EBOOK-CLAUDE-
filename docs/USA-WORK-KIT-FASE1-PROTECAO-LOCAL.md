# Fase 1 — Proteção de Conta: versão para revisão

18/11/2026. Opção A autorizada: custo zero estrito, armazenamento local e recuperação manual. **Não publicada em produção.** Base preservada: main em f0391276e53fa7fd9404714bb6e6db5b52032065.

## 1. Implementado na branch

- Cartão de proteção antes dos indicadores e navegação móvel com quatro itens. As seis ferramentas existentes continuam acessíveis.
- Diário com plataforma, tipo, data/hora e fuso declarados, descrição, estabelecimento/região, pedido opcional, localização pontual autorizada e anexos originais. Gravação de áudio de até 60 segundos com alternativa textual.
- UUID, criação e revisões locais; dados declarados separados de horário/localização registrados no dispositivo. Sem certificação de autenticidade ou horário.
- Originais conservados, hashes SHA-256 e histórico de alterações. Não há OCR, leitura de outros aplicativos ou envio a terceiros.
- Cofre IndexedDB criptografado com AES-GCM e chave aleatória de 256 bits, independente da senha de comprador. A chave aparece uma vez e não é armazenada em texto no navegador.
- Backup completo cifrado .uwkv; recuperação manual na mesma licença com a chave correspondente. A geração da licença não integra o identificador do cofre, para não apagar dados ao redefinir acesso.
- Seleção explícita de ocorrências/anexos, modelo de recurso editável em PT/ES/EN, PDF com fonte local e ZIP dos originais selecionados com manifesto e hashes.
- Contagens pessoais por plataforma, tipo, estabelecimento e dia/horário. Avisos de amostra pequena e de ausência de previsão.
- Exclusão de ocorrência com remoção de anexos não utilizados e exclusão do cofre local. Backups externos permanecem sob responsabilidade do usuário.
- Dados financeiros separados por licença. Migração antiga exige prévia, exportação e confirmação de propriedade; original preservado.
- Interface dos módulos entregue em português, espanhol e inglês; código de ativação continua sendo validado pelo backend existente.

## 2. Como recuperar em outro aparelho

1. No aparelho antigo, baixar e guardar o backup .uwkv. Conferir que o arquivo foi realmente salvo.
2. Guardar separadamente a chave do cofre exibida na criação. Ela não é ADMIN_TOKEN, RATE_SECRET nem senha de comprador.
3. Solicitar ao administrador a redefinição da licença pelo procedimento atual.
4. No novo aparelho, ativar a mesma senha comercial e abrir Proteção de Conta.
5. Escolher Restaurar cofre, selecionar o backup e informar a chave do cofre.

Sem arquivo e chave não existe recuperação garantida. Perder o aparelho sem backup pode perder as provas. Exportações PDF/ZIP do recurso **não são cifradas e não substituem o backup completo**. O backup financeiro JSON das ferramentas antigas também é separado e não cifrado.

## 3. Limites e comportamento

- Até 5 MiB por arquivo, 20 MiB de originais no cofre, 200 ocorrências e 100 revisões por ocorrência. Até 20 anexos por revisão e 1.000 arquivos no cofre. Há limite adicional do documento cifrado para assegurar recuperação do próprio backup.
- Formatos detectados: JPEG, PNG, WebP, HEIC/HEIF, AVIF, PDF e contêineres de áudio suportados. Não há prévia executável de PDF, SVG ou HTML. Originais são baixados como dados binários.
- Hash detecta alteração dos bytes após registro, não demonstra a veracidade dos fatos ou autoria.
- Horário de criação e revisão vem do relógio do aparelho; não é carimbo certificado de servidor.
- Rascunho salva texto após breve pausa; arquivos e áudio pendentes exigem Salvar ocorrência. Encerramento antes da confirmação pode perder entradas ainda não salvas.
- Abertura e revalidação de acesso continuam exigindo internet. Não foi criado acesso offline permanente. Dados do cofre já desbloqueado são locais. Não há sincronização automática.
- Limpar o navegador, remover dados do site ou políticas de armazenamento do sistema podem apagar a cópia local.
- O cofre fecha ao sair do módulo, bloquear acesso, sair da página ou ficar inativo. A chave não fica persistida no localStorage.
- Textos fixos do recurso têm três idiomas; narrativas livres permanecem como escritas pelo usuário. O aplicativo não inventa traduções/fatos. Caracteres que a fonte do PDF não suporte geram aviso explícito; o ZIP conserva texto UTF-8 integral.
- Não há rastreamento GPS em segundo plano, integração com contas de delivery, automação de pedidos, API paga ou R2.

## 4. Validação executada

`npm test`: 29 testes Node (13 da base e 16 de proteção/interface), mais 41 testes básicos, 26 verificações de qualidade com 5.000 cenários gerados e 11 verificações de dispositivo. Todos passaram: 107 verificações no total dessas suítes. Build da página de vendas: mais 4 testes Python aprovados.

Verificados: cifragem sem texto dos incidentes no armazenamento, chave errada, arquivo adulterado, outra licença, restauração, bytes originais, revisões, formatos inválidos, limites, GPS sem autorização, conflitos de abas, rascunho recuperado, exclusão, seleção de anexos, PDF nos três idiomas, ZIP íntegro, migração financeira explícita e correspondência dos dicionários de tradução.

Fluxos de interface executados em DOM simulado com identificação iPhone/Android: home, criar/desbloquear cofre, salvar, editar, revisar, exportar, bloquear, mudar idiomas e voltar às ferramentas antigas. Não equivalem a testes físicos de Safari ou Android.

Backend original testado com SQLite local e Cloudflare workerd/D1 local: ativação única concorrente, reutilização, senha de teste, validação e reset. Nenhum dado de produção foi usado. Também foram gerados e extraídos PDFs com pdftotext em PT/ES/EN: texto e acentos conferiram nos três. Auditoria final npm: zero vulnerabilidades reportadas nas dependências instaladas; isso não constitui certificação de segurança do aplicativo.

Dependências de desenvolvimento atualizadas para Wrangler 4.164.0 e fflate 0.8.3 após avisos de segurança na auditoria npm. Nenhuma regra de autenticação ou configuração de produção foi alterada. A linha do tempo identifica expressamente que usa datas/horas declaradas sem converter fusos.

## 5. Pendências antes de publicar

- Testes físicos de Safari iPhone, Chrome Android e Samsung Internet: aparência, navegação, download e restauração de .uwkv, PDF, anexos reais, microfone, GPS e permissões.
- Validar persistência após fechar/forçar encerramento, suspender navegador, falha de rede, atualização de service worker e pressão de espaço no aparelho.
- Validar backup salvo fora do aparelho e recuperação depois de reset real em licença de teste, sem evidências pessoais.
- Revisar responsividade, contraste e áreas de toque em renderização real.
- Conferir backup privado do D1 antes de qualquer futura publicação/migração. A Fase 1 não altera o schema nem o backend de produção.

A prévia gerenciada não iniciou: primeiro houve incompatibilidade de argumento strictPort, tratada por um adaptador de CLI; em seguida o ambiente retornou uv_interface_addresses (erro de sistema). Não foi contornada a restrição do ambiente nem usada essa falha como evidência de problema no app.

**A fase está implementada como candidata, mas seu gate de validação móvel ainda não está concluído. Fase 2 não foi iniciada.**

## 6. Preparação, reversão e arquivos preservados

- Branch dedicada usa-work-kit-2-protecao-local. main, Worker publicado, D1 e segredos de produção não foram modificados.
- server/worker.mjs, schema.sql e wrangler.jsonc originais permanecem sem alteração.
- O site de vendas continua preservado. Seu build inclui somente a lista explícita de arquivos públicos; não publica banco, fixtures ou segredos.
- Novos dados financeiros usam chave própria por licença; o dado legado original continua em usa-work-kit-v1. Importar backup financeiro substitui somente o espaço da licença atual após confirmação.
- Formato do cofre é UWKV1. Uma reversão ao frontend antigo não poderá ler o cofre novo: baixar backup cifrado antes de reverter. Não apagar IndexedDB ao reverter. Não restaurar o banco de produção inteiro para desfazer só uma mudança de frontend.
- O workflow novo executa validação sem publicar. O workflow anterior da página de vendas não foi modificado.

## 7. Testes locais para desenvolvedores

`npm ci` e `npm test` reproduzem a suíte. `python3 -m unittest discover -s tests -p 'test_*.py' -v` valida o build público.

`npm run seed:preview` prepara somente o D1 **local**, com dados fictícios, e `npm run dev` inicia Wrangler local. A configuração wrangler.preview.jsonc não deve ser implantada nem usada com dados reais. Sua licença qa-local usa apenas o código fictício UW-0123456789ABCDEF. Tokens da configuração são fixtures públicas sem validade em produção. Nunca executar fixtures-preview.sql contra o D1 real.

## 8. Próxima decisão

Concluir a validação em aparelhos reais e apresentar os resultados antes de liberar produção ou iniciar a Fase 2. A opção A permanece sem serviços pagos e sem recuperação automática pela nuvem.
