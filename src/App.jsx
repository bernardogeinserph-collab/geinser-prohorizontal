import{useState,useEffect}from'react'
import{supabase}from'./lib/supabase.js'
export default function App(){
  const[status,setStatus]=useState('Iniciando...')
  useEffect(()=>{
    supabase.from('copropiedades').select('count',{count:'exact',head:true})
      .then(({error})=>setStatus(error?'Lista para configurar':'Conectado'))
      .catch(()=>setStatus('Configurar .env'))
  },[])
  return(<div style={{display:'flex',alignItems:'center',justifyContent:'center',minHeight:'100vh',background:'#0d2d4a',flexDirection:'column'}}><div style={{textAlign:'center'}}><div style={{fontSize:48,fontWeight:900,color:'#1e6fae',marginBottom:4,letterSpacing:-2}}>GEINSER</div><div style={{fontSize:14,color:'#c9a227',fontWeight:700,letterSpacing:4,marginBottom:32}}>PROHORIZONTAL</div><div style={{width:48,height:2,background:'#c9a227',margin:'0 auto 24px'}}/><div style={{fontSize:13,color:'rgba(255,255,255,0.5)',marginBottom:6}}>{status}</div><div style={{fontSize:11,color:'rgba(255,255,255,0.3)'}}>Plataforma de Gestion Integral</div></div></div>)
}
