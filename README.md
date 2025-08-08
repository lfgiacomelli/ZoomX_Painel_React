📊 Painel de Gestão – ZoomX
O Painel de Gestão do ZoomX é uma plataforma web desenvolvida para gerenciar um aplicativo de corridas de mototáxis.
A ferramenta oferece uma gestão completa, desde o controle de corridas até a administração de pagamentos, funcionários e clientes.
Ele oferece uma interface moderna, responsiva e rápida, construída com React, Vite, TypeScript, Tailwind CSS e shadcn-ui.

🚀 Funcionalidades Principais
Gestão de Funcionários → cadastro, edição, cargos e controle de status.

Controle Financeiro → visualização e geração de diárias, controle de corridas em andamento, pendentes e finalizadas.

Painel Responsivo → funciona em desktop, tablet e mobile.

Autenticação Segura → login com controle de permissões baseado em cargo.

🛠 Tecnologias Utilizadas
Vite → Build rápido e leve para aplicações React.

React → Biblioteca JavaScript para interfaces.

TypeScript → Tipagem estática para maior segurança no código.

Tailwind CSS → Estilização rápida e responsiva.

shadcn-ui → Componentes de interface pré-construídos e acessíveis.

📂 Como Executar Localmente
É necessário ter Node.js e npm instalados (recomendo usar o nvm para gerenciar versões).

sh
Copiar
Editar
# 1. Clone o repositório
git clone https://github.com/lfgiacomelli/ZoomX_Plataforma_React

# 2. Acesse a pasta do projeto
cd zoomx-painel

# 3. Instale as dependências
npm install

# 4. Inicie o servidor de desenvolvimento
npm run dev
O painel estará disponível em:

http://localhost:8080
💻 Editando o Código
Você pode escolher entre:

1. Editar no GitHub Codespaces
No repositório, clique em Code → Codespaces → New Codespace.

O ambiente abrirá online e você poderá editar como se fosse um VS Code.

2. Editar Localmente
Baixe/clonar o projeto para sua máquina.

Abra no seu editor preferido (VS Code recomendado).

Rode npm run dev para visualizar as alterações.

📌 Observações
O painel funciona 100% integrado ao backend do ZoomX feito em NodeJS, sendo necessário configurar as variáveis de ambiente para apontar para sua API.

Recomendamos sempre criar branches para novas funcionalidades e depois realizar merge na main.