## Setup the frontend

```sh
npm install
```

## .env.local file

Linux:
```sh
cp .env.local.example .env.local
```
Windows:
```sh
copy .env.local.example .env.local
```

### Compile and Hot-Reload for Development

> Note: For local development, an SSL-certificate is needed to interact with the
> CAS-server of UGent. Install [mkcert](https://github.com/FiloSottile/mkcert)
> and run
> ```sh
> mkdir local-cert
> mkcert -key-file local-cert/localhost-key.pem -cert-file local-cert/localhost.pem localhost
> ```

```sh
npm run dev
```

### Type-Check, Compile and Minify for Production

```sh
npm run build
```

### Run Unit Tests with [Vitest](https://vitest.dev/)

```sh
npm run test:unit
```

### Lint with [ESLint](https://eslint.org/)

```sh
npm run lint
```

### Format with prettier

```sh
npm run format
```
