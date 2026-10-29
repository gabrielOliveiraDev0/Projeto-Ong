from pathlib import Path
import subprocess, time, urllib.request, urllib.error, json, os, signal, tempfile, concurrent.futures, threading
root = Path(__file__).resolve().parents[1]
tmp = Path(tempfile.mkdtemp(prefix='ong-producao-'))
processos = []
env = os.environ.copy()
env.update(DATABASE_URL='jdbc:postgresql://127.0.0.1:15439/postgres', DATABASE_USER=os.environ.get('USER', 'postgres'), DATABASE_PASSWORD='', JWT_SECRET='chave-somente-para-validacao-local-32bytes', UPLOAD_DIR=str(tmp/'uploads'), FRONTEND_URL='http://localhost:5173', SPRING_PROFILES_ACTIVE='prod', PORT='18089')
def sql(text):
    return subprocess.check_output(['psql','-h','127.0.0.1','-p','15439','-U',env['DATABASE_USER'],'-d','postgres','-At','-v','ON_ERROR_STOP=1','-c',text],text=True).strip()
def req(path, token=None, method='GET', body=None, headers=None):
    h={'Content-Type':'application/json', **(headers or {})}
    if token: h['Authorization']='Bearer '+token
    data = body if isinstance(body,bytes) else json.dumps(body).encode() if body is not None else None
    request=urllib.request.Request('http://127.0.0.1:18089'+path,method=method,headers=h,data=data)
    try:
        with urllib.request.urlopen(request,timeout=30) as response: code=response.status; data=response.read(); rh=response.headers
    except urllib.error.HTTPError as e: code=e.code; data=e.read(); rh=e.headers
    try: data=json.loads(data) if data else None
    except ValueError: pass
    return code,data,rh
def ok(*args, **kwargs):
    c,d,h=req(*args,**kwargs)
    assert c==200,(args,c,d)
    return d
def paralelo(*acoes):
    barreira=threading.Barrier(len(acoes))
    def run(acao): barreira.wait(); return acao()
    with concurrent.futures.ThreadPoolExecutor(max_workers=len(acoes)) as pool: return list(pool.map(run,acoes))
def start(args,log,cwd=None):
    p=subprocess.Popen(args,cwd=cwd,env=env,stdout=open(tmp/log,'w'),stderr=subprocess.STDOUT,start_new_session=True);processos.append(p);return p
