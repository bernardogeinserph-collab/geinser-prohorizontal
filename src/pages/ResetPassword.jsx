import{useState,useEffect}from'react'
import{supabase}from'../lib/supabase'
import{useNavigate}from'react-router-dom'

export default function ResetPassword(){
const[password,setPassword]=useState('')
const[confirm,setConfirm]=useState('')
const[loading,setLoading]=useState(false)
const[error,setError]=useState('')
const[done,setDone]=useState(false)
const navigate=useNavigate()
const GB='#1e6fae',GD='#0d2d4a',GG='#c9a227'
const inp={width:'100%',padding:'12px 14px',border:'1.5px solid #e5e7eb',borderRadius:12,fontSize:14,outline:'none',boxSizing:'border-box',fontFamily:'inherit'}

useEffect(()=>{
const{data:{subscription}}=supabase.auth.onAuthStateChange((event,session)=>{
if(event==='PASSWORD_RECOVERY'){/* sesion activa para cambiar pass */}
})
return()=>subscription.unsubscribe()
},[])

async function handleReset(e){
e.preventDefault()
if(password.length<6){setError('La contraseña debe tener al menos 6 caracteres');return}
if(password!==confirm){setError('Las contraseñas no coinciden');return}
setLoading(true);setError('')
const{error:err}=await supabase.auth.updateUser({password})
if(err){setError('Error: '+err.message);setLoading(false)}
else{setDone(true);setTimeout(()=>navigate('/'),2500)}
}

return(
<div style={{minHeight:'100vh',background:GD,display:'flex',alignItems:'center',justifyContent:'center',padding:16}}>
<div style={{background:'#fff',borderRadius:24,padding:'40px 36px',width:'100%',maxWidth:420,boxShadow:'0 20px 60px rgba(0,0,0,0.3)'}}>
<div style={{textAlign:'center',marginBottom:28}}>
<div style={{background:GB,borderRadius:16,width:60,height:60,display:'flex',alignItems:'center',justifyContent:'center',margin:'0 auto 14px'}}><span style={{fontSize:32,fontWeight:900,color:GG}}>G</span></div>
<div style={{fontSize:20,fontWeight:900,color:GD,letterSpacing:1}}>GEINSER</div>
<div style={{fontSize:10,fontWeight:700,color:GG,letterSpacing:4,marginTop:2}}>PROHORIZONTAL</div>
</div>
{done?(
<div style={{textAlign:'center'}}>
<div style={{fontSize:48,marginBottom:12}}>✅</div>
<div style={{fontSize:18,fontWeight:800,color:'#065f46',marginBottom:8}}>¡Contraseña actualizada!</div>
<p style={{fontSize:13,color:'#6b7280'}}>Redirigiendo al inicio...</p>
</div>
):(
<>
<div style={{textAlign:'center',marginBottom:24}}>
<div style={{fontSize:16,fontWeight:800,color:GD}}>Crear nueva contraseña</div>
<p style={{fontSize:13,color:'#6b7280',marginTop:6,lineHeight:1.5}}>Elige una contraseña segura de al menos 6 caracteres.</p>
</div>
<form onSubmit={handleReset}>
<div style={{marginBottom:14}}>
<label style={{display:'block',fontSize:13,fontWeight:700,color:'#374151',marginBottom:6}}>Nueva contraseña</label>
<input style={inp} type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="Mínimo 6 caracteres" required/>
</div>
<div style={{marginBottom:20}}>
<label style={{display:'block',fontSize:13,fontWeight:700,color:'#374151',marginBottom:6}}>Confirmar contraseña</label>
<input style={inp} type="password" value={confirm} onChange={e=>setConfirm(e.target.value)} placeholder="Repite la contraseña" required/>
</div>
{error&&<div style={{background:'#fef2f2',border:'1px solid #fca5a5',borderRadius:10,padding:'10px 14px',color:'#dc2626',fontSize:13,marginBottom:14}}>{error}</div>}
<button type="submit" disabled={loading} style={{width:'100%',background:loading?'#9ca3af':GD,color:'#fff',border:'none',borderRadius:12,padding:'13px',fontWeight:800,fontSize:15,cursor:loading?'not-allowed':'pointer'}}>
{loading?'Guardando...':'Guardar nueva contraseña'}
</button>
</form>
</>
)}
</div>
</div>
)
}
