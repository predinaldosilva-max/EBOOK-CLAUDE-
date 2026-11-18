// Adapt the preview daemon's Vite-style flags to Wrangler's local-only CLI.
import {spawn} from 'node:child_process';
const args=process.argv.slice(2),index=args.lastIndexOf('--port'),port=index>=0?args[index+1]:'5173';
if(!/^\d{2,5}$/.test(port))throw Error('Invalid local port');
const child=spawn(process.execPath,['node_modules/wrangler/bin/wrangler.js','dev','--config','wrangler.preview.jsonc','--local','--ip','0.0.0.0','--port',port,'--show-interactive-dev-session=false'],{stdio:'inherit',env:{...process.env,WRANGLER_SEND_METRICS:'false'}});
for(const signal of ['SIGINT','SIGTERM'])process.on(signal,()=>child.kill(signal));
child.on('exit',code=>process.exit(code||0));
