# Checkout Kiwify — Edição 3.1

Link oficial fornecido pelo produtor: https://pay.kiwify.com.br/hFxie8I . Configuração em config.js com salesEnabled=true. Os quatro CTAs de compra (abertura, dois botões da oferta e chamada final) utilizam o mesmo checkout. O botão antes identificado como Hotmart foi renomeado para Kiwify. Links de navegação para conhecer a oferta continuam internos.

CSS, estrutura visual e preço da landing page (R$ 97,00) preservados. O aviso de vendas indisponíveis foi substituído por indicação de pagamento no checkout oficial. A configuração continua validando HTTPS e domínio permitido. Sem configuração válida, links de compra perdem href e botões permanecem desabilitados.

Checkout respondeu HTTP 200 em requisição somente de leitura. Testes de cliques interceptam exclusivamente o destino oficial para verificar a navegação sem iniciar compra, enviar dados pessoais ou realizar pagamento. Isso não comprova aprovação de pagamento, entrega, condições comerciais nem o preço configurado dentro da conta Kiwify.

A restrição de desktops permanece: no endereço público, eles veem a tela de restrição aprovada. O teste funcional de computador usa a prévia local permitida. Não foi adicionado bypass público.

Documentos anteriores que descrevem checkout desabilitado são registros de etapas anteriores. Esta configuração substitui aquele estado.
