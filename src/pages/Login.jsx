import{useState}from'react'
import{useAuth}from'../context/AuthContext'
import{useNavigate}from'react-router-dom'
import{supabase}from'../lib/supabase'

const GB='#1e6fae',GD='#0d2d4a',GG='#c9a227'

function GeinserLogo(){
  return(
    <div style={{textAlign:'center',marginBottom:28}}>
      <div style={{position:'relative',display:'inline-block',marginBottom:14}}>
        <div style={{background:'linear-gradient(135deg,'+GB+','+GD+')',borderRadius:20,width:72,height:72,display:'flex',alignItems:'center',justifyContent:'center',boxShadow:'0 8px 24px rgba(30,111,174,0.5)',margin:'0 auto'}}>
          <span style={{fontSize:38,fontWeight:900,color:GG,fontFamily:'Georgia,serif',letterSpacing:-1}}>G</span>
        </div>
        <div style={{position:'absolute',bottom:-4,right:-4,width:22,height:22,background:GG,borderRadius:6,border:'3px solid #fff',display:'flex',alignItems:'center',justifyContent:'center'}}>
          <span style={{fontSize:9,fontWeight:900,color:GD}}>PH</span>
        </div>
      </div>
      <div style={{fontSize:24,fontWeight:900,color:GD,letterSpacing:2,lineHeight:1}}>GEINSER</div>
      <div style={{fontSize:10,fontWeight:700,color:GB,letterSpacing:5,marginTop:3}}>PROHORIZONTAL</div>
      <div style={{width:48,height:3,background:'linear-gradient(90deg,'+GB+','+GG+')',borderRadius:99,margin:'12px auto 0'}}/>
    </div>
  )
}

