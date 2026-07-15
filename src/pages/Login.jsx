import{useState}from'react'
import{useAuth}from'../context/AuthContext'
import{useNavigate}from'react-router-dom'
import{supabase}from'../lib/supabase'

export default function Login(){
  const[step,setStep]=useState('rol')
  const[rol,setRol]=useState(null)
  const[email,setEmail]=useState('')
  const[password,setPassword]=useState('')
  const[error,setError]=useState('')
  const[loading,setLoading]=useState(false)
  const[magicSent,setMagicSent]=useState(false)
  const[recovery,setRecovery]=useState(false)
  const[recoverySent,setRecoverySent]=useState(false)
  const{signIn}=useAuth()
  const navigate=useNavigate()

  async function handleLogin(e){e.preventDefault();setLoading(true);setError('')
const{error:err}=await signIn(email,password)
if(err){setError('Correo o contrasena incorrectos');setLoading(false);return}
const{data:ud}=await supabase.auth.getUser()
const uid=ud?.user?.id
if(uid){
const{data:perf}=await supabase.from('perfiles').select('rol').eq('id',uid).single()
if(perf&&perf.rol==='delegado'&&rol==='director'){
await supabase.auth.signOut()
setError('Este usuario no es director. Selecciona acceso Delegado.')
setLoading(false);return
}
localStorage.setItem('geinser_modo',rol)}
navigate('/')}
  async function handleMagic(e){e.preventDefault();setLoading(true);setError('');const{error:err}=await supabase.auth.signInWithOtp({email,options:{emailRedirectTo:window.location.origin}});if(err){setError('Error enviando el enlace');setLoading(false)}else{setMagicSent(true);setLoading(false)}}
  async function handleRecovery(e){e.preventDefault();setLoading(true);setError('');const{error:err}=await supabase.auth.resetPasswordForEmail(email,{redirectTo:window.location.origin+'/reset-password'});if(err){setError('Error');setLoading(false)}else{setRecoverySent(true);setLoading(false)}}

  const BG='#0d2d4a',AZ='#1e6fae',DO='#c9a227'
  const fondo={minHeight:'100vh',background:'linear-gradient(150deg,'+BG+',#0a1f36)',display:'flex',alignItems:'center',justifyContent:'center',padding:20,fontFamily:"'Segoe UI',sans-serif"}
  const tarjeta={background:'#fff',borderRadius:24,padding:'40px 36px',width:'100%',maxWidth:420,boxShadow:'0 24px 64px rgba(0,0,0,0.35)'}
  const campo={width:'100%',padding:'13px 16px',border:'2px solid #e5e7eb',borderRadius:12,fontSize:14,outline:'none',boxSizing:'border-box',marginBottom:14,background:'#fafafa',fontFamily:'inherit'}
  const logoJSX=(
    <div style={{textAlign:'center',marginBottom:28}}>
      <div style={{background:'linear-gradient(145deg,'+AZ+','+BG+')',borderRadius:18,width:70,height:70,display:'flex',alignItems:'center',justifyContent:'center',margin:'0 auto 12px',boxShadow:'0 6px 20px rgba(30,111,174,0.45)',position:'relative'}}>
        <span style={{fontSize:36,fontWeight:900,color:DO,fontFamily:'Georgia,serif'}}>G</span>
        <div style={{position:'absolute',bottom:-5,right:-5,background:DO,borderRadius:6,padding:'2px 5px',border:'2.5px solid #fff'}}>
          <span style={{fontSize:8,fontWeight:900,color:BG,letterSpacing:0.5}}>PH</span>
        </div>
      </div>
      <div style={{fontSize:22,fontWeight:900,color:BG,letterSpacing:2}}>GEINSER</div>
      <div style={{fontSize:9,fontWeight:700,color:AZ,letterSpacing:5,marginTop:2}}>PROHORIZONTAL</div>
      <div style={{width:40,height:2.5,background:'linear-gradient(90deg,'+AZ+','+DO+')',borderRadius:99,margin:'10px auto 0'}}/>
    </div>
  )

  if(step==='rol') return(
    <div style={fondo}><div style={tarjeta}>
      {logoJSX}
      <p style={{textAlign:'center',fontSize:13,color:'#64748b',marginBottom:18,fontWeight:500}}>Selecciona tu tipo de acceso</p>
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12,marginBottom:14}}>
        <button onClick={()=>{setRol('director');setStep('login')}} style={{border:'2px solid #dbeafe',borderRadius:14,padding:'18px 10px',cursor:'pointer',background:'#f8fbff',textAlign:'center'}}>
          <div style={{fontSize:28,marginBottom:6}}>🏢</div>
          <div style={{fontWeight:800,color:BG,fontSize:13}}>Director</div>
          <div style={{fontSize:10,color:'#94a3b8',marginTop:2}}>Vision ejecutiva</div>
        </button>
        <button onClick={()=>{setRol('delegado');setStep('login')}} style={{border:'2px solid #dbeafe',borderRadius:14,padding:'18px 10px',cursor:'pointer',background:'#f8fbff',textAlign:'center'}}>
          <div style={{fontSize:28,marginBottom:6}}>👤</div>
          <div style={{fontWeight:800,color:BG,fontSize:13}}>Delegado</div>
          <div style={{fontSize:10,color:'#94a3b8',marginTop:2}}>Gestion en campo</div>
        </button>
      </div>
      <div style={{background:'#f0f7ff',borderRadius:10,border:'1px solid #bfdbfe',padding:'10px 14px',display:'flex',gap:8,alignItems:'center'}}>
        <span>📱</span><span style={{fontSize:11,color:'#1e40af',fontWeight:500}}>Instala la app en tu celular</span>
      </div>
    </div></div>
  )

  if(recovery) return(
    <div style={fondo}><div style={tarjeta}>
      {logoJSX}
      <h3 style={{textAlign:'center',color:BG,marginBottom:6,fontSize:16,fontWeight:800}}>Recuperar contrasena</h3>
      {recoverySent?(
        <div style={{background:'#f0fdf4',border:'1px solid #86efac',borderRadius:12,padding:18,textAlign:'center'}}>
          <div style={{fontSize:32,marginBottom:6}}>📬</div>
          <b style={{color:'#166534'}}>Correo enviado</b>
          <p style={{fontSize:12,color:'#15803d',marginTop:6,lineHeight:1.5}}>Revisa tu bandeja en <b>{email}</b></p>
        </div>
      ):(
        <form onSubmit={handleRecovery}>
          <label style={{fontSize:12,fontWeight:700,color:'#374151',display:'block',marginBottom:6}}>Correo</label>
          <input style={campo} type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="correo@ejemplo.com" required/>
          {error&&<div style={{background:'#fef2f2',border:'1px solid #fca5a5',borderRadius:8,padding:'8px 12px',color:'#dc2626',fontSize:12,marginBottom:12}}>{error}</div>}
          <button type="submit" disabled={loading} style={{width:'100%',background:AZ,color:'#fff',border:'none',borderRadius:12,padding:'13px',fontWeight:800,fontSize:14,cursor:'pointer',marginBottom:10}}>{loading?'Enviando...':'Enviar enlace'}</button>
        </form>
      )}
      <button onClick={()=>{setRecovery(false);setRecoverySent(false);setError('')}} style={{width:'100%',background:'#f1f5f9',border:'none',borderRadius:12,padding:'11px',fontWeight:700,fontSize:13,cursor:'pointer',color:'#475569'}}>Volver</button>
    </div></div>
  )

  return(
    <div style={fondo}><div style={tarjeta}>
      {logoJSX}
      <div style={{display:'flex',justifyContent:'center',marginBottom:20}}>
        <span style={{background:'#eff6ff',color:AZ,fontSize:12,fontWeight:700,padding:'5px 14px',borderRadius:99,border:'1px solid #bfdbfe'}}>
          {rol==='director'?'🏢 Director General':'👤 Delegado'}
          <button onClick={()=>{setStep('rol');setError('')}} style={{marginLeft:8,fontSize:10,color:'#94a3b8',background:'none',border:'none',cursor:'pointer'}}>cambiar</button>
        </span>
      </div>
      {magicSent?(
        <div style={{background:'#f0fdf4',border:'1px solid #86efac',borderRadius:12,padding:18,textAlign:'center',marginBottom:12}}>
          <div style={{fontSize:32,marginBottom:6}}>✅</div>
          <b style={{color:'#166534'}}>Enlace enviado</b>
          <p style={{fontSize:12,color:'#15803d',marginTop:4}}>Revisa tu correo <b>{email}</b></p>
        </div>
      ):(
        <form onSubmit={handleLogin}>
          <label style={{fontSize:12,fontWeight:700,color:'#374151',display:'block',marginBottom:6}}>Correo electronico</label>
          <input style={campo} type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="correo@ejemplo.com" required/>
          <label style={{fontSize:12,fontWeight:700,color:'#374151',display:'block',marginBottom:6}}>Contrasena</label>
          <input style={{...campo,marginBottom:6}} type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="••••••••" required/>
          <div style={{textAlign:'right',marginBottom:14}}>
            <button type="button" onClick={()=>{setRecovery(true);setError('');setPassword('')}} style={{fontSize:12,color:AZ,background:'none',border:'none',cursor:'pointer',textDecoration:'underline'}}>Olvidaste tu contrasena?</button>
          </div>
          {error&&<div style={{background:'#fef2f2',border:'1px solid #fca5a5',borderRadius:8,padding:'8px 12px',color:'#dc2626',fontSize:12,marginBottom:12}}>{error}</div>}
          <button type="submit" disabled={loading} style={{width:'100%',background:loading?'#94a3b8':BG,color:'#fff',border:'none',borderRadius:12,padding:'13px',fontWeight:800,fontSize:14,cursor:'pointer',marginBottom:10}}>{loading?'Verificando...':(rol==='director'?'Ingresar como Director':'Ingresar como Delegado')}</button>
        </form>
      )}
      {!magicSent&&(
        <div style={{borderTop:'1px solid #f1f5f9',paddingTop:12,marginTop:2}}>
          <button onClick={handleMagic} disabled={loading||!email} style={{width:'100%',background:'#f8fafc',border:'2px dashed #cbd5e1',borderRadius:12,padding:'11px',fontWeight:700,fontSize:13,cursor:'pointer',color:'#475569',opacity:!email?0.5:1}}>📧 Recibir enlace por correo</button>
        </div>
      )}
      <p style={{textAlign:'center',fontSize:10,color:'#cbd5e1',marginTop:16}}>Geinser Prohorizontal 2025</p>
    </div></div>
  )
              }
