# Auditoria antes da integração preventiva — 19/11/2026

Base publicada v2.0.8 acfbd4f6046f44abfe48bcf77018babdaf026fcc. Ponto de recuperação local recovery-before-daily-protection-20261120 e branch feature-daily-protection-20261120.

| Função | Estado anterior | Decisão |
|---|---|---|
| Diário de incidentes, originais e revisões | Implementado no cofre IndexedDB AES-GCM | Preservar em Minha Defesa |
| SHA-256, PDF/ZIP, backup UWKV1, restauração, exclusão | Implementados | Integrar novos relatórios nas exportações, sem remover originais |
| Questionário, índice, histórico diário/gráficos | Ausentes | Implementar modelo determinístico local versionado |
| Análise de notificação | Ausente | Análise assistida de texto, sem OCR/IA simulados |
| Direitos locais com fontes | Ausentes | Catálogo limitado, datado e verificável; não adjudicar aplicabilidade |
| D1/Worker | Só ativação/validação/reset e auditoria administrativa | Não alterar |
| Seis ferramentas financeiras e textos | Implementadas e testadas | Preservar |
| Desktop | Bloqueado por UX no app, não pelo servidor | Adequar entrada do app ao requisito novo de desktop, mantendo autenticação |

Arquivos principais: usa-work-kit/js/{app,vault,protection-ui,protection-reports,protection-i18n}.js; index.html, sw.js, css/style.css. Bibliotecas locais pdf-lib/fontkit/fflate; sem serviço externo de IA, OCR ou sincronização. Estado financeiro no localStorage separado por licença, evidências no IndexedDB cifrado por licença; chave nunca enviada ao servidor. Anexos 5 MiB/arquivo e 20 MiB/cofre; documento cifrado limitado e backup manual. Esses limites e recuperação com chave permanecem.

Arquitetura: módulo puro de questionário/pesos e catálogo público; relatórios, rascunho e auditoria local dentro do mesmo cofre. Campos opcionais novos aceitam backups antigos sem alterações destrutivas. Sem migração de banco ou cobrança. Risco: nova UI e novos campos exigem regressão, recuperação e aceite físico iPhone; testes simulados não bastam. Relógio é local; hash não autentica origem/verdade. Carimbo independente não será apresentado como implementado sem serviço verificado e gratuito.

Catálogo jurídico inicial limitado a NYC/Seattle, com fontes oficiais e confirmação humana de cobertura; outras jurisdições sem parecer automático. Lei NYC 2026/034 tem vigência prevista para 17/01/2027 e litígio oficial noticiado pelo DCWP em outubro/2026; evitar alegar vigência presente ou decisão judicial definitiva. Não há serviço de atualização jurídica em tempo real.

Rollback: retornar código ao commit base sem apagar IndexedDB/localStorage nem restaurar D1. Exportar UWKV1 antes de alternar versões; a versão antiga não oferece UI para campos novos, portanto não editar/salvar cofre preventivo na interface antiga. Guardar backup externo da versão nova.
