# Simple API

Uma API simples construída com TypeScript que serve como base para o desenvolvimento de aplicações backend. O projeto utiliza as melhores práticas do desenvolvimento moderno, incluindo o uso do Prisma para gerenciamento de banco de dados e ESLint para padronização do código.

## Tecnologias Utilizadas

- **TypeScript** – Linguagem principal do projeto.
- **Node.js** – Ambiente de execução.
- **Prisma** – ORM para gerenciamento de banco de dados.
- **ESLint** – Ferramenta para manter a qualidade e padronização do código.

## Estrutura do Projeto

- **prisma/**: Contém configurações, migrações e modelos do Prisma.
- **src/**: Diretório com os arquivos de código-fonte da API.
- **.gitignore**: Define quais arquivos e pastas devem ser ignorados pelo Git.
- **eslint.config.mjs**: Configuração do ESLint para padronização do código.
- **package.json** e **package-lock.json**: Gerenciam as dependências e scripts do projeto.
- **tsconfig.json**: Configurações do compilador TypeScript.

## Instalação

1. Clone o repositório:

   ```bash
   git clone https://github.com/matheusrs/simple-api.git
   ```

2. Entre no diretório do projeto:

   ```bash
   cd simple-api
   ```

3. Instale as dependências:
   ```bash
   npm install
   ```

## Configuração do Banco de Dados

Crie um arquivo .env baseado no arquivo de exemplo e ajuste as configurações conforme necessário. Certifique-se de que o Prisma esteja configurado corretamente para conectar ao seu banco de dados.

## Execução
Para iniciar o projeto em modo de desenvolvimento, utilize o seguinte comando:

```bash
npm run dev
```
Caso seja necessário compilar o projeto, utilize:

```bash
npm run build
```
Contribuição
Contribuições são bem-vindas! Para contribuir com o projeto, siga os passos abaixo:

Faça um fork do repositório.

Crie uma branch com sua feature:

```bash
git checkout -b minha-feature
```
Faça commit das suas alterações:

```bash
git commit -m "Adiciona nova feature"
```
Envie sua branch para o repositório remoto:

```bash
git push origin minha-feature
```
Abra um Pull Request para revisão.

## Licença
Este projeto está licenciado sob a MIT License.

## Contato
Se tiver dúvidas ou sugestões, sinta-se à vontade para abrir uma issue no repositório ou entrar em contato.