try:
    pg = Path(os.environ.get('PG_BIN','/usr/lib/postgresql/18/bin'))
    subprocess.run([str(pg/'initdb'),'-D',str(tmp/'db'),'-A','trust','--no-locale','-E','UTF8'],check=True,stdout=subprocess.DEVNULL)
    start([str(pg/'postgres'),'-D',str(tmp/'db'),'-h','127.0.0.1','-p','15439','-k',str(tmp)],'postgres.log')
    for _ in range(60):
        if subprocess.run(['pg_isready','-h','127.0.0.1','-p','15439'],stdout=subprocess.DEVNULL).returncode==0: break
        time.sleep(.2)
    cache = os.environ.get('MAVEN_TEST_CACHE')
    for fase in ['test','package']:
        cmd=['./mvnw','-B']+(['-Dmaven.repo.local='+cache] if cache else [])+['clean',fase]
        result=subprocess.run(cmd,cwd=root/'backend',env=env,stdout=open(tmp/(fase+'.log'),'w'),stderr=subprocess.STDOUT)
        assert result.returncode==0,(tmp/(fase+'.log')).read_text()[-6000:]
        print('PASS Maven clean '+fase,flush=True)
    app=start(['java','-jar','target/backend-0.0.1-SNAPSHOT.jar'],'backend.log',root/'backend')
    for _ in range(160):
        try:
            if req('/health')[0]==200: break
        except Exception: pass
        if app.poll() is not None: raise RuntimeError((tmp/'backend.log').read_text()[-6000:])
        time.sleep(.25)
    assert ok('/health')=={'status':'UP'}
    nomes=['admin','admin2','usuario','usuario2','vet']
    ids={}
    for nome in nomes:
        d=ok('/usuarios',method='POST',body={'nomeUsuario':nome,'emailUsuario':nome+'@producao.test','senhaUsuario':'Teste123!'})
        ids[nome]=d['idUsuario']
    sql("update usuarios set tipo_usuario='ADMINISTRADOR' where nome_usuario in ('admin','admin2'); update usuarios set tipo_usuario='VETERINARIO' where nome_usuario='vet'")
    tokens={n:ok('/login',method='POST',body={'email':n+'@producao.test','senha':'Teste123!'})['token'] for n in nomes}
    a=tokens['admin']; a2=tokens['admin2']; v=tokens['vet']
    assert req('/estoque')[0]==401
    assert req('/%65stoque',tokens['usuario'])[0]==403
    assert req('/animais/999999')[0]==404
    c,d,h=req('/estoque',method='OPTIONS',headers={'Origin':'http://localhost:5173','Access-Control-Request-Method':'POST','Access-Control-Request-Headers':'authorization,content-type'})
    assert c==200 and h['Access-Control-Allow-Origin']=='http://localhost:5173'
    assert req('/estoque',method='OPTIONS',headers={'Origin':'https://intruso.test','Access-Control-Request-Method':'POST'})[0]==403
    assert req('/uploads/holerites/teste.png')[0]==404
    print('PASS health, autorização, CORS e holerite privado',flush=True)
    animal=ok('/animais',a,'POST',{'nomeAnimal':'Teste concorrência','tipoAnimal':'Cachorro','pesoAnimal':10,'statusAnimal':'DISPONIVEL'})['idAnimal']
    def solicitar(nome): return ok('/adocoes',tokens[nome],'POST',{'idUsuario':ids[nome],'idAnimal':animal})['idSolicitacao']
    pedidos=paralelo(lambda:solicitar('usuario'),lambda:solicitar('usuario2'))
    results=paralelo(lambda:req('/adocoes/'+str(pedidos[0])+'/aprovar',a,'PATCH')[0],lambda:req('/adocoes/'+str(pedidos[1])+'/aprovar',a2,'PATCH')[0])
    assert sorted(results)==[200,409],results
    assert sql(f"select count(*) from solicitacoes_adocao where animal_id_animal={animal} and status_solicitacao='APROVADA'")=='1'
    print('PASS solicitações simultâneas e aprovação única mesmo sem itens de estoque',flush=True)
    item=ok('/estoque',a,'POST',{'nome':'Ração teste','categoria':'RACAO','quantidade':10,'unidade':'KG','valorUnitario':5,'estoqueMinimo':1,'consumoRecomendado':10})['id']
    def saida(token): return req(f'/estoque/{item}/movimentacoes',token,'POST',{'tipo':'SAIDA','quantidade':7})[0]
    results=paralelo(lambda:saida(a),lambda:saida(a2))
    assert sorted(results)==[200,400],results
    assert float(sql(f'select quantidade from itens_estoque where id={item}'))==3
    animal2=ok('/animais',a,'POST',{'nomeAnimal':'Animal alimentado','tipoAnimal':'Cachorro','pesoAnimal':10,'statusAnimal':'RESGATADO'})['idAnimal']
    ok(f'/estoque/{item}/alimentacoes',a,'POST',{'animais':[animal2]})
    sql(f"update alimentacoes_animais set processado_ate=now()-interval '2 days' where animal_id_animal={animal2}")
    results=paralelo(lambda:req('/estoque',a)[0], lambda:req(f'/estoque/{item}/movimentacoes',a2,'POST',{'tipo':'ENTRADA','quantidade':1})[0],lambda:req(f'/animais/{animal2}/veterinario',v,'PATCH',{'estadoSaudeAnimal':'Bem','statusAnimal':'EM_TRATAMENTO'})[0])
    assert results==[200,200,200],results
    quantidade=float(sql(f'select quantidade from itens_estoque where id={item}'))
    assert 3.799 < quantidade <= 3.8,quantidade
    assert float(sql(f"select sum(quantidade) from movimentacoes_estoque where item_id={item} and tipo='SAIDA_AUTOMATICA'"))<.201
    assert ok(f'/animais/{animal2}')['estadoSaudeAnimal']=='Bem'
    print('PASS estoque concorrente, processamento de consumo e veterinário simultâneo',flush=True)
    conversas=paralelo(lambda:ok('/chat/conversas',tokens['usuario'],'POST',{'idUsuario':ids['admin']})['idConversa'],lambda:ok('/chat/conversas',a,'POST',{'idUsuario':ids['usuario']})['idConversa'])
    assert conversas[0]==conversas[1]
    c=conversas[0]
    paralelo(lambda:ok(f'/chat/conversas/{c}/mensagens',a,'POST',{'texto':'Olá'}),lambda:ok(f'/chat/conversas/{c}/mensagens',tokens['usuario'],'POST',{'texto':'Resposta'}))
    assert len(ok(f'/chat/conversas/{c}/mensagens',a))==2
    assert req(f'/chat/conversas/{c}/mensagens',tokens['usuario2'])[0]==403
    print('PASS chat simultâneo e isolamento de participantes',flush=True)
    png=__import__('base64').b64decode('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+jRZkAAAAASUVORK5CYII=')
    boundary='ong-test-boundary'
    def upload(data,nome='foto.png'):
        body=(f'--{boundary}\r\nContent-Disposition: form-data; name="imagem"; filename="{nome}"\r\nContent-Type: image/png\r\n\r\n'.encode()+data+f'\r\n--{boundary}--\r\n'.encode())
        return req(f'/animais/{animal2}/imagem',a,'POST',body,{'Content-Type':'multipart/form-data; boundary='+boundary})
    assert upload(b'<script>invalido</script>')[0]==400
    code,data,_=upload(png)
    assert code==200,(code,data)
    imagem='/uploads/animais/'+data['imagemAnimal']
    assert req(imagem)[1]==png
    os.killpg(app.pid,signal.SIGTERM);app.wait(timeout=10)
    app=start(['java','-jar','target/backend-0.0.1-SNAPSHOT.jar'],'reinicio.log',root/'backend')
    for _ in range(160):
        try:
            if req('/health')[0]==200: break
        except Exception: pass
        time.sleep(.25)
    assert req('/estoque',a)[0]==200
    assert req(imagem)[1]==png
    print('PASS uploads, persistência e JWT após reinicialização',flush=True)
    print('Logs: '+str(tmp),flush=True)
finally:
    for p in reversed(processos):
        if p.poll() is None:
            os.killpg(p.pid,signal.SIGTERM)
            try:p.wait(timeout=10)
            except subprocess.TimeoutExpired:os.killpg(p.pid,signal.SIGKILL);p.wait()
