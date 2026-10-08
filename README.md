# Trading Chart Analyzer Pro

This is the real web-app architecture: mobile web UI + server-side AI vision analysis. The browser never receives the OpenAI API key.

## Run
1. Install Node.js 20+.
2. `npm install`
3. Copy `.env.example` to `.env` and add `OPENAI_API_KEY`.
4. `npm start`
5. Open `http://localhost:3000`.

For public hosting, deploy the Node server to a host that supports Node.js and set `OPENAI_API_KEY` as a secret/environment variable. Do not put the key in `public/app.js`.

The analyzer follows Trend + Pullback + Closed-Candle Confirmation and is deliberately conservative. It cannot honestly guarantee a 100% correct trade result; markets are uncertain. A WAIT result is required whenever the screenshot does not provide sufficient evidence.
