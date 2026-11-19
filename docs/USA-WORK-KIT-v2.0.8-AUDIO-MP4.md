# v2.0.8 — áudio MP4/M4A prioritário

Novas gravações consultam isTypeSupported e tentam audio/mp4 com AAC explícito, depois audio/mp4, antes de WebM/Ogg. A extensão segue o MIME efetivamente retornado pelo gravador; MP4 recebe .m4a. Sem suporte detectável, mantém a escolha padrão do navegador. Arquivos antigos não são convertidos nem apagados.

Downloads de áudio usam o MIME de áudio detectado/validado. Para MP4, apenas metadados declarados audio/mp4 permitem o MIME audio/mp4; demais contêineres/fotos/PDF continuam baixados como binário. Originais e hashes permanecem iguais. Sem mudança de capacidade, cifragem, banco ou autenticação. Limites permanecem 5 MiB por arquivo e 20 MiB de originais por cofre.

Regressão nova simula navegador compatível simultaneamente com WebM e MP4 e comprova prioridade MP4, extensão .m4a, tipo audio/mp4 no download e bytes iguais à amostra AAC/MP4 válida. Os testes anteriores de WebM-only, MP4-only, permissão, finalização assíncrona, preservação de originais e demais ferramentas também passaram. 54 casos Node mais suites base/qualidade/dispositivo/integração e quatro testes Python do build aprovados.

Não houve gravação física no iPhone nesta sessão. A reprodução de uma nova fala no aparelho do proprietário é o próximo aceite. O ajuste não demonstra a causa de silêncio em arquivos antigos. Base de rollback: 32fdd0baee96183a329782d6b8065956be9d9b52.
