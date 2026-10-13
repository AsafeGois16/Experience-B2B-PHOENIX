# Phoenix Giro da Sorte | HBR — implantação via GitHub

Este repositório contém **apenas a landing page pública da roleta HBR**, sem qualquer HTML do ADM Phoenix.

## Publicação recomendada

1. Crie um repositório GitHub novo, por exemplo `phoenix-giro-hbr`.
2. Envie **index.html** e **vercel.json** diretamente na raiz do repositório. (O README é opcional.)
3. Na Vercel selecione **Add New → Project → Import Git Repository** e escolha esse repositório.
4. Defina **Framework Preset: Other** e **Root Directory: ./**. Não selecione nem vincule o projeto atual do ADM Phoenix.
5. Faça Deploy. A URL do novo projeto poderá ser usada para gerar o QR Code central da roleta.

## Banco de dados / ADM

- A página envia o cadastro para a Edge Function `hbr-giro-cadastro` do Supabase Phoenix.
- O Supabase grava os dados em `public.hbr_giro_inscricoes`.
- Uma trigger já instalada espelha automaticamente dados no `public.leads`, tabela que o ADM antigo já consulta.
- No ADM existente, utilize **Atualizar**, filtro **Origem: HBR • Giro da Sorte**. A leitura não depende de nova versão do HTML do ADM.
- O resultado EXATO da roleta é exibido em **Perfil** e os metadados ficam em **Segmento** (inclusive status de validação). O status inicial é **Pendente**.
- No sorteio antigo, para visualizar participantes pendentes desmarque **Somente elegíveis**; só entram como elegíveis quando `status=validado` na tabela `hbr_giro_inscricoes`. A atualização nesse campo sincroniza o indicador com os leads por trigger.
- **Sem novo deploy do ADM, não surgem novos botões de validar ou uma aba exclusiva HBR**. Para validar, a equipe autorizada pode alterar o status no Supabase Table Editor. Um painel próprio exigiria publicação do frontend administrativo.

## Importante antes do evento

- Confirme/forneça aos participantes um aviso de privacidade e as regras da ação. No HTML os links `PRIVACY_URL` e `RULES_URL` podem ser preenchidos quando os URLs oficiais forem disponibilizados.
- Verifique o enquadramento legal e eventual autorização para a roleta promocional e o sorteio final antes de realizar a campanha.
- Os descontos devem respeitar as condições e autorizações comerciais das seguradoras.
- Faça um teste com dados de teste antes de divulgar o QR Code; remova os registros de teste ao terminar.

## Segurança

- Não adicione credenciais `service_role` do Supabase nem segredos ao HTML ou GitHub.
- A Edge Function é o único caminho previsto para criação pública dos cadastros HBR.
- Os espelhos HBR de `public.leads` estão protegidos da leitura anônima por uma política restritiva.

## Verificação da integração

1. Abra a URL da landing page em janela privada e envie um cadastro de teste.
2. Confirme no Table Editor Supabase uma linha em `hbr_giro_inscricoes` e uma linha espelhada em `leads`, com origem `HBR • Giro da Sorte`.
3. Entre no ADM Phoenix e clique **Atualizar**. Filtre por essa origem.
4. No Supabase, altere o status do cadastro de teste para **validado** e atualize novamente o ADM. Confirme que **Elegível sorteio: Sim** aparece na coluna Segmento.
5. Apague os dados de teste de ambas as tabelas ao concluir, se necessário.
