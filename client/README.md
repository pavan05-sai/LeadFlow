# LeadFlow CRM frontend

## Requirements

- Node.js 22.12 or later
- The API server, or a deployed API URL

## Development

```bash
npm ci
npm run dev
```

By default, Vite proxies `/api` requests to `http://localhost:5000`. Override
the proxy in `vite.config.js` when the development API runs elsewhere.

## Production

Set `VITE_API_URL` to the API base URL, including `/api`, before building when
the frontend and API are hosted on different origins. For example:

```powershell
$env:VITE_API_URL = "https://api.example.com/api"
npm ci
npm run lint
npm run build
```

The build is written to `dist/`. Configure the static host to serve
`index.html` for client-side routes and allow HTTPS requests to the API.
