import{useState}from'react'
import{useAuth}from'../context/AuthContext'
import{useNavigate}from'react-router-dom'
import{supabase}from'../lib/supabase'

export default function Login(){
const[step,setStep]=useState('rol')
const[rolSelected,setRolSelected]=useState(null)
const[email,setEmail]=useState('')
const[password,setPassword]=useState('')
const[error,setError]=useState('')
const[loading,setLoading]=useState(false)
const[magicSent,setMagicSent]=useState(false)
const[recoveryMode,setRecoveryMode]=useState(false)
const[recoverySent,setRecoverySent]=useState(false)
const{signIn}=useAuth()
const navigate=useNavigate()

async function handleSubmit(e){
e.preventDefault();setLoading(true);setError('')
const{error:err}=await signIn(email,password)
if(err){setError('Correo o contraseña incorrectos');setLoading(false)}
else navigate('/')
}

async function handleMagicLink(e){
e.preventDefault();setLoading(true);setError('')
const{error:err}=await supabase.auth.signInWithOtp({email,options:{emailRedirectTo:window.location.origin}})
if(err){setError('Error enviando el enlace');setLoading(false)}
else{setMagicSent(true);setLoading(false)}
}

async function handleRecovery(e){
e.preventDefault();setLoading(true);setError('')
const{error:err}=await supabase.auth.resetPasswordForEmail(email,{redirectTo:window.location.origin+'/reset-password'})
if(err){setError('Error enviando el correo');setLoading(false)}
else{setRecoverySent(true);setLoading(false)}
}

const GB='#1e6fae',GD='#0d2d4a',GG='#c9a227'
const inp={width:'100%',padding:'12px 14px',border:'1.5px solid #e5e7eb',borderRadius:12,fontSize:14,outline:'none',boxSizing:'border-box',fontFamily:'inherit'}

if(step==='rol')return(
<div style={{minHeight:'100vh',background:GD,display:'flex',alignItems:'center',justifyContent:'center',padding:16}}>
<div style={{background:'#fff',borderRadius:24,padding:'40px 36px',width:'100%',maxWidth:420,boxShadow:'0 20px 60px rgba(0,0,0,0.3)'}}>
<div style={{textAlign:'center',marginBottom:32}}>
<div style={{background:GB,borderRadius:16,width:64,height:64,display:'flex',alignItems:'center',justifyContent:'center',margin:'0 auto 16px'}}><span style={{fontSize:34,fontWeight:900,color:GG}}>G</span></div>
<div style={{fontSize:24,fontWeight:900,color:GD,letterSpacing:1}}>GEINSER</div>
<div style={{fontSize:10,fontWeight:700,color:GG,letterSpacing:4,marginTop:2}}>PROHORIZONTAL</div>
<p style={{fontSize:14,color:'#6b7280',marginTop:12}}>Selecciona tu tipo de acceso</p>
</div>
<div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12,marginBottom:8}}>
{[{rol:'director',label:'Director',desc:'Gestión integral de todas las copropiedades',icon:'🏢'},{rol:'delegado',label:'Delegado',desc:'Acceso a copropiedades asignadas',icon:'👤'}].map(({rol,label,desc,icon})=>(
<button key={rol} onClick={()=>{setRolSelected(rol);setStep('login')}} style={{border:`2px solid ${rolSelected===rol?GB:'#e5e7eb'}`,borderRadius:16,padding:'20px 16px',cursor:'pointer',background:rolSelected===rol?GB+'08':'#fff',textAlign:'center',transition:'all .2s'}}>
<div style={{fontSize:32,marginBottom:8}}>{icon}</div>
<div style={{fontWeight:800,color:GD,fontSize:15,marginBottom:4}}>{label}</div>
<div style={{fontSize:12,color:'#6b7280',lineHeight:1.4}}>{desc}</div>
</button>
))}
</div>
<p style={{textAlign:'center',fontSize:12,color:'#9ca3af',marginTop:16}}>Plataforma de Gestión Integral Geinser</p>
</div>
</div>
)

// ---- MODO RECUPERAR CONTRASEÑA ----
if(recoveryMode)return(
<div style={{minHeight:'100vh',background:GD,display:'flex',alignItems:'center',justifyContent:'center',padding:16}}>
<div style={{background:'#fff',borderRadius:24,padding:'40px 36px',width:'100%',maxWidth:420,boxShadow:'0 20px 60px rgba(0,0,0,0.3)'}}>
<div style={{textAlign:'center',marginBottom:28}}>
<div style={{background:GB,borderRadius:16,width:56,height:56,display:'flex',alignItems:'center',justifyContent:'center',margin:'0 auto 14px'}}><span style={{fontSize:28,fontWeight:900,color:GG}}>G</span></div>
<div style={{fontSize:20,fontWeight:900,color:GD}}>Recuperar contraseña</div>
<p style={{fontSize:13,color:'#6b7280',marginTop:8,lineHeight:1.5}}>Ingresa tu correo y te enviaremos un enlace para crear una nueva contraseña.</p>
</div>
{recoverySent?(
<div style={{background:'#f0fdf4',border:'1.5px solid #bbf7d0',borderRadius:14,padding:20,textAlign:'center',marginBottom:20}}>
<div style={{fontSize:32,marginBottom:8}}>📧</div>
<div style={{fontWeight:800,color:'#065f46',fontSize:15,marginBottom:6}}>¡Correo enviado!</div>
<p style={{fontSize:13,color:'#047857',lineHeight:1.5}}>Revisa tu bandeja de entrada en <b>{email}</b>. El enlace es válido por 60 minutos.</p>
</div>
):(
<form onSubmit={handleRecovery}>
<div style={{marginBottom:16}}>
<label style={{display:'block',fontSize:13,fontWeight:700,color:'#374151',marginBottom:6}}>Correo electrónico</label>
<input style={inp} type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="correo@ejemplo.com" required/>
</div>
{error&&<div style={{background:'#fef2f2',border:'1px solid #fca5a5',borderRadius:10,padding:'10px 14px',color:'#dc2626',fontSize:13,marginBottom:14}}>{error}</div>}
<button type="submit" disabled={loading} style={{width:'100%',background:loading?'#9ca3af':GB,color:'#fff',border:'none',borderRadius:12,padding:'13px',fontWeight:800,fontSize:15,cursor:loading?'not-allowed':'pointer',marginBottom:12}}>
{loading?'Enviando...':'Enviar enlace de recuperación'}
</button>
</form>
)}
<button onClick={()=>{setRecoveryMode(false);setRecoverySent(false);setError('')}} style={{width:'100%',background:'#f3f4f6',border:'none',borderRadius:12,padding:'11px',fontWeight:700,fontSize:14,cursor:'pointer',color:'#374151'}}>← Volver al inicio de sesión</button>
</div>
</div>
)

