#!/usr/bin/env python3
"""Owner desktop only: compare real legacy rows without printing credentials.
Requires an authenticated Wrangler. Never put its private output in GitHub/chat.
"""
import argparse,hashlib,json,os,subprocess,sys
from pathlib import Path
p=argparse.ArgumentParser();p.add_argument('mode',choices=['before','after']);p.add_argument('--output',required=True);p.add_argument('--config',default='wrangler.jsonc');a=p.parse_args()
config=json.loads(Path(a.config).read_text());binding=next(x for x in config['d1_databases'] if x['binding']=='DB');database=binding['database_name']
r=subprocess.run(['npx','wrangler','d1','execute',database,'--remote','--config',a.config,'--command','SELECT id,password_hash,is_test,installation_hash,generation,disabled,activated_at FROM licenses ORDER BY id','--json'],capture_output=True,text=True)
if r.returncode:sys.exit('Não foi possível consultar o banco. Confira login/permissão no Cloudflare; nenhum dado foi alterado.')
try:
 data=json.loads(r.stdout);rows=[row for item in data for row in item.get('results',[])]
except Exception:sys.exit('Resposta inválida. Não houve comparação nem alteração de dados.')
fingerprints={row['id']:hashlib.sha256(json.dumps(row,sort_keys=True,separators=(',',':')).encode()).hexdigest() for row in rows}
file=Path(a.output)
if a.mode=='before':
 if file.exists():sys.exit('O arquivo já existe. Preserve-o; escolha outro nome para uma nova fotografia.')
 fd=os.open(file,os.O_WRONLY|os.O_CREAT|os.O_EXCL,0o600)
 with os.fdopen(fd,'w') as stream:json.dump({'database':database,'rows':fingerprints},stream,indent=2)
 print(json.dumps({'recorded_rows':len(rows),'comparison_file':str(file),'writes_to_database':0}))
else:
 old=json.loads(file.read_text())
 if old['database']!=database:sys.exit('Banco diferente. Comparação cancelada.')
 changed=[key for key,value in old['rows'].items() if fingerprints.get(key)!=value]
 print(json.dumps({'baseline_rows':len(old['rows']),'unchanged':len(old['rows'])-len(changed),'changed_or_missing':len(changed),'new_rows':len(set(fingerprints)-set(old['rows'])),'writes_to_database':0}))
 if changed:sys.exit(2)
