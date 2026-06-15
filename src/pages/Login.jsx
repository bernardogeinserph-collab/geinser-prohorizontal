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

  const GB='#1e6fae',GD='#0d2d4a',GG='#c9a227'
  const inp={width:'100%',padding:'12px 14px',border:'1.5px solid #e5e7eb',borderRadius:10,fontSize:14,outline:'none',boxSizing:'border-box',fontFamily:'inherit',marginBottom:14}
  const btn=(bg)=>({width:'100%',background:bg,color:'#fff',border:'none',borderRadius:10,padding:'13px',fontWeight:800,fontSize:14,cursor:'pointer',marginBottom:10})

  async function handleLogin(e){
    e.preventDefault()
    setLoading(true);setError('')
    const{error:err}=await signIn(email,password)
    if(err){setError('Correo o contraseña incorrectos');setLoading(false)}
    else navigate('/')
  }

  async function handleMagic(e){
    e.preventDefault()
    setLoading(true);setError('')
    const{error:err}=await supabase.auth.signInWithOtp({email,options:{emailRedirectTo:window.location.origin}})
    if(err){setError('Error enviando el enlace');setLoading(false)}
    else{setMagicSent(true);setLoading(false)}
  }

  async function handleRecovery(e){
    e.preventDefault()
    setLoading(true);setError('')
    const{error:err}=await supabase.auth.resetPasswordForEmail(email,{redirectTo:window.location.origin+'/reset-password'})
    if(err){setError('Error enviando el correo');setLoading(false)}
    else{setRecoverySent(true);setLoading(false)}
  }

  const Logo=()=>(
    <div style={{textAlign:'center',marginBottom:24}}>
      <div style={{background:GB,borderRadius:14,width:56,height:56,display:'flex',alignItems:'center',justifyContent:'center',margin:'0 auto 10px'}}>
        <span style={{fontSize:28,fontWeight:900,color:GG}}>G</span>
      </div>
      <div style={{fontSize:18,fontWeight:900,color:GD,letterSpacing:1}}>GEINSER</div>
      <div style={{fontSize:9,fontWeight:700,color:GG,letterSpacing:4}}>PROHORIZONTAL</div>
    </div>
  )

  if(step==='rol'){
    return(
      <div style={{minHeight:'100vh',background:GD,display:'flex',alignItems:'center',justifyContent:'center',padding:16}}>
        <div style={{background:'#fff',borderRadius:20,padding:'36px 32px',width:'100%',maxWidth:400,boxShadow:'0 20px 60px #0003'}}>
          <Logo/>
          <p style={{textAlign:'center',fontSize:13,color:'#6b7280',marginBottom:20}}>Selecciona tu tipo de acceso</p>
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12}}>
            {[{r:'director',icon:'🏢',t:'Director',d:'Gestión integral'},{r:'delegado',icon:'👤',t:'Delegado',d:'Copropiedades asignadas'}].map(({r:rv,icon,t,d})=>(
              <button key={rv} onClick={()=>{setRol(rv);setStep('login')}} style={{border:'2px solid #e5e7eb',borderRadius:14,padding:'18px 12px',cursor:'pointer',background:'#fff',textAlign:'center'}}>
                <div style={{fontSize:28,marginBottom:6}}>{icon}</div>
                <div style={{fontWeight:800,color:GD,fontSize:14}}>{t}</div>
                <div style={{fontSize:11,color:'#9ca3af',marginTop:3}}>{d}</div>
              </button>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if(recovery){
    return(
      <div style={{minHeight:'100vh',background:GD,display:'flex',alignItems:'center',justifyContent:'center',padding:16}}>
        <div style={{background:'#fff',borderRadius:20,padding:'36px 32px',width:'100%',maxWidth:400,boxShadow:'0 20px 60px #0003'}}>
          <Logo/>
          <h3 style={{textAlign:'center',color:GD,marginBottom:8,fontSize:16}}>Recuperar contraseña</h3>
          <p style={{textAlign:'center',fontSize:13,color:'#6b7280',marginBottom:20}}>Te enviaremos un enlace para crear una nueva contraseña</p>
          {recoverySent?(
            <div style={{background:'#f0fdf4',border:'1px solid #bbf7d0',borderRadius:10,padding:16,textAlign:'center'}}>
              <div style={{fontSize:28,marginBottom:8}}>📧</div>
              <b style={{color:'#065f46'}}>¡Correo enviado!</b>
              <p style={{fontSize:12,color:'#047857',marginTop:6}}>Revisa tu bandeja de entrada en {email}</p>
            </div>
          ):(
            <form onSubmit={handleRecovery}>
              <input style={inp} type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="Tu correo electrónico" required/>
              {error&&<div style={{color:'#dc2626',fontSize:12,marginBottom:10}}>{error}</div>}
              <button type="submit" disabled={loading} style={btn(GB)}>{loading?'Enviando...':'Enviar enlace'}</button>
            </form>
          )}
          <button onClick={()=>{setRecovery(false);setRecoverySent(false);setError('')}} style={{...btn('#f3f4f6'),color:GD}}>← Volver</button>
        </div>
      </div>
    )
  }

  return(
    <div style={{minHeight:'100vh',background:GD,display:'flex',alignItems:'center',justifyContent:'center',padding:16}}>
      <div style={{background:'#fff',borderRadius:20,padding:'36px 32px',width:'100%',maxWidth:400,boxShadow:'0 20px 60px #0003'}}>
        <Logo/>
        <div style={{display:'flex',justifyContent:'center',marginBottom:20}}>
          <span style={{background:'#eff6ff',color:GB,fontSize:12,fontWeight:700,padding:'4px 14px',borderRadius:20}}>
            {rol==='director'?'🏢 Director':'👤 Delegado'}
            <button onClick={()=>{setStep('rol');setError('')}} style={{marginLeft:8,fontSize:11,color:'#9ca3af',background:'none',border:'none',cursor:'pointer',fontWeight:700}}>Cambiar</button>
          </span>
        </div>
        {magicSent?(
          <div style={{background:'#f0fdf4',border:'1px solid #bbf7d0',borderRadius:10,padding:16,textAlign:'center',marginBottom:12}}>
            <div style={{fontSize:28,marginBottom:6}}>✅</div>
            <b style={{color:'#065f46'}}>¡Enlace enviado!</b>
            <p style={{fontSize:12,color:'#047857',marginTop:4}}>Revisa tu correo {email}</p>
          </div>
        ):(
          <form onSubmit={handleLogin}>
            <label style={{fontSize:12,fontWeight:700,color:'#374151',display:'block',marginBottom:5}}>Correo electrónico</label>
            <input style={inp} type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="correo@ejemplo.com" required/>
            <label style={{fontSize:12,fontWeight:700,color:'#374151',display:'block',marginBottom:5}}>Contraseña</label>
            <input style={{...inp,marginBottom:6}} type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="••••••••" required/>
            <div style={{textAlign:'right',marginBottom:14}}>
              <button type="button" onClick={()=>{setRecovery(true);setError('');setPassword('')}} style={{fontSize:12,color:GB,background:'none',border:'none',cursor:'pointer',fontWeight:600,textDecoration:'underline'}}>¿Olvidaste tu contraseña?</button>
            </div>
            {error&&<div style={{background:'#fef2f2',border:'1px solid #fca5a5',borderRadius:8,padding:'8px 12px',color:'#dc2626',fontSize:12,marginBottom:12}}>{error}</div>}
            <button type="submit" disabled={loading} style={btn(GD)}>{loading?'Ingresando...':`Ingresar como ${rol==='director'?'Director':'Delegado'}`}</button>
          </form>
        )}
        {!magicSent&&(
          <button onClick={handleMagic} disabled={loading||!email} style={{...btn('#f3f4f6'),color:GD,opacity:!email?0.5:1}}>
            📧 Recibir enlace por correo
          </button>
        )}
      </div>
    </div>
  )
      }