function Decoraciones(){
  return(
    <>
      <div style={{position:'absolute',top:-80,right:-80,width:300,height:300,borderRadius:'50%',border:'1px solid rgba(201,162,71,0.15)',pointerEvents:'none'}}/>
      <div style={{position:'absolute',top:-40,right:-40,width:180,height:180,borderRadius:'50%',border:'1px solid rgba(201,162,71,0.1)',pointerEvents:'none'}}/>
      <div style={{position:'absolute',bottom:-100,left:-80,width:280,height:280,borderRadius:'50%',background:'rgba(30,111,174,0.08)',pointerEvents:'none'}}/>
    </>
  )
}

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

  const wrap={minHeight:'100vh',background:'linear-gradient(135deg,'+GD+' 0%,#0a1f36 50%,#112240 100%)',display:'flex',alignItems:'center',justifyContent:'center',padding:20,position:'relative',overflow:'hidden',fontFamily:"'Segoe UI',system-ui,sans-serif"}
  const card={background:'#fff',borderRadius:24,padding:'40px 36px',width:'100%',maxWidth:420,boxShadow:'0 32px 80px rgba(0,0,0,0.4)',position:'relative',zIndex:1}
  const inp={width:'100%',padding:'13px 16px',border:'2px solid #e5e7eb',borderRadius:12,fontSize:14,outline:'none',boxSizing:'border-box',fontFamily:'inherit',marginBottom:14,background:'#fafafa'}
  const btnPrimary=(c)=>({width:'100%',background:c,color:'#fff',border:'none',borderRadius:12,padding:'14px',fontWeight:800,fontSize:14,cursor:loading?'not-allowed':'pointer',marginBottom:10,boxShadow:'0 4px 14px rgba(0,0,0,0.25)'})

  async function handleLogin(e){
    e.preventDefault();setLoading(true);setError('')
    const{error:err}=await signIn(email,password)
    if(err){setError('Correo o contraseña incorrectos');setLoading(false)}
    else navigate('/')
  }
  async function handleMagic(e){
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

  if(step==='rol') return(
    <div style={wrap}>
      <Decoraciones/>
      <div style={card}>
        <GeinserLogo/>
        <p style={{textAlign:'center',fontSize:13,color:'#64748b',marginBottom:20,fontWeight:500}}>Plataforma de Gestión Integral</p>
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12,marginBottom:16}}>
          {[{r:'director',icon:'🏢',t:'Director',d:'Visión ejecutiva global'},{r:'delegado',icon:'👤',t:'Delegado',d:'Gestión en campo'}].map(({r:rv,icon,t,d})=>(
            <button key={rv} onClick={()=>{setRol(rv);setStep('login')}} style={{border:'2px solid #e5e7eb',borderRadius:16,padding:'20px 14px',cursor:'pointer',background:'#fff',textAlign:'center',outline:'none'}}>
              <div style={{fontSize:30,marginBottom:8}}>{icon}</div>
              <div style={{fontWeight:800,color:GD,fontSize:14,marginBottom:3}}>{t}</div>
              <div style={{fontSize:11,color:'#94a3b8',lineHeight:1.4}}>{d}</div>
            </button>
          ))}
        </div>
        <div style={{padding:'10px 14px',background:'#f0f7ff',borderRadius:10,border:'1px solid #bfdbfe',display:'flex',alignItems:'center',gap:8}}>
          <span style={{fontSize:16}}>📱</span>
          <span style={{fontSize:11,color:'#1e40af',fontWeight:500}}>Instala la app en tu celular — funciona sin internet</span>
        </div>
      </div>
    </div>
  )

  if(recovery) return(
    <div style={wrap}>
      <Decoraciones/>
      <div style={card}>
        <GeinserLogo/>
        <h3 style={{textAlign:'center',color:GD,marginBottom:6,fontSize:17,fontWeight:800}}>Recuperar contraseña</h3>
        <p style={{textAlign:'center',fontSize:13,color:'#64748b',marginBottom:22}}>Te enviamos un enlace seguro a tu correo</p>
        {recoverySent?(
          <div style={{background:'#f0fdf4',border:'1px solid #86efac',borderRadius:14,padding:20,textAlign:'center'}}>
            <div style={{fontSize:36,marginBottom:8}}>📬</div>
            <b style={{color:'#166534',fontSize:15}}>¡Correo enviado!</b>
            <p style={{fontSize:12,color:'#15803d',marginTop:8,lineHeight:1.6}}>Revisa tu bandeja en <b>{email}</b>. El enlace es válido por 60 minutos.</p>
          </div>
        ):(
          <form onSubmit={handleRecovery}>
            <label style={{fontSize:12,fontWeight:700,color:'#374151',display:'block',marginBottom:6}}>Tu correo electrónico</label>
            <input style={inp} type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="correo@ejemplo.com" required/>
            {error&&<div style={{background:'#fef2f2',border:'1px solid #fca5a5',borderRadius:10,padding:'10px 14px',color:'#dc2626',fontSize:12,marginBottom:14}}>{error}</div>}
            <button type="submit" disabled={loading} style={btnPrimary(loading?'#94a3b8':'linear-gradient(135deg,'+GB+',#0d4a8e)')}>
              {loading?'Enviando...':'Enviar enlace de recuperación'}
            </button>
          </form>
        )}
        <button onClick={()=>{setRecovery(false);setRecoverySent(false);setError('')}} style={{width:'100%',background:'#f1f5f9',border:'none',borderRadius:12,padding:'12px',fontWeight:700,fontSize:13,cursor:'pointer',color:'#475569',marginTop:6}}>
          ← Volver al inicio de sesión
        </button>
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

  async function handleLogin(e){
    e.preventDefault();setLoading(true);setError('')
    const{error:err}=await signIn(email,password)
    if(err){setError('Correo o contraseña incorrectos');setLoading(false)}
    else navigate('/')
  }
  async function handleMagic(e){
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

  const logo=(
    <div style={{textAlign:'center',marginBottom:28}}>
      <div style={{position:'relative',display:'inline-block',marginBottom:14}}>
        <div style={{background:'linear-gradient(135deg,#1e6fae,#0d2d4a)',borderRadius:20,width:72,height:72,display:'flex',alignItems:'center',justifyContent:'center',boxShadow:'0 8px 24px rgba(30,111,174,0.5)',margin:'0 auto'}}>
          <span style={{fontSize:38,fontWeight:900,color:'#c9a227',fontFamily:'Georgia,serif',letterSpacing:-1}}>G</span>
        </div>
        <div style={{position:'absolute',bottom:-4,right:-4,width:22,height:22,background:'#c9a227',borderRadius:6,border:'3px solid #fff',display:'flex',alignItems:'center',justifyContent:'center'}}>
          <span style={{fontSize:9,fontWeight:900,color:'#0d2d4a'}}>PH</span>
        </div>
      </div>
      <div style={{fontSize:24,fontWeight:900,color:'#0d2d4a',letterSpacing:2,lineHeight:1}}>GEINSER</div>
      <div style={{fontSize:10,fontWeight:700,color:'#1e6fae',letterSpacing:5,marginTop:3}}>PROHORIZONTAL</div>
      <div style={{width:48,height:3,background:'linear-gradient(90deg,#1e6fae,#c9a227)',borderRadius:99,margin:'12px auto 0'}}/>
    </div>
  )

  const bg={minHeight:'100vh',background:'linear-gradient(135deg,#0d2d4a 0%,#0a1f36 50%,#112240 100%)',display:'flex',alignItems:'center',justifyContent:'center',padding:20,fontFamily:"'Segoe UI',system-ui,sans-serif"}
  const card={background:'#fff',borderRadius:24,padding:'40px 36px',width:'100%',maxWidth:420,boxShadow:'0 32px 80px rgba(0,0,0,0.4)'}
  const inp={width:'100%',padding:'13px 16px',border:'2px solid #e5e7eb',borderRadius:12,fontSize:14,outline:'none',boxSizing:'border-box',fontFamily:'inherit',marginBottom:14,background:'#fafafa'}
  const errBox={background:'#fef2f2',border:'1px solid #fca5a5',borderRadius:10,padding:'10px 14px',color:'#dc2626',fontSize:12,marginBottom:14}
  const okBox={background:'#f0fdf4',border:'1px solid #86efac',borderRadius:14,padding:20,textAlign:'center'}

  if(step==='rol') return(
    <div style={bg}>
      <div style={card}>
        {logo}
        <p style={{textAlign:'center',fontSize:13,color:'#64748b',marginBottom:20,fontWeight:500}}>Plataforma de Gestión Integral</p>
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12,marginBottom:16}}>
          <button onClick={()=>{setRol('director');setStep('login')}} style={{border:'2px solid #e5e7eb',borderRadius:16,padding:'20px 14px',cursor:'pointer',background:'#fff',textAlign:'center'}}>
            <div style={{fontSize:30,marginBottom:8}}>🏢</div>
            <div style={{fontWeight:800,color:'#0d2d4a',fontSize:14,marginBottom:3}}>Director</div>
            <div style={{fontSize:11,color:'#94a3b8'}}>Visión ejecutiva global</div>
          </button>
          <button onClick={()=>{setRol('delegado');setStep('login')}} style={{border:'2px solid #e5e7eb',borderRadius:16,padding:'20px 14px',cursor:'pointer',background:'#fff',textAlign:'center'}}>
            <div style={{fontSize:30,marginBottom:8}}>👤</div>
            <div style={{fontWeight:800,color:'#0d2d4a',fontSize:14,marginBottom:3}}>Delegado</div>
            <div style={{fontSize:11,color:'#94a3b8'}}>Gestión en campo</div>
          </button>
        </div>
        <div style={{padding:'10px 14px',background:'#f0f7ff',borderRadius:10,border:'1px solid #bfdbfe',display:'flex',alignItems:'center',gap:8}}>
          <span style={{fontSize:16}}>📱</span>
          <span style={{fontSize:11,color:'#1e40af',fontWeight:500}}>Instala la app en tu celular — funciona sin internet</span>
        </div>
      </div>
    </div>
  )

  if(recovery) return(
    <div style={bg}>
      <div style={card}>
        {logo}
        <h3 style={{textAlign:'center',color:'#0d2d4a',marginBottom:6,fontSize:17,fontWeight:800}}>Recuperar contraseña</h3>
        <p style={{textAlign:'center',fontSize:13,color:'#64748b',marginBottom:22}}>Te enviamos un enlace seguro a tu correo</p>
        {recoverySent ? (
          <div style={okBox}>
            <div style={{fontSize:36,marginBottom:8}}>📬</div>
            <b style={{color:'#166534',fontSize:15}}>Correo enviado</b>
            <p style={{fontSize:12,color:'#15803d',marginTop:8,lineHeight:1.6}}>Revisa tu bandeja en <b>{email}</b>. El enlace expira en 60 minutos.</p>
          </div>
        ) : (
          <form onSubmit={handleRecovery}>
            <label style={{fontSize:12,fontWeight:700,color:'#374151',display:'block',marginBottom:6}}>Tu correo</label>
            <input style={inp} type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="correo@ejemplo.com" required/>
            {error && <div style={errBox}>{error}</div>}
            <button type="submit" disabled={loading} style={{width:'100%',background:loading?'#94a3b8':'#1e6fae',color:'#fff',border:'none',borderRadius:12,padding:'14px',fontWeight:800,fontSize:14,cursor:'pointer',marginBottom:10}}>
              {loading ? 'Enviando...' : 'Enviar enlace de recuperación'}
            </button>
          </form>
        )}
        <button onClick={()=>{setRecovery(false);setRecoverySent(false);setError('')}} style={{width:'100%',background:'#f1f5f9',border:'none',borderRadius:12,padding:'12px',fontWeight:700,fontSize:13,cursor:'pointer',color:'#475569',marginTop:6}}>
          Volver al inicio de sesión
        </button>
      </div>
    </div>
  )

  return(
    <div style={bg}>
      <div style={card}>
        {logo}
        <div style={{display:'flex',justifyContent:'center',marginBottom:22}}>
          <span style={{background:'#eff6ff',color:'#1e6fae',fontSize:12,fontWeight:700,padding:'6px 16px',borderRadius:99,border:'1px solid #bfdbfe'}}>
            {rol==='director' ? '🏢 Director General' : '👤 Delegado'}
            <button onClick={()=>{setStep('rol');setError('')}} style={{marginLeft:8,fontSize:10,color:'#94a3b8',background:'none',border:'none',cursor:'pointer',fontWeight:700}}>cambiar</button>
          </span>
        </div>
        {magicSent ? (
          <div style={{...okBox,marginBottom:12}}>
            <div style={{fontSize:36,marginBottom:8}}>✅</div>
            <b style={{color:'#166534',fontSize:15}}>Enlace enviado</b>
            <p style={{fontSize:12,color:'#15803d',marginTop:6,lineHeight:1.6}}>Revisa tu correo <b>{email}</b> y haz clic en el enlace para ingresar.</p>
          </div>
        ) : (
          <form onSubmit={handleLogin}>
            <label style={{fontSize:12,fontWeight:700,color:'#374151',display:'block',marginBottom:6}}>Correo electrónico</label>
            <input style={inp} type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="correo@ejemplo.com" required/>
fix: Login sin sub-componentes ni variables externas - version estable            <input style={{...inp,marginBottom:6}} type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="••••••••" required/>
            <div style={{textAlign:'right',marginBottom:16}}>
              <button type="button" onClick={()=>{setRecovery(true);setError('');setPassword('')}} style={{fontSize:12,color:'#1e6fae',background:'none',border:'none',cursor:'pointer',fontWeight:600,textDecoration:'underline'}}>
                ¿Olvidaste tu contraseña?
              </button>
            </div>
            {error && <div style={errBox}>{error}</div>}
            <button type="submit" disabled={loading} style={{width:'100%',background:loading?'#94a3b8':'#0d2d4a',color:'#fff',border:'none',borderRadius:12,padding:'14px',fontWeight:800,fontSize:14,cursor:'pointer',marginBottom:10}}>
              {loading ? 'Verificando...' : (rol==='director' ? 'Ingresar como Director' : 'Ingresar como Delegado')}
            </button>
          </form>
        )}
        {!magicSent && (
          <div style={{borderTop:'1px solid #f1f5f9',paddingTop:14,marginTop:4}}>
            <p style={{textAlign:'center',fontSize:11,color:'#94a3b8',marginBottom:10,fontWeight:500}}>Sin contraseña:</p>
            <button onClick={handleMagic} disabled={loading||!email} style={{width:'100%',background:'#f8fafc',border:'2px dashed #cbd5e1',borderRadius:12,padding:'12px',fontWeight:700,fontSize:13,cursor:'pointer',color:'#475569',opacity:!email?0.5:1}}>
              Recibir enlace por correo
            </button>
          </div>
        )}
        <p style={{textAlign:'center',fontSize:10,color:'#cbd5e1',marginTop:18}}>Geinser Prohorizontal · 2025</p>
      </div>
    </div>
  )
      }
