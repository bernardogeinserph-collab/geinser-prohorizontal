export default function App() {
  return (
    <div style={{
      display:'flex', alignItems:'center', justifyContent:'center',
      minHeight:'100vh', background:'#0d2d4a', flexDirection:'column'
    }}>
      <div style={{textAlign:'center'}}>
        <svg width="64" height="64" viewBox="0 0 64 64" style={{margin:'0 auto 24px',display:'block'}}>
          <rect width="64" height="64" rx="14" fill="#1e6fae"/>
          <text x="32" y="44" textAnchor="middle" fill="#c9a227" fontSize="28" fontWeight="900" fontFamily="Arial">G</text>
        </svg>
        <div style={{fontSize:42,fontWeight:900,color:'#1e6fae',marginBottom:4,letterSpacing:-1}}>GEINSER</div>
        <div style={{fontSize:13,color:'#c9a227',fontWeight:700,letterSpacing:5,marginBottom:32}}>PROHORIZONTAL</div>
        <div style={{width:48,height:2,background:'#c9a227',margin:'0 auto 28px'}}/>
        <div style={{fontSize:13,color:'rgba(255,255,255,0.55)',marginBottom:8}}>Plataforma de Gestión Integral</div>
        <div style={{fontSize:11,color:'rgba(255,255,255,0.3)'}}>Administración de Propiedad Horizontal</div>
      </div>
    </div>
  )
}