// ---- MODO LOGIN NORMAL ----
return(
<div style={{minHeight:'100vh',background:GD,display:'flex',alignItems:'center',justifyContent:'center',padding:16}}>
<div style={{background:'#fff',borderRadius:24,padding:'40px 36px',width:'100%',maxWidth:420,boxShadow:'0 20px 60px rgba(0,0,0,0.3)'}}>
<div style={{textAlign:'center',marginBottom:28}}>
<div style={{background:GB,borderRadius:16,width:56,height:56,display:'flex',alignItems:'center',justifyContent:'center',margin:'0 auto 14px'}}><span style={{fontSize:28,fontWeight:900,color:GG}}>G</span></div>
<div style={{fontSize:20,fontWeight:900,color:GD}}>GEINSER PROHORIZONTAL</div>
<div style={{display:'inline-flex',alignItems:'center',gap:8,background:GB+'12',borderRadius:20,padding:'6px 14px',marginTop:10}}>
<span style={{fontSize:18}}>{rolSelected==='director'?'🏢':'👤'}</span>
<span style={{fontSize:13,fontWeight:700,color:GB}}>{rolSelected==='director'?'Director':'Delegado'}</span>
<button onClick={()=>setStep('rol')} style={{fontSize:11,color:'#9ca3af',background:'none',border:'none',cursor:'pointer',marginLeft:4,fontWeight:700}}>Cambiar</button>
</div>
</div>
{magicSent?(
<div style={{background:'#f0fdf4',border:'1.5px solid #bbf7d0',borderRadius:14,padding:20,textAlign:'center',marginBottom:20}}>
<div style={{fontSize:32,marginBottom:8}}>✅</div>
<div style={{fontWeight:800,color:'#065f46',fontSize:15,marginBottom:6}}>¡Enlace enviado!</div>
<p style={{fontSize:13,color:'#047857',lineHeight:1.5}}>Revisa tu correo <b>{email}</b> y haz clic en el enlace para ingresar sin contraseña.</p>
</div>
):(
<form onSubmit={handleSubmit}>
<div style={{marginBottom:14}}>
<label style={{display:'block',fontSize:13,fontWeight:700,color:'#374151',marginBottom:6}}>Correo electrónico</label>
<input style={inp} type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="correo@ejemplo.com" required/>
</div>
<div style={{marginBottom:6}}>
<label style={{display:'block',fontSize:13,fontWeight:700,color:'#374151',marginBottom:6}}>Contraseña</label>
<input style={inp} type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="••••••••" required/>
</div>
<div style={{textAlign:'right',marginBottom:18}}>
<button type="button" onClick={()=>{setRecoveryMode(true);setError('');setPassword('')}} style={{fontSize:12,color:GB,background:'none',border:'none',cursor:'pointer',fontWeight:700,textDecoration:'underline'}}>¿Olvidaste tu contraseña?</button>
</div>
{error&&<div style={{background:'#fef2f2',border:'1px solid #fca5a5',borderRadius:10,padding:'10px 14px',color:'#dc2626',fontSize:13,marginBottom:14}}>{error}</div>}
<button type="submit" disabled={loading} style={{width:'100%',background:loading?'#9ca3af':GD,color:'#fff',border:'none',borderRadius:12,padding:'13px',fontWeight:800,fontSize:15,cursor:loading?'not-allowed':'pointer',marginBottom:12}}>
{loading?'Ingresando...':rolSelected==='director'?'Ingresar como Director':'Ingresar como Delegado'}
</button>
</form>
)}
{!magicSent&&<div style={{textAlign:'center',marginTop:4}}>
<p style={{fontSize:12,color:'#9ca3af',marginBottom:8}}>¿Primera vez? <span style={{fontWeight:700,color:'#374151'}}>Acceso sin contraseña:</span></p>
<button onClick={handleMagicLink} disabled={loading||!email} style={{width:'100%',background:'#f3f4f6',border:'1.5px solid #e5e7eb',borderRadius:12,padding:'11px',fontWeight:700,fontSize:13,cursor:loading||!email?'not-allowed':'pointer',color:'#374151',opacity:!email?0.5:1}}>
📧 Recibir enlace por correo
</button>
</div>}
<p style={{textAlign:'center',fontSize:11,color:'#9ca3af',marginTop:20}}>Plataforma de Gestión Integral Geinser</p>
</div>
</div>
)
}
