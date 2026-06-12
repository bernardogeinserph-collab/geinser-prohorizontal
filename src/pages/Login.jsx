import{useState}from'react'
import{useAuth}from'../context/AuthContext'
import{useNavigate}from'react-router-dom'

export default function Login(){
  const[step,setStep]=useState('rol') // 'rol' | 'form'
  const[rolSelected,setRolSelected]=useState(null)
  const[email,setEmail]=useState('')
  const[password,setPassword]=useState('')
  const[error,setError]=useState('')
  const[loading,setLoading]=useState(false)
  const{signIn}=useAuth()
  const navigate=useNavigate()

  async function handleSubmit(e){
    e.preventDefault();setLoading(true);setError('')
    const{error:err}=await signIn(email,password)
    if(err){setError('Correo o contrasena incorrectos');setLoading(false)}
    else navigate('/')
  }

  const GD='#0d2d4a',GB='#1e6fae',GG='#c9a227'

  const Logo=()=>(
    <div style={{textAlign:'center',marginBottom:28}}>
      <svg width="52" height="52" viewBox="0 0 64 64" style={{margin:'0 auto 10px',display:'block'}}>
        <rect width="64" height="64" rx="14" fill={GB}/>
        <text x="32" y="44" textAnchor="middle" fill={GG} fontSize="28" fontWeight="900" fontFamily="Arial">G</text>
      </svg>
      <div style={{fontSize:22,fontWeight:900,color:GD}}>GEINSER</div>
      <div style={{fontSize:11,color:GG,fontWeight:700,letterSpacing:4}}>PROHORIZONTAL</div>
    </div>
  )

  // PASO 1: Seleccionar tipo de usuario
  if(step==='rol') return(
    <div style={{display:'flex',alignItems:'center',justifyContent:'center',minHeight:'100vh',background:GD}}>
      <div style={{background:'#fff',borderRadius:20,padding:'40px 36px',width:'100%',maxWidth:420,boxShadow:'0 20px 60px rgba(0,0,0,0.3)'}}>
        <Logo/>
        <p style={{textAlign:'center',fontSize:13,color:'#6b7280',marginBottom:24}}>Selecciona tu tipo de acceso</p>
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:14,marginBottom:8}}>
          <button onClick={()=>{setRolSelected('director');setStep('form')}}
            style={{background:'#f0f7ff',border:'2px solid '+GB,borderRadius:14,padding:'20px 12px',cursor:'pointer',textAlign:'center',transition:'all .2s'}}>
            <div style={{fontSize:28,marginBottom:8}}>🏢</div>
            <div style={{fontWeight:900,color:GD,fontSize:14}}>Director</div>
            <div style={{fontSize:11,color:'#6b7280',marginTop:4}}>Gestión integral de todas las copropiedades</div>
          </button>
          <button onClick={()=>{setRolSelected('delegado');setStep('form')}}
            style={{background:'#f0f9f4',border:'2px solid #059669',borderRadius:14,padding:'20px 12px',cursor:'pointer',textAlign:'center',transition:'all .2s'}}>
            <div style={{fontSize:28,marginBottom:8}}>👤</div>
            <div style={{fontWeight:900,color:'#065f46',fontSize:14}}>Delegado</div>
            <div style={{fontSize:11,color:'#6b7280',marginTop:4}}>Acceso a copropiedades asignadas</div>
          </button>
        </div>
        <p style={{textAlign:'center',fontSize:11,color:'#d1d5db',marginTop:20}}>Plataforma de Gestion Integral · Geinser</p>
      </div>
    </div>
  )

  // PASO 2: Formulario de login
  const isDirector = rolSelected === 'director'
  const color = isDirector ? GD : '#065f46'
  const borderColor = isDirector ? GB : '#059669'
  const inp = {width:'100%',padding:'10px 14px',border:'1.5px solid #e5e7eb',borderRadius:10,fontSize:14,outline:'none',boxSizing:'border-box'}

  return(
    <div style={{display:'flex',alignItems:'center',justifyContent:'center',minHeight:'100vh',background:GD}}>
      <div style={{background:'#fff',borderRadius:20,padding:'40px 36px',width:'100%',maxWidth:400,boxShadow:'0 20px 60px rgba(0,0,0,0.3)'}}>
        <Logo/>
        <div style={{display:'flex',alignItems:'center',justifyContent:'center',gap:8,marginBottom:20}}>
          <div style={{background:isDirector?'#e8f4fd':'#e6f9f0',border:'1.5px solid '+borderColor,borderRadius:20,padding:'4px 14px',fontSize:12,fontWeight:700,color}}>
            {isDirector?'🏢 Director':'👤 Delegado'}
          </div>
          <button onClick={()=>{setStep('rol');setError('');setEmail('');setPassword('')}}
            style={{background:'none',border:'none',fontSize:11,color:'#9ca3af',cursor:'pointer',textDecoration:'underline'}}>
            Cambiar
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div style={{marginBottom:16}}>
            <label style={{display:'block',fontSize:12,fontWeight:700,color:'#374151',marginBottom:6}}>Correo electronico</label>
            <input type="email" required value={email} onChange={e=>setEmail(e.target.value)}
              placeholder="correo@geinser.com" style={inp}/>
          </div>
          <div style={{marginBottom:8}}>
            <label style={{display:'block',fontSize:12,fontWeight:700,color:'#374151',marginBottom:6}}>Contrasena</label>
            <input type="password" required value={password} onChange={e=>setPassword(e.target.value)}
              placeholder="••••••••" style={inp}/>
          </div>
          {error&&<div style={{background:'#fef2f2',border:'1px solid #fca5a5',borderRadius:8,padding:'8px 12px',fontSize:12,color:'#dc2626',marginBottom:12}}>{error}</div>}
          <button type="submit" disabled={loading}
            style={{width:'100%',background:loading?'#9ca3af':color,color:'#fff',border:'none',borderRadius:12,padding:13,fontWeight:800,fontSize:15,cursor:loading?'not-allowed':'pointer',marginTop:8}}>
            {loading?'Ingresando...':isDirector?'Ingresar como Director':'Ingresar como Delegado'}
          </button>
        </form>
        <p style={{textAlign:'center',fontSize:11,color:'#9ca3af',marginTop:20}}>Plataforma de Gestion Integral · Geinser</p>
      </div>
    </div>
  )
}
