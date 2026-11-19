# Revalidação da versão oficial v2.0.7 — 19/11/2026

Código do app idêntico a main/32fdd0baee96183a329782d6b8065956be9d9b52. A branch de testes acrescenta somente teste de recusa de armazenamento e documentação. Nenhuma mudança funcional ou nova publicação nesta revalidação.

## Resultado

npm test aprovado: 55 casos Node, 41 testes básicos, 26 verificações de qualidade (incluem 5.000 cenários matemáticos), 11 verificações de dispositivo e 300 assertions de integração financeira. Build: quatro testes Python aprovados. Total 437 verificações. npm audit: zero vulnerabilidades conhecidas reportadas; não equivale a certificação de segurança.

- Calculadora de entregas: receita, gorjeta adicional, custos, tempo/espera, ganho por hora/milha, comparação e registro.
- Calculadora de trabalho: modalidades hora, dia, serviço, semana e projeto; custos e projeções.
- Metas: restante, ritmo diário, horas, progresso e projeção; entradas inválidas.
- Despesas: criar, editar, excluir, pago/pendente, totais e persistência.
- Preços: custos, remuneração do tempo, margem sobre preço final, limite de margem e impressão.
- Mensagens: dez modelos por idioma, substituição e cópia, sem envio automático.
- Proteção: cofre cifrado, chave/cópia, desbloqueio, revisões, originais, anexos pendentes/remover, erro e sucesso de gravação, seleção de provas, PDF/ZIP em três idiomas, backup/restauração, isolamento e chave perdida.
- Acesso: ativação única, licença de teste, concorrência, validação, reset e revogação; Worker/workerd e D1 locais com dados fictícios.
- Recusa de escrita: aviso local, sem novo sucesso, conteúdo anterior preservado, rascunho/anexo pendentes mantidos e repetição bem-sucedida.
- Relatórios financeiros: filtros, totais, CSV, impressão, backup/restauração e recarga.

## Evidência de publicação

Os checks oficiais Workers Builds: usa-work-kit, build e deploy do commit de produção foram consultados e retornaram completed/success. Isso confirma a implantação; não representa nova sessão autenticada ao vivo no telefone.

## Limites

Testes automatizados de interface usam DOM/perfis de dispositivo simulados; não equivalem a Safari/Android físicos. O proprietário relatou confirmação dos fluxos em Android, incluindo foto/áudio/vídeo após fechar e reabrir, PDFs/ZIP, recuperação, permissões e chave. Confirmação real no iPhone segue pendente; diferenças podem envolver mídia, arquivos e armazenamento, além de permissões.

A simulação de armazenamento aborta a transação de IndexedDB: não enche aparelho nem produz todas as variações nativas de QuotaExceededError/remoção de dados pelo sistema. Dados locais exigem backup externo e chave. O kit organiza provas e recursos; não impede desativação nem garante reativação. Nenhuma conta de delivery foi acessada e nenhuma integração com essas contas foi adicionada.

Conclusão: nenhuma falha encontrada nesta bateria para as funções atuais. Não é garantia de ausência universal de problemas. Módulos futuros do plano 2.0 e cobrança recorrente automatizada não foram implementados nesta revalidação.
