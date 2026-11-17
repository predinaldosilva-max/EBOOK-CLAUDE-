> Versão 1.1.0: o acesso agora é validado no servidor; abertura e revalidação exigem internet. Orientações antigas sobre acesso local/offline foram substituídas. Consulte ../../IMPLANTACAO.md.

# Inventário técnico e custos

| Componente | Origem | Dependência externa no aplicativo | Custo recorrente |
|---|---|---|---|
| HTML5, CSS3, JavaScript | Código criado para este projeto | Não | Zero |
| Cálculos | Funções JavaScript locais | Não | Zero |
| Ícone da marca | SVG original e PNGs derivados | Não | Zero |
| Símbolos de navegação | Caracteres Unicode da fonte do dispositivo | Não | Zero |
| Tipografia | Fonte do sistema operacional | Não; nenhuma fonte distribuída ou baixada | Zero |
| Armazenamento | LocalStorage do navegador | Não | Zero |
| Offline | Cache API e service worker nativos | Primeira carga HTTPS apenas na versão online | Zero no código |
| CSV/JSON | Blob e download nativos | Não | Zero |
| PDF | Impressão nativa do navegador/sistema | Não | Zero |
| Traduções | Texto incluído no código | Não | Zero |
| Testes | Node.js, ferramenta opcional de desenvolvimento | Não é instalado pelo comprador | Zero |
| GitHub Pages | Publicação de teste gratuita | Restrição comercial documentada | Zero no uso atual |
| Kiwify | Distribuição comercial externa ao aplicativo | Sem SDK/integração | Taxas da venda fora do aplicativo |

Não existem bibliotecas de terceiros distribuídas, dependências npm, CDNs, fontes web externas, imagens licenciadas de terceiros, APIs, serviços de IA, rastreadores, trials ou credenciais. Por isso não há licenças de bibliotecas comerciais a comprar. Os arquivos de código e a arte original foram preparados para manutenção e comercialização pelo responsável pelo produto; não foi imposta uma licença de redistribuição pública ao produto final.

O código não solicita cartão, pagamento, assinatura ou conta. O service worker busca apenas recursos estáticos da mesma origem; nenhuma informação dos formulários é transmitida por ele. Se hospedado, o provedor pode registrar metadados de acesso conforme seus termos; isso é diferente de enviar os registros do aplicativo.

Antes de adicionar qualquer dependência no futuro: registrar versão, fonte oficial, licença que autorize uso comercial, limites do plano gratuito, efeitos offline e ausência de cobrança automática. Não depender de período experimental.
