# Hands-On

Criando uma API usando a especificação [OpenAPI versão 3](https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md) e testando algumas ferramentas para gerar documentação, criar servidor mock, interagir com a API usando o Swagger-UI e gerar biblioteca de cliente usando um gerador de código.

## Requisitos:

* Node.js (node, npm e npx)
* Docker

## ReDoc - Criando a especificação


### Iniciando o projeto

Executar:

```bash
mkdir books-api && cd books-api
npx create-openapi-repo .
```

Respostas ao criar o repositório para o OpenAPI:
```
Welcome to the OpenAPI-Repo generator!
Do you already have OpenAPI/Swagger spec for your API? No
Select OpenAPI version: OpenAPI 3
API Name: books-api
Split spec into separate files? Yes
Prepare manual code samples folder? No
Install SwaggerUI? No
Set up Travis CI? Yes
Specify name of GitHub repo in format User/Repo:
hmagarotto/books-api-spec
```

_Use seus dados em "name of GitHub repo"_

Executar (no diretório "books-api"):

```bash
npm start
```

Acessar:

http://localhost:8080

### Criando nosso exemplo de API

Remova todos os arquivos YAML dentro do diretório _spec_.

Criar o arquivo "~/books-api/spec/**openapi.yaml**".
Este é a raiz da nossa especificação e possui algumas informações básicas.

```yaml
openapi: 3.0.0
info:
  version: 1.0.0
  title: Books API
  x-logo:
    url: 'https://zenvia.github.io/zenvia-openapi-spec/zenapi.png'
  description:  |
    # Introduction
    This is an **example** API to demonstrate features of OpenAPI specification
servers:
  - url: 'http://localhost:3000'
```

Criar o arquivo "~/books-api/spec/components/schemas/**book.yaml**".
Este arquivo descreve o *schema* de um livro.

```yaml
type: object
properties:
  id:
    description: Book Id
    type: string
    example: e186fa32-0d5d-11ea-a604-e7edcb22b6c9
    readOnly: true
  title:
    description: Book title
    type: string
    example: My Book
  author:
    description: Book Author
    type: string
    example: Joe
required:
  - title
  - author
```

Criar o arquivo "~/books-api/spec/components/schemas/**book-list.yaml**".
Este arquivo descreve o *schema* de uma lista de livros.

```yaml
type: array
items:
  $ref: '#/components/schemas/book'
```

Criar o arquivo "~/books-api/spec/paths/**books.yaml**".
Este arquivo descreve as operações do endpoint "/books".

Adicionar a operação **get** no arquivo "~/books-api/spec/paths/**books.yaml**".

```yaml
get:
  tags:
  - Books
  summary: Get book list
  responses:
    '200':
      description: Returns a list of books
      content:
        application/json:
          schema:
            $ref: '#/components/schemas/book-list'
```

Adicionar a operação **post** no arquivo "~/books-api/spec/paths/**books.yaml**".

```yaml
post:
  tags:
  - Books
  summary: Create a new book
  requestBody:
    content:
      application/json:
        schema:
          $ref: '#/components/schemas/book'
  responses:
    '200':
      description: Returns one book
      content:
        application/json:
          schema:
            $ref: '#/components/schemas/book'
```

## Prism - Criando um mock server

Executar (no diretório "books-api"):

```bash
npm run build
npx -p @stoplight/prism-cli prism mock -p 3000 ./web_deploy/openapi.json
```

Executar em outro terminal:
```bash
curl -s 'http://localhost:3000/books' | jq
```

## Swagger-UI - Interagindo com o server

Executar (no diretório "books-api"):

```bash
docker run \
-p 9000:8080 \
-v${PWD}/web_deploy/openapi.json:/openapi.json \
-e SWAGGER_JSON=/openapi.json \
swaggerapi/swagger-ui
```

## Bônus

### Evolua nossa API

Criar o arquivo "~/books-api/spec/paths/**books@{bookId}.yaml**".
Este arquivo descreve as operações do endpoint "/books/{bookId}".

Adicionar a descrição de nosso *path parameter bookId* no arquivo "~/books-api/spec/paths/**books@{bookId}.yaml**".

```yaml
parameters:
- name: bookId
  in: path
  required: true
  schema:
    type: string
```

Adicionar a operação **get** no arquivo "~/books-api/spec/paths/**books@{bookId}.yaml**".

```yaml
get:
  tags:
  - Books
  summary: Get book by Id
  responses:
    '200':
      description: Returns one book
      content:
        application/json:
          schema:
            $ref: '#/components/schemas/book'
```

Adicionar a operação **delete** no arquivo "~/books-api/spec/paths/**books@{bookId}.yaml**".

```yaml
delete:
  tags:
  - Books
  summary: Delete book by id
  responses:
    '204':
      description: No content
```

Adicionar a operação **put** no arquivo "~/books-api/spec/paths/**books@{bookId}.yaml**".

```yaml
put:
  tags:
  - Books
  summary: Update on book
  requestBody:
    content:
      application/json:
        schema:
          $ref: '#/components/schemas/book'
  responses:
    '204':
      description: Returns updated book
      content:
        application/json:
          schema:
            $ref: '#/components/schemas/book'
```

### Cria uma lib cliente de nossa API

Executar (no diretório "books-api"):

```bash
docker run --rm \
-u $(id -u ${USER}):$(id -g ${USER}) \
-v ${PWD}:/local \
openapitools/openapi-generator-cli \
generate \
-i /local/web_deploy/openapi.yaml \
-g javascript \
-o /local/client-node
```

Preparar nossa lib para uso local (no diretório "books-api"):

```bash
cd client-node
npm install
npm link
npm run build
```

Criar um projeto para testar nossa lib de client (no diretório "books-api"):

```bash
mkdir client-node-test && cd client-node-test
npm init -y
npm link ../client-node
```
Vamos criar um teste usando nossa lib client. Crie o arquivo "index.js" com o seguinte conteúdo:
```javascript
const { BooksApi } = require('books_api');

const client = new BooksApi();
client.booksGet((error, data, response) => {
    if (error) {
        console.error(error);
    } else {
        console.log(JSON.stringify(data));
    }
});
```

Agora execute o nosso teste:
```bash
node index.js
```

Olhe os demais geradores de código disponíveis e tente outros geradores.
```bash
docker run --rm openapitools/openapi-generator-cli list
```

# API da Zenvia usando o OpenAPI

Conheça nossa [ZenAPI](https://zenapi.zenvia.com/) e sua [documentação](https://zenvia.github.io/zenvia-openapi-spec/) feita usando o OpenAPI
