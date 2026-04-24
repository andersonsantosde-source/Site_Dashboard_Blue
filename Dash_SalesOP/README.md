# Dash_SalesOP

Este diretório contém o aplicativo **BluePay Sales Ops Dashboard**, construído com **Vite**, **React 19** e **TypeScript**.

## Estrutura principal

- `package.json` — configura os scripts e dependências do projeto.
- `vite.config.ts` — configuração do Vite para desenvolvimento e build.
- `tsconfig.json` / `tsconfig.node.json` — configuração do TypeScript.
- `src/` — código-fonte do frontend.
- `cliente/index.html` — ponto de entrada HTML do app.
- `cliente/public/` — ativos públicos estáticos.
- `server/index.ts` — script de build para empacotar o servidor em produção.

## Como o aplicativo funciona

O aplicativo é uma SPA React com roteamento via `wouter` e componentes customizados localizados em `src/components`.

- `cliente/index.html` carrega o `src/main.tsx` como módulo.
- `src/main.tsx` importa o `App` e o renderiza em um elemento `<div id="root">`.
- `src/App.tsx` usa um provedor de tema, um erro boundary e o roteamento para renderizar a página inicial ou a página 404.

## Rodar localmente

### Requisitos

- Node.js instalado
- `pnpm` preferencialmente instalado

Se você não usa `pnpm`, pode instalar globalmente com:

```bash
npm install -g pnpm
```

### Passo a passo

1. Crie um arquivo `.env` na pasta `Dash_SalesOP` a partir de `.env.example`.

2. Inicie o backend Python:

```bash
cd Dash_SalesOP/backend
python3 -m pip install -r requirements.txt
python app.py
```

3. Inicie o frontend em outra aba de terminal:

```bash
cd Dash_SalesOP
pnpm dev
```

4. Acesse no navegador:

```text
http://localhost:3000/admin
```

### Observação

- O backend Python foi validado com `python3 -m py_compile backend/app.py`.
- A proteção admin é feita por senha no frontend via `VITE_ADMIN_PASSWORD`.

### Rodar em modo de produção local

Para gerar a versão estática e usar em um ambiente offline/intranet:

1. Gere o build:

```bash
pnpm build
```

2. Sirva a pasta `dist` com um servidor HTTP simples.

Opção A: `pnpm preview` (preferido):

```bash
pnpm preview --host
```

Opção B: servidor Python:

```bash
cd dist
python3 -m http.server 4173
```

3. Acesse no navegador:

```text
http://localhost:4173
```

## Uso offline / intranet

- Não abra o `index.html` diretamente via `file://`.
- O app precisa ser servido via HTTP porque usa módulos ES e importações de JavaScript.
- Use `pnpm preview` ou um servidor leve (`python3 -m http.server`) para garantir que funcione.

## Ajustes para intranet offline

### Remover o analytics

No arquivo `cliente/index.html`, há um script de analytics que espera variáveis de ambiente ou um servidor externo:

```html
<script defer src="%VITE_ANALYTICS_ENDPOINT%/umami" data-website-id="%VITE_ANALYTICS_WEBSITE_ID%"></script>
```

Em uma intranet sem internet, você deve:

- remover a linha inteira, ou
- comentar a linha usando `<!-- ... -->`.

Isso evita que o navegador tente carregar um recurso externo que não esteja disponível.

### Ajustar para rodar offline

1. Certifique-se de gerar o build com `pnpm build`.
2. Transfira a pasta gerada `dist/` para o servidor interno ou máquina da intranet.
3. Sirva esses arquivos com um servidor HTTP local:

```bash
cd dist
python3 -m http.server 4173
```

4. Acesse no navegador via:

```text
http://localhost:4173
```

### Exemplo de edição de `cliente/index.html`

Abra `cliente/index.html` e localize o bloco de analytics:

```html
<script defer src="%VITE_ANALYTICS_ENDPOINT%/umami" data-website-id="%VITE_ANALYTICS_WEBSITE_ID%"></script>
```

Para uso em intranete offline, comente ou remova a linha:

```html
<!--
<script defer src="%VITE_ANALYTICS_ENDPOINT%/umami" data-website-id="%VITE_ANALYTICS_WEBSITE_ID%"></script>
-->
```

ou simplesmente exclua a linha inteira.

### Observações importantes

- Não use `file://` para abrir o app; o Vite/React depende de uma origem HTTP.
- Se você tiver recursos estáticos adicionais em `cliente/public/`, mantenha-os no servidor interno.

## Dicas rápidas

- Se quiser mudar o tema padrão, edite `src/index.css` e o `ThemeProvider` em `src/App.tsx`.
- `cliente/public/` deve manter os ativos estáticos usados pelo app.
- Para criar uma versão final, use `pnpm build` e transfira a pasta `dist` para o servidor interno.

## Comandos úteis

- `pnpm install` — instala dependências
- `pnpm dev -- --host` — roda em modo desenvolvimento
- `pnpm build` — gera produção em `dist`
- `pnpm preview --host` — visualiza o build localmente
- `pnpm check` — checa o TypeScript sem gerar arquivos
