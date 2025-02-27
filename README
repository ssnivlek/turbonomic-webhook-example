# Turbonomic Webhook for Google Chat - API Webhook Middleware

---

---

---

## _ENGLISH_

## Description

This project is a Node.js middleware developed for IBM Turbonomic. It processes webhook payloads and forwards them to a Google Chat webhook. The code distinguishes actions by the target.className property and builds a formatted message to send to Google Chat. Currently, it is configured exclusively for Google Chat and always runs on port 8000.
Note: To change the port, you must modify the port value directly in simpleApi.js.

## Prerequisites

- Node.js and npm:
  If you don't have Node.js installed, download and install the LTS version from the official website: https://nodejs.org/

Project Setup

## 1. Clone the repository:

Example:

     git clone <repository URL>
     cd api-webhook

## 2. Install dependencies:

Run the command:

     npm install

## 3. Create the .env file:

Use the env-example file in the repository as a basis. Create a file named .env in the project root with the following content:

     TURBONOMIC_BASE_URL=your_turbo_base_url
     GC_CHAT_WEBHOOK=your_chat_hook

These variables define the Turbonomic base URL and the Google Chat webhook endpoint.

## Running the Server

To start the server, run:

    npm start

The server will run on port 8000.
Note: If you wish to run the server on a different port, change the port value directly in the simpleApi.js file.

## Notes

- This middleware is configured specifically for use with Google Chat.
- The code uses a helper function to safely extract nested properties from the payload.
- If the payload contains a target.className that is not implemented, the code sends a default message indicating that a handler for that type is not implemented.

---

---

---

## _PORTUGUÊS_

## Descrição

Este projeto é um middleware em Node.js desenvolvido para o IBM Turbonomic. Ele processa payloads de webhooks e os encaminha para um webhook do Google Chat. O código diferencia as ações pela propriedade target.className e monta uma mensagem formatada para envio ao Google Chat. Atualmente, ele está configurado exclusivamente para o Google Chat e roda na porta 8000 por padrão.
Observação: Para alterar a porta, é necessário modificar o valor da porta diretamente no arquivo simpleApi.js.

## Pré-requisitos

Node.js e npm:
Se você ainda não tem o Node.js instalado, baixe e instale a versão LTS a partir do site oficial: https://nodejs.org/

Configuração do Projeto

## 1. Clone o repositório:

Exemplo:

       git clone <URL do repositório>
       cd api-webhook

## 2. Instale as dependências:

Execute o comando:

       npm install

## 3. Crie o arquivo .env:

Utilize como base o arquivo `env-example` que está no repositório. Crie um arquivo chamado `.env` na raiz do projeto com o seguinte conteúdo:

    TURBONOMIC_BASE_URL=your_turbo_base_url
    GC_CHAT_WEBHOOK=your_chat_hook

Essas variáveis definem a URL base do Turbonomic e o webhook do Google Chat.

## Execução

Para iniciar o servidor, utilize o comando:

    npm start

O servidor será iniciado na porta 8000.
Observação: Se você desejar que o servidor rode em outra porta, altere o valor da porta diretamente no arquivo simpleApi.js.

## Observações

- Este middleware está configurado especificamente para uso com o Google Chat.
- O código utiliza uma função auxiliar para extrair de forma segura propriedades aninhadas do payload.
- Se o payload contiver um target.className que não foi implementado, o código envia uma mensagem padrão informando que o handler para aquele tipo não foi implementado.
