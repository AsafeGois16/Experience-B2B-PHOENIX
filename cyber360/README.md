# Phoenix Cyber 360

Landing page responsiva da Phoenix Insurance para **clientes atuais** e **novas empresas**.

## Funcionalidades

- Segmentação por perfil usando `?origem=cliente` ou `?origem=novo`.
- Diagnóstico de 7 perguntas e pontuação educativa de 0 a 100.
- Recomendações conforme as respostas e relatório PDF gerado no navegador (jsPDF; fallback: imprimir/salvar PDF).
- Formulário opcional de contato com consentimento e solicitação de cotação.
- API Vercel `POST /api/leads` com validação de dados e pontuação, honeypot e limitação básica por instância.
- Persistência em `public.phoenix_cyber360_leads`, no Supabase Phoenix existente, com RLS apenas para INSERT público; nenhuma leitura pública.
- Registra origem UTM e público.

## Vercel

Conectar repositório `AsafeGois16/Experience-B2B-PHOENIX`, definir **Root Directory = cyber360**, framework Other, sem build command.

Variáveis necessárias em Production e Preview: `SUPABASE_URL` e `SUPABASE_PUBLISHABLE_KEY` (chave pública de publicação, nunca `service_role`).

## Operação

- A leitura dos leads está restrita ao Supabase Studio para operadores autorizados; **não há sincronização automática com o ADM Phoenix**.
- O formulário não envia e-mails, apenas salva o pedido com consentimento.
- O PDF pode ser baixado sem preencher o formulário.
- A pontuação é indicativa/autodeclarada, não é laudo, auditoria, verificação de vulnerabilidades, certificação ou análise securitária.
- Validar a identidade visual/logotipo e os textos de coberturas com a equipe antes do lançamento da campanha.
- Formalizar a política de privacidade e retenção de dados para operação contínua.
