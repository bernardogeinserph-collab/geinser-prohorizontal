import{useState}from'react'
import{useAuth}from'../context/AuthContext'
import{useNavigate}from'react-router-dom'
export default function Login(){
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
  const inp={width:'100%',padding:'10px 14px',border:'1.5px solid #e5e7eb',borderRadius:10,fontSize:14,outline:'none',boxSizing:'border-box'}
  return(
    <div style={{display:'flex',alignItems:'center',justifyContent:'center',minHeight:'100vh',background:'#0d2d4a'}}>
      <div style={{background:'#fff',borderRadius:20,padding:'40px 36px',width:'100%',maxWidth:400,boxShadow:'0 20px 60px rgba(0,0,0,0.3)'}}>
        <div style={{textAlign:'center',marginBottom:32}}>
          <svg width="52" height="52" viewBox="0 0 64 64" style={{margin:'0 auto 12px',display:'block'}}>
            <rect width="64" height="64" rx="14" fill="#1e6fae"/>
            <text x="32" y="44" textAnchor="middle" fill="#c9a227" fontSize="28" fontWeight="900" fontFamily="Arial">G</text>
          </svg>
          <div style={{fontSize:22,fontWeight:900,color:'#0d2d4a'}}>GEINSER</div>
          <div style={{fontSize:11,color:'#c9a227',fontWeight:700,letterSpacing:4}}>PROHORIZONTAL</div>
        </div>
        <form onSubmit={handleSubmit}>
          <div style={{marginBottom:16}}>
            <label style={{display:'block',fontSize:12,fontWeight:700,color:'#374151',marginBottom:6}}>Correo electronico</label>
            <input type="email" required value={email} onChange={e=>setEmail(e.target.value)} placeholder="correo@geinser.com" style={inp}/>
          </div>
          <div style={{marginBottom:8}}>
            <label style={{display:'block',fontSize:12,fontWeight:700,color:'#374151',marginBottom:6}}>Contrasena</label>
            <input type="password" required value={password} onChange={e=>setPassword(e.target.value)} placeholder="••••••••" style={inp}/>
          </div>
          {error&&<div style={{background:'#fef2f2',border:'1px solid #fca5a5',borderRadius:8,padding:'8px 12px',fontSize:12,color:'#dc2626',marginBottom:12}}>{error}</div>}
          <button type="submit" disabled={loading} style={{width:'100%',background:loading?'#9ca3af':'#0d2d4a',color:'#fff',border:'none',borderRadius:12,padding:13,fontWeight:800,fontSize:15,cursor:loading?'not-allowed':'pointer',marginTop:8}}>
            {loading?'Ingresando...':'Ingresar'}
          </button>
        </form>
        <p style={{textAlign:'center',fontSize:11,color:'#9ca3af',marginTop:20}}>Plataforma de Gestion Integral · Geinser</p>
      </div>
    </div>
  )
}
