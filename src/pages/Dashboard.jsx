import{useState}from'react'
import{useAuth}from'../context/AuthContext'
import{useTable}from'../hooks/useSupabase'
import{supabase}from'../lib/supabase'
import{Building2,Users,Briefcase,Shield,CheckSquare,Wrench,TrendingUp,LogOut,Plus,Edit2,Trash2,X,CheckCircle,AlertTriangle,ArrowLeft,UserPlus}from'lucide-react'
const GB='#1e6fae',GD='#0d2d4a',GG='#c9a227'
const fmt=d=>d?new Date(d+'T00:00:00').toLocaleDateString('es-CO',{day:'2-digit',month:'short',year:'numeric'}):'sin fecha'
const fmtM=v=>{const n=Number(v)||0;if(n>=1000000)return'$'+(n/1000000).toFixed(1)+'M';if(n>=1000)return'$'+Math.round(n/1000)+'K';return'$'+n.toLocaleString('es-CO')}
const daysTo=d=>d?Math.ceil((new Date(d)-new Date())/864e5):null
const inp={width:'100%',padding:'9px 12px',border:'1.5px solid #e5e7eb',borderRadius:10,fontSize:13,outline:'none',boxSizing:'border-box'}
function F({label,children,req}){return(<div style={{marginBottom:12}}><label style={{display:'block',fontSize:12,fontWeight:700,color:'#374151',marginBottom:5}}>{label}{req&&<span style={{color:'#dc2626'}}> *</span>}</label>{children}</div>)}
function Toast({msg,type}){return(<div style={{position:'fixed',bottom:24,right:24,background:type==='success'?'#065f46':'#991b1b',color:'#fff',borderRadius:12,padding:'12px 20px',fontWeight:700,fontSize:14,zIndex:9999,display:'flex',alignItems:'center',gap:8}}>{type==='success'?<CheckCircle size={16}/>:<AlertTriangle size={16}/>}{msg}</div>)}
function Modal({title,onClose,children,wide}){return(
<div style={{position:'fixed',inset:0,background:'rgba(0,0,0,0.5)',zIndex:1000,display:'flex',alignItems:'center',justifyContent:'center',padding:16}}>
<div style={{background:'#fff',borderRadius:20,padding:24,width:'100%',maxWidth:wide?680:460,maxHeight:'90vh',overflowY:'auto'}}>
<div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:20}}>
<h2 style={{margin:0,fontSize:18,fontWeight:800,color:GD}}>{title}</h2>
<button onClick={onClose} style={{background:'#f3f4f6',border:'none',borderRadius:'50%',width:32,height:32,cursor:'pointer'}}><X size={16}/></button>
</div>
{children}
</div>
</div>
)}
function DelegadosPanel(){
const{data:perfiles,loading,refetch}=useTable('perfiles')
const{data:cops}=useTable('copropiedades')
const delegados=perfiles.filter(p=>p.rol==='delegado')
const[show,setShow]=useState(false)
const[form,setForm]=useState({nombre:'',email:'',password:'',telefono:'',copropiedad_id:''})
const[saving,setSaving]=useState(false)
const[toast,setToast]=useState(null)
const showT=(m,t='success')=>{setToast({msg:m,type:t});setTimeout(()=>setToast(null),4000)}
const Fv=(k,v)=>setForm(p=>({...p,[k]:v}))
async function crearDelegado(){
if(!form.nombre||!form.email||!form.password){showT('Nombre, correo y contrasena son requeridos','error');return}
setSaving(true)
try{
const{data,error}=await supabase.rpc('crear_delegado',{
p_email:form.email, p_password:form.password,
p_nombre:form.nombre, p_telefono:form.telefono||''
})
if(error)throw error
if(form.copropiedad_id){
await supabase.from('copropiedades').update({delegado_id:data.id}).eq('id',form.copropiedad_id)
}
showT('Delegado creado exitosamente')
setShow(false)
setForm({nombre:'',email:'',password:'',telefono:'',copropiedad_id:''})
refetch()
}catch(e){showT('Error: '+e.message,'error')}
setSaving(false)
}
async function toggleActivo(d){
await supabase.from('perfiles').update({activo:!d.activo}).eq('id',d.id)
refetch()
}
if(loading)return<div style={{padding:40,textAlign:'center',color:'#9ca3af'}}>Cargando...</div>
return(
<div>
<div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:20}}>
<h2 style={{margin:0,fontSize:20,fontWeight:900,color:GD}}>Delegados ({delegados.length})</h2>
<button onClick={()=>setShow(true)} style={{background:GB,color:'#fff',border:'none',borderRadius:12,padding:'9px 18px',fontWeight:800,cursor:'pointer',display:'flex',alignItems:'center',gap:6}}><UserPlus size={14}/>Nuevo delegado</button>
</div>
<div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(260px,1fr))',gap:14}}>
{delegados.length===0&&<div style={{gridColumn:'1/-1',textAlign:'center',padding:48,color:'#9ca3af'}}><Users size={40} color="#e5e7eb" style={{margin:'0 auto 12px',display:'block'}}/><p>Sin delegados registrados</p></div>}
{delegados.map(d=>{
const copsDel=cops.filter(c=>c.delegado_id===d.id)
return(<div key={d.id} style={{background:'#fff',border:'1.5px solid #e5e7eb',borderRadius:16,padding:18}}>
<div style={{display:'flex',alignItems:'center',gap:12,marginBottom:12}}>
<div style={{width:44,height:44,background:'#e8f4fd',borderRadius:'50%',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}>
<span style={{fontSize:18,fontWeight:900,color:GB}}>{d.nombre?d.nombre[0].toUpperCase():'?'}</span>
</div>
<div style={{flex:1,minWidth:0}}>
<div style={{fontWeight:900,fontSize:15,color:GD,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{d.nombre}</div>
<div style={{fontSize:12,color:'#6b7280',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{d.email}</div>
</div>
</div>
{d.telefono&&<div style={{fontSize:12,color:'#6b7280',marginBottom:6}}>📞 {d.telefono}</div>}
<div style={{marginBottom:10}}>
<div style={{fontSize:11,color:'#9ca3af',marginBottom:4}}>EDIFICIOS ASIGNADOS ({copsDel.length})</div>
{copsDel.length===0?<div style={{fontSize:12,color:'#d1d5db'}}>Sin edificios asignados</div>
:copsDel.map(c=><div key={c.id} style={{fontSize:12,background:'#f0f7ff',color:GB,borderRadius:6,padding:'3px 8px',marginBottom:3,display:'inline-block',marginRight:4}}>{c.nombre}</div>)}
</div>
<div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
<span style={{background:d.activo?'#e6f9f0':'#fef2f2',color:d.activo?'#0d7a4a':'#b91c1c',fontSize:11,borderRadius:20,padding:'3px 10px',fontWeight:700}}>{d.activo?'Activo':'Inactivo'}</span>
<button onClick={()=>toggleActivo(d)} style={{background:'#f3f4f6',border:'none',borderRadius:8,padding:'5px 10px',cursor:'pointer',fontSize:11,fontWeight:700,color:'#374151'}}>{d.activo?'Desactivar':'Activar'}</button>
</div>
</div>)
})}
</div>
{show&&<Modal title="Nuevo Delegado" onClose={()=>setShow(false)}>
<F label="Nombre completo" req><input style={inp} value={form.nombre} onChange={e=>Fv('nombre',e.target.value)} placeholder="Ej: Juan Perez"/></F>
<F label="Correo electronico" req><input style={inp} type="email" value={form.email} onChange={e=>Fv('email',e.target.value)} placeholder="correo@ejemplo.com"/></F>
<F label="Contrasena inicial" req><input style={inp} type="password" value={form.password} onChange={e=>Fv('password',e.target.value)} placeholder="Min 6 caracteres"/></F>
<F label="Telefono"><input style={inp} value={form.telefono} onChange={e=>Fv('telefono',e.target.value)} placeholder="Opcional"/></F>
<F label="Asignar edificio"><select style={inp} value={form.copropiedad_id} onChange={e=>Fv('copropiedad_id',e.target.value)}><option value="">Sin asignar por ahora</option>{cops.map(c=><option key={c.id} value={c.id}>{c.nombre}</option>)}</select></F>
<div style={{background:'#fffbeb',border:'1px solid #fde68a',borderRadius:8,padding:'10px 12px',fontSize:12,color:'#92400e',marginBottom:16}}>El delegado podra ingresar con este correo y contrasena. Se le recomienda cambiarla en su primer acceso.</div>
<div style={{display:'flex',gap:10}}>
<button onClick={()=>setShow(false)} style={{flex:1,background:'#f3f4f6',border:'none',borderRadius:10,padding:11,cursor:'pointer',fontWeight:700}}>Cancelar</button>
<button onClick={crearDelegado} disabled={saving} style={{flex:2,background:saving?'#9ca3af':GB,color:'#fff',border:'none',borderRadius:10,padding:11,cursor:saving?'not-allowed':'pointer',fontWeight:800}}>{saving?'Creando...':'Crear delegado'}</button>
</div>
</Modal>}
{toast&&<Toast {...toast}/>}
</div>
)
}
function Copropiedades({perfil,onSelect}){
const{data:cops,loading,insert,update,remove}=useTable('copropiedades')
const{data:perfiles}=useTable('perfiles')
const delegados=perfiles.filter(p=>p.rol==='delegado')
const[show,setShow]=useState(false)
const[edit,setEdit]=useState(null)
const FD={nombre:'',direccion:'',ciudad:'Bogota',tipo:'Residencial',unidades:'',honorarios:'',fecha_inicio:'',fecha_vencimiento:'',delegado_id:'',notas:''}
const[form,setForm]=useState(FD)
const Fv=(k,v)=>setForm(p=>({...p,[k]:v}))
const[toast,setToast]=useState(null)
const showT=(m,t='success')=>{setToast({msg:m,type:t});setTimeout(()=>setToast(null),3000)}
async function save(){
if(!form.nombre){showT('Nombre requerido','error');return}
const p={...form,unidades:Number(form.unidades)||0,honorarios:Number(form.honorarios)||0,delegado_id:form.delegado_id||null}
if(edit){await update(edit.id,p);showT('Actualizada')}else{await insert(p);showT('Creada')}
setShow(false);setEdit(null);setForm(FD)
}
const myCops=perfil.rol==='delegado'?cops.filter(c=>c.delegado_id===perfil.id):cops
if(loading)return<div style={{padding:40,textAlign:'center',color:'#9ca3af'}}>Cargando...</div>
return(
<div>
<div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:20}}>
<h2 style={{margin:0,fontSize:20,fontWeight:900,color:GD}}>Copropiedades</h2>
{perfil.rol==='director'&&<button onClick={()=>{setForm(FD);setEdit(null);setShow(true)}} style={{background:GB,color:'#fff',border:'none',borderRadius:12,padding:'9px 18px',fontWeight:800,cursor:'pointer',display:'flex',alignItems:'center',gap:6}}><Plus size={14}/>Nueva</button>}
</div>
<div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(280px,1fr))',gap:16}}>
{myCops.length===0&&<div style={{gridColumn:'1/-1',textAlign:'center',padding:48,color:'#9ca3af'}}><Building2 size={40} color="#e5e7eb" style={{margin:'0 auto 12px',display:'block'}}/><p>{perfil.rol==='delegado'?'No tienes edificios asignados':'Sin copropiedades'}</p></div>}
{myCops.map(c=>{
const del=perfiles.find(p=>p.id===c.delegado_id)
const d=daysTo(c.fecha_vencimiento)
return(<div key={c.id} style={{background:'#fff',border:'1.5px solid #e5e7eb',borderRadius:16,padding:18,cursor:'pointer'}} onClick={()=>onSelect(c)}>
<div style={{display:'flex',justifyContent:'space-between',marginBottom:10}}>
<div style={{background:'#e8f4fd',borderRadius:9,padding:7}}><Building2 size={18} color={GB}/></div>
<div style={{display:'flex',gap:4}}>
{d!==null&&d>=0&&d<=60&&<span style={{fontSize:10,background:'#fef2f2',color:'#b91c1c',border:'1px solid #fca5a5',borderRadius:20,padding:'2px 8px',fontWeight:700}}>{d}d</span>}
{perfil.rol==='director'&&<>
<button onClick={e=>{e.stopPropagation();setForm({...c,unidades:String(c.unidades),honorarios:String(c.honorarios),delegado_id:c.delegado_id||''});setEdit(c);setShow(true)}} style={{background:'#f3f4f6',border:'none',borderRadius:7,padding:'4px 7px',cursor:'pointer'}}><Edit2 size={12}/></button>
<button onClick={e=>{e.stopPropagation();if(window.confirm('Eliminar?'))remove(c.id)}} style={{background:'#fef2f2',border:'none',borderRadius:7,padding:'4px 7px',cursor:'pointer',color:'#dc2626'}}><Trash2 size={12}/></button>
</>}
</div>
</div>
<div style={{fontWeight:900,fontSize:15,color:GD,marginBottom:2}}>{c.nombre}</div>
<div style={{fontSize:12,color:'#6b7280',marginBottom:8}}>{c.direccion||'Sin direccion'}</div>
<div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:5}}>
{[{l:'Tipo',v:c.tipo},{l:'Unidades',v:c.unidades},{l:'Honorarios',v:fmtM(c.honorarios)},{l:'Delegado',v:del?.nombre||'Sin asignar'}].map(({l,v})=>(
<div key={l} style={{background:'#f9fafb',borderRadius:6,padding:'5px 8px'}}><div style={{fontSize:9,color:'#9ca3af'}}>{l}</div><div style={{fontSize:11,fontWeight:700,color:'#374151',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{v}</div></div>
))}
</div>
</div>)
})}
</div>
{show&&<Modal title={edit?'Editar':'Nueva copropiedad'} onClose={()=>{setShow(false);setEdit(null)}} wide>
<div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12}}>
<div style={{gridColumn:'1/-1'}}><F label="Nombre" req><input style={inp} value={form.nombre} onChange={e=>Fv('nombre',e.target.value)}/></F></div>
<F label="Direccion"><input style={inp} value={form.direccion} onChange={e=>Fv('direccion',e.target.value)}/></F>
<F label="Ciudad"><input style={inp} value={form.ciudad} onChange={e=>Fv('ciudad',e.target.value)}/></F>
<F label="Tipo"><select style={inp} value={form.tipo} onChange={e=>Fv('tipo',e.target.value)}><option>Residencial</option><option>Comercial</option><option>Mixto</option><option>Oficinas</option></select></F>
<F label="Unidades"><input style={inp} type="number" value={form.unidades} onChange={e=>Fv('unidades',e.target.value)}/></F>
<F label="Honorarios ($)"><input style={inp} type="number" value={form.honorarios} onChange={e=>Fv('honorarios',e.target.value)}/></F>
<F label="Delegado"><select style={inp} value={form.delegado_id} onChange={e=>Fv('delegado_id',e.target.value)}><option value="">Sin asignar</option>{delegados.map(d=><option key={d.id} value={d.id}>{d.nombre}</option>)}</select></F>
<F label="Inicio"><input style={inp} type="date" value={form.fecha_inicio} onChange={e=>Fv('fecha_inicio',e.target.value)}/></F>
<F label="Vencimiento"><input style={inp} type="date" value={form.fecha_vencimiento} onChange={e=>Fv('fecha_vencimiento',e.target.value)}/></F>
<div style={{gridColumn:'1/-1'}}><F label="Notas"><textarea style={{...inp,resize:'vertical',minHeight:55}} value={form.notas} onChange={e=>Fv('notas',e.target.value)}/></F></div>
</div>
<div style={{display:'flex',gap:10,marginTop:8}}>
<button onClick={()=>{setShow(false);setEdit(null)}} style={{flex:1,background:'#f3f4f6',border:'none',borderRadius:10,padding:11,cursor:'pointer',fontWeight:700}}>Cancelar</button>
<button onClick={save} style={{flex:2,background:GB,color:'#fff',border:'none',borderRadius:10,padding:11,cursor:'pointer',fontWeight:800}}>{edit?'Guardar':'Crear'}</button>
</div>
</Modal>}
{toast&&<Toast {...toast}/>}
</div>
)
}
function ModuloBase({tabla,copropiedad,titulo,color,campos,FD,renderCard}){
const{data,loading,insert,update,remove}=useTable(tabla,{copropiedad_id:copropiedad.id})
const[show,setShow]=useState(false)
const[edit,setEdit]=useState(null)
const[form,setForm]=useState(FD)
const Fv=(k,v)=>setForm(p=>({...p,[k]:v}))
const[toast,setToast]=useState(null)
const showT=(m,t='success')=>{setToast({msg:m,type:t});setTimeout(()=>setToast(null),3000)}
async function save(){
const payload={...form,copropiedad_id:copropiedad.id}
Object.keys(payload).forEach(k=>{if(payload[k]!==''&&payload[k]!==null&&!isNaN(payload[k])&&typeof payload[k]==='string'&&['valor','monto_deuda','monto_recuperado','costo','progreso','unidades','honorarios'].includes(k))payload[k]=Number(payload[k])})
if(edit){await update(edit.id,payload);showT('Actualizado')}else{await insert(payload);showT('Registrado')}
setShow(false);setEdit(null);setForm(FD)
}
if(loading)return<div style={{padding:40,textAlign:'center',color:'#9ca3af'}}>Cargando...</div>
return(
<div>
<div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:20}}>
<h2 style={{margin:0,fontSize:20,fontWeight:900,color:GD}}>{titulo} — {copropiedad.nombre}</h2>
<button onClick={()=>{setForm(FD);setEdit(null);setShow(true)}} style={{background:color,color:'#fff',border:'none',borderRadius:12,padding:'9px 18px',fontWeight:800,cursor:'pointer',display:'flex',alignItems:'center',gap:6}}><Plus size={14}/>Nuevo</button>
</div>
<div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(280px,1fr))',gap:14}}>
{data.length===0&&<div style={{gridColumn:'1/-1',textAlign:'center',padding:40,color:'#9ca3af'}}><p>Sin registros</p></div>}
{data.map(item=>renderCard(item,()=>{setForm(Object.fromEntries(Object.keys(FD).map(k=>[k,item[k]??FD[k]])));setEdit(item);setShow(true)},()=>{if(window.confirm('Eliminar?'))remove(item.id)}))}
</div>
{show&&<Modal title={edit?'Editar':'Nuevo registro'} onClose={()=>{setShow(false);setEdit(null)}} wide>
<div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12}}>
{campos.map(({key,label,type,options,full})=>(
<div key={key} style={full?{gridColumn:'1/-1'}:{}}>
<F label={label}>
{type==='select'?<select style={inp} value={form[key]||''} onChange={e=>Fv(key,e.target.value)}>{options.map(o=><option key={o}>{o}</option>)}</select>
:type==='textarea'?<textarea style={{...inp,resize:'vertical',minHeight:55}} value={form[key]||''} onChange={e=>Fv(key,e.target.value)}/>
:<input style={inp} type={type||'text'} value={form[key]||''} onChange={e=>Fv(key,e.target.value)}/>}
</F>
</div>
))}
</div>
<div style={{display:'flex',gap:10,marginTop:8}}>
<button onClick={()=>{setShow(false);setEdit(null)}} style={{flex:1,background:'#f3f4f6',border:'none',borderRadius:10,padding:11,cursor:'pointer',fontWeight:700}}>Cancelar</button>
<button onClick={save} style={{flex:2,background:color,color:'#fff',border:'none',borderRadius:10,padding:11,cursor:'pointer',fontWeight:800}}>{edit?'Guardar':'Registrar'}</button>
</div>
</Modal>}
{toast&&<Toast {...toast}/>}
</div>
)
}
function Contratos({copropiedad}){
return<ModuloBase tabla="contratos" copropiedad={copropiedad} titulo="Contratos" color="#7c3aed"
FD={{proveedor:'',servicio:'',valor:'',fecha_inicio:'',fecha_vencimiento:'',contacto:'',telefono:'',estado:'Activo',notas:''}}
campos={[{key:'proveedor',label:'Proveedor'},{key:'servicio',label:'Servicio'},{key:'valor',label:'Valor ($)',type:'number'},{key:'estado',label:'Estado',type:'select',options:['Activo','Vencido','Cancelado','En renovacion']},{key:'fecha_inicio',label:'Inicio',type:'date'},{key:'fecha_vencimiento',label:'Vencimiento',type:'date'},{key:'contacto',label:'Contacto'},{key:'telefono',label:'Telefono'},{key:'notas',label:'Notas',type:'textarea',full:true}]}
renderCard={(c,onEdit,onDel)=>{const d=daysTo(c.fecha_vencimiento);return(<div key={c.id} style={{background:'#fff',border:`1.5px solid ${d!==null&&d>=0&&d<=60?'#fca5a5':'#e5e7eb'}`,borderRadius:14,padding:16}}>
<div style={{display:'flex',justifyContent:'space-between',marginBottom:8}}><span style={{background:'#f5f3ff',color:'#7c3aed',fontSize:11,borderRadius:20,padding:'2px 9px',fontWeight:700}}>{c.estado}</span>{d!==null&&d>=0&&d<=60&&<span style={{background:'#fef2f2',color:'#b91c1c',fontSize:10,borderRadius:20,padding:'2px 7px',fontWeight:700,border:'1px solid #fca5a5'}}>{d}d</span>}</div>
<div style={{fontWeight:900,color:'#7c3aed'}}>{c.proveedor}</div><div style={{fontSize:12,color:GD,fontWeight:700,marginBottom:6}}>{c.servicio}</div>
<div style={{fontSize:11,color:'#6b7280',marginBottom:8}}>{fmtM(c.valor)}/mes · Vence {fmt(c.fecha_vencimiento)}</div>
<div style={{display:'flex',gap:6}}><button onClick={onEdit} style={{flex:1,background:'#f3f4f6',border:'none',borderRadius:7,padding:6,cursor:'pointer',fontSize:11,fontWeight:700}}>Editar</button><button onClick={onDel} style={{background:'#fef2f2',border:'none',borderRadius:7,padding:'6px 9px',cursor:'pointer',color:'#dc2626'}}><Trash2 size={12}/></button></div>
</div>)}}/>}
function Tareas({copropiedad}){
const colP={Alta:'#dc2626',Media:'#d97706',Baja:'#059669'}
return<ModuloBase tabla="tareas" copropiedad={copropiedad} titulo="Tareas" color={GB}
FD={{titulo:'',descripcion:'',prioridad:'Media',estado:'Pendiente',progreso:0,fecha_limite:'',responsable:''}}
campos={[{key:'titulo',label:'Titulo',full:true},{key:'descripcion',label:'Descripcion',type:'textarea',full:true},{key:'prioridad',label:'Prioridad',type:'select',options:['Alta','Media','Baja']},{key:'estado',label:'Estado',type:'select',options:['Pendiente','En progreso','Completada','Cancelada']},{key:'fecha_limite',label:'Fecha limite',type:'date'},{key:'responsable',label:'Responsable'},{key:'progreso',label:'Avance (%)',type:'number'}]}
renderCard={(t,onEdit,onDel)=>(<div key={t.id} style={{background:'#fff',border:'1.5px solid #e5e7eb',borderRadius:14,padding:16}}>
<div style={{display:'flex',justifyContent:'space-between',marginBottom:8}}><span style={{background:colP[t.prioridad]+'18',color:colP[t.prioridad],fontSize:10,borderRadius:20,padding:'2px 9px',fontWeight:700}}>{t.prioridad}</span><span style={{background:t.estado==='Completada'?'#e6f9f0':'#f3f4f6',color:t.estado==='Completada'?'#0d7a4a':'#374151',fontSize:10,borderRadius:20,padding:'2px 8px',fontWeight:700}}>{t.estado}</span></div>
<div style={{fontWeight:900,color:GD,marginBottom:4}}>{t.titulo}</div>
<div style={{marginBottom:8}}><div style={{display:'flex',justifyContent:'space-between',marginBottom:3}}><span style={{fontSize:11,color:'#6b7280'}}>Avance</span><span style={{fontSize:11,fontWeight:700,color:GB}}>{t.progreso||0}%</span></div><div style={{background:'#e5e7eb',borderRadius:99,height:6}}><div style={{background:GB,borderRadius:99,height:6,width:(t.progreso||0)+'%'}}/></div></div>
{t.fecha_limite&&<div style={{fontSize:11,color:'#6b7280',marginBottom:8}}>Limite: {fmt(t.fecha_limite)}</div>}
<div style={{display:'flex',gap:6}}><button onClick={onEdit} style={{flex:1,background:'#f3f4f6',border:'none',borderRadius:7,padding:6,cursor:'pointer',fontSize:11,fontWeight:700}}>Editar</button><button onClick={onDel} style={{background:'#fef2f2',border:'none',borderRadius:7,padding:'6px 9px',cursor:'pointer',color:'#dc2626'}}><Trash2 size={12}/></button></div>
</div>)}/>}
function Mantenimiento({copropiedad}){
return<ModuloBase tabla="mantenimientos" copropiedad={copropiedad} titulo="Mantenimiento" color="#059669"
FD={{area:'',proveedor:'',periodicidad:'Mensual',ultima_fecha:'',proxima_fecha:'',costo:'',estado:'Programado',notas:''}}
campos={[{key:'area',label:'Area / Sistema'},{key:'proveedor',label:'Proveedor'},{key:'periodicidad',label:'Periodicidad',type:'select',options:['Mensual','Bimestral','Trimestral','Semestral','Anual','Unico']},{key:'estado',label:'Estado',type:'select',options:['Programado','Ejecutado','Vencido','Cancelado']},{key:'ultima_fecha',label:'Ultima fecha',type:'date'},{key:'proxima_fecha',label:'Proxima fecha',type:'date'},{key:'costo',label:'Costo ($)',type:'number'},{key:'notas',label:'Notas',type:'textarea',full:true}]}
renderCard={(m,onEdit,onDel)=>{const d=daysTo(m.proxima_fecha);return(<div key={m.id} style={{background:'#fff',border:`1.5px solid ${d!==null&&d>=0&&d<=7?'#bbf7d0':'#e5e7eb'}`,borderRadius:14,padding:16}}>
<div style={{display:'flex',justifyContent:'space-between',marginBottom:8}}><span style={{background:'#dcfce7',color:'#166534',fontSize:10,borderRadius:20,padding:'2px 9px',fontWeight:700}}>{m.estado}</span>{d!==null&&d>=0&&d<=7&&<span style={{background:'#fef9c3',color:'#854d0e',fontSize:10,borderRadius:20,padding:'2px 7px',fontWeight:700}}>{d}d</span>}</div>
<div style={{fontWeight:900,color:GD}}>{m.area}</div><div style={{fontSize:12,color:'#6b7280',marginBottom:4}}>{m.proveedor||'Sin proveedor'} · {m.periodicidad}</div>
<div style={{fontSize:11,color:'#6b7280',marginBottom:8}}>Proxima: {fmt(m.proxima_fecha)} · {fmtM(m.costo)}</div>
<div style={{display:'flex',gap:6}}><button onClick={onEdit} style={{flex:1,background:'#f3f4f6',border:'none',borderRadius:7,padding:6,cursor:'pointer',fontSize:11,fontWeight:700}}>Editar</button><button onClick={onDel} style={{background:'#fef2f2',border:'none',borderRadius:7,padding:'6px 9px',cursor:'pointer',color:'#dc2626'}}><Trash2 size={12}/></button></div>
</div>)}}/>}
function Cartera({copropiedad}){
return<ModuloBase tabla="cartera" copropiedad={copropiedad} titulo="Cartera" color="#dc2626"
FD={{concepto:'',deudor:'',unidad:'',monto_deuda:'',monto_recuperado:'',fecha_mora:'',estado:'En mora',accion:'',notas:''}}
campos={[{key:'concepto',label:'Concepto'},{key:'deudor',label:'Deudor'},{key:'unidad',label:'Unidad / Apto'},{key:'estado',label:'Estado',type:'select',options:['En mora','En acuerdo','Recuperado','Juridico','Castigado']},{key:'monto_deuda',label:'Deuda ($)',type:'number'},{key:'monto_recuperado',label:'Recuperado ($)',type:'number'},{key:'fecha_mora',label:'Fecha mora',type:'date'},{key:'accion',label:'Accion tomada'},{key:'notas',label:'Notas',type:'textarea',full:true}]}
renderCard={(c,onEdit,onDel)=>(<div key={c.id} style={{background:'#fff',border:'1.5px solid #fecaca',borderRadius:14,padding:16}}>
<div style={{display:'flex',justifyContent:'space-between',marginBottom:8}}><span style={{background:'#fef2f2',color:'#b91c1c',fontSize:10,borderRadius:20,padding:'2px 9px',fontWeight:700}}>{c.estado}</span><span style={{fontSize:11,fontWeight:700,color:'#dc2626'}}>{fmtM(c.monto_deuda)}</span></div>
<div style={{fontWeight:900,color:GD}}>{c.concepto}</div><div style={{fontSize:12,color:'#6b7280',marginBottom:4}}>{c.deudor||'—'} {c.unidad?'· '+c.unidad:''}</div>
{c.monto_recuperado>0&&<div style={{fontSize:11,color:'#059669',marginBottom:4}}>Recuperado: {fmtM(c.monto_recuperado)}</div>}
<div style={{display:'flex',gap:6}}><button onClick={onEdit} style={{flex:1,background:'#f3f4f6',border:'none',borderRadius:7,padding:6,cursor:'pointer',fontSize:11,fontWeight:700}}>Editar</button><button onClick={onDel} style={{background:'#fef2f2',border:'none',borderRadius:7,padding:'6px 9px',cursor:'pointer',color:'#dc2626'}}><Trash2 size={12}/></button></div>
</div>)}/>}
function SGSST({copropiedad}){
return<ModuloBase tabla="sgsst" copropiedad={copropiedad} titulo="SG-SST" color="#0891b2"
FD={{actividad:'',fecha_programada:'',fecha_ejecutada:'',responsable:'',completada:false,evidencia:'',observaciones:''}}
campos={[{key:'actividad',label:'Actividad',full:true},{key:'responsable',label:'Responsable'},{key:'fecha_programada',label:'Fecha programada',type:'date'},{key:'fecha_ejecutada',label:'Fecha ejecutada',type:'date'},{key:'evidencia',label:'Evidencia / Soporte'},{key:'observaciones',label:'Observaciones',type:'textarea',full:true}]}
renderCard={(a,onEdit,onDel)=>(<div key={a.id} style={{background:'#fff',border:'1.5px solid #e0f2fe',borderRadius:14,padding:16}}>
<div style={{display:'flex',justifyContent:'space-between',marginBottom:8}}><span style={{background:a.completada?'#e6f9f0':'#f0f9ff',color:a.completada?'#0d7a4a':'#0369a1',fontSize:10,borderRadius:20,padding:'2px 9px',fontWeight:700}}>{a.completada?'Ejecutada':'Pendiente'}</span></div>
<div style={{fontWeight:900,color:GD,marginBottom:4}}>{a.actividad}</div>
<div style={{fontSize:11,color:'#6b7280',marginBottom:4}}>Programada: {fmt(a.fecha_programada)}</div>
{a.responsable&&<div style={{fontSize:11,color:'#6b7280',marginBottom:6}}>Responsable: {a.responsable}</div>}
<div style={{display:'flex',gap:6}}><button onClick={onEdit} style={{flex:1,background:'#f3f4f6',border:'none',borderRadius:7,padding:6,cursor:'pointer',fontSize:11,fontWeight:700}}>Editar</button><button onClick={onDel} style={{background:'#fef2f2',border:'none',borderRadius:7,padding:'6px 9px',cursor:'pointer',color:'#dc2626'}}><Trash2 size={12}/></button></div>
</div>)}/>}
export default function Dashboard(){
const{perfil,signOut}=useAuth()
const[tab,setTab]=useState('copropiedades')
const[selectedCop,setSelectedCop]=useState(null)
const[subTab,setSubTab]=useState('contratos')
if(!perfil)return<div style={{display:'flex',alignItems:'center',justifyContent:'center',minHeight:'100vh',background:GD}}><div style={{color:'rgba(255,255,255,0.6)'}}>Cargando...</div></div>
const subItems=[{key:'contratos',label:'Contratos',icon:Briefcase},{key:'tareas',label:'Tareas',icon:CheckSquare},{key:'mantenimiento',label:'Mantenimiento',icon:Wrench},{key:'cartera',label:'Cartera',icon:TrendingUp},{key:'sgsst',label:'SG-SST',icon:Shield}]
return(
<div style={{display:'flex',minHeight:'100vh',fontFamily:"'Segoe UI',system-ui,sans-serif",background:'#f1f5f9'}}>
<div style={{width:230,background:GD,height:'100vh',position:'fixed',left:0,top:0,zIndex:200,display:'flex',flexDirection:'column'}}>
<div style={{padding:'18px 20px 14px',borderBottom:'1px solid rgba(255,255,255,0.1)'}}>
<svg width="120" height="30" viewBox="0 0 190 50"><rect width="44" height="44" rx="10" fill={GB} y="3"/><text x="22" y="33" textAnchor="middle" fill={GG} fontSize="24" fontWeight="900" fontFamily="Arial">G</text><text x="55" y="24" fill="white" fontSize="16" fontWeight="900" fontFamily="Arial" letterSpacing="1">GEINSER</text><text x="55" y="40" fill={GG} fontSize="9" fontWeight="700" fontFamily="Arial" letterSpacing="3">PROHORIZONTAL</text></svg>
</div>
<div style={{padding:'10px 14px',borderBottom:'1px solid rgba(255,255,255,0.08)'}}>
<div style={{fontSize:9,color:'rgba(255,255,255,0.45)',fontWeight:700,marginBottom:2}}>{perfil.rol==='director'?'DIRECTOR':'DELEGADO'}</div>
<div style={{fontSize:13,fontWeight:700,color:'#fff'}}>{perfil.nombre}</div>
</div>
{selectedCop&&<div style={{padding:'8px 14px',borderBottom:'1px solid rgba(255,255,255,0.08)',background:'rgba(30,111,174,0.25)'}}>
<div style={{fontSize:9,color:'rgba(255,255,255,0.45)',marginBottom:2}}>COPROPIEDAD</div>
<div style={{fontSize:12,fontWeight:700,color:'#fff'}}>{selectedCop.nombre}</div>
<button onClick={()=>{setSelectedCop(null);setTab('copropiedades')}} style={{background:'none',border:'none',color:'rgba(255,255,255,0.45)',fontSize:10,cursor:'pointer',padding:0,marginTop:3,display:'flex',alignItems:'center',gap:3}}><ArrowLeft size={10}/>Volver</button>
</div>}
<nav style={{flex:1,padding:'6px 0',overflowY:'auto'}}>
{!selectedCop&&[{key:'copropiedades',label:'Copropiedades',icon:Building2},...(perfil.rol==='director'?[{key:'delegados',label:'Delegados',icon:Users}]:[])].map(({key,label,icon:Icon})=>(
<button key={key} onClick={()=>setTab(key)} style={{width:'100%',display:'flex',alignItems:'center',gap:10,padding:'10px 20px',border:'none',background:tab===key?'rgba(30,111,174,0.4)':'transparent',color:tab===key?'#fff':'rgba(255,255,255,0.55)',cursor:'pointer',fontSize:13,fontWeight:tab===key?700:500,textAlign:'left'}}><Icon size={15}/>{label}</button>
))}
{selectedCop&&subItems.map(({key,label,icon:Icon})=>(
<button key={key} onClick={()=>setSubTab(key)} style={{width:'100%',display:'flex',alignItems:'center',gap:10,padding:'10px 20px 10px 24px',border:'none',background:subTab===key?'rgba(30,111,174,0.4)':'transparent',color:subTab===key?'#fff':'rgba(255,255,255,0.55)',cursor:'pointer',fontSize:12,fontWeight:subTab===key?700:500,textAlign:'left'}}><Icon size={14}/>{label}</button>
))}
</nav>
<button onClick={signOut} style={{margin:12,background:'rgba(255,255,255,0.08)',border:'none',borderRadius:10,padding:'9px 14px',color:'rgba(255,255,255,0.6)',cursor:'pointer',display:'flex',alignItems:'center',gap:8,fontSize:12}}><LogOut size={13}/>Cerrar sesion</button>
</div>
<div style={{marginLeft:230,flex:1,display:'flex',flexDirection:'column'}}>
<div style={{background:'#fff',borderBottom:'1px solid #e5e7eb',padding:'0 24px',height:52,display:'flex',alignItems:'center',justifyContent:'space-between',position:'sticky',top:0,zIndex:100}}>
<h1 style={{margin:0,fontSize:16,fontWeight:800,color:GD}}>{selectedCop?selectedCop.nombre+' — '+subTab.charAt(0).toUpperCase()+subTab.slice(1):tab.charAt(0).toUpperCase()+tab.slice(1)}</h1>
<div style={{fontSize:11,color:'#9ca3af'}}>{new Date().toLocaleDateString('es-CO',{day:'2-digit',month:'short',year:'numeric'})}</div>
</div>
<div style={{flex:1,padding:24,overflowY:'auto'}}>
{!selectedCop&&tab==='copropiedades'&&<Copropiedades perfil={perfil} onSelect={c=>{setSelectedCop(c);setSubTab('contratos')}}/>}
{!selectedCop&&tab==='delegados'&&perfil.rol==='director'&&<DelegadosPanel/>}
{selectedCop&&subTab==='contratos'&&<Contratos copropiedad={selectedCop}/>}
{selectedCop&&subTab==='tareas'&&<Tareas copropiedad={selectedCop}/>}
{selectedCop&&subTab==='mantenimiento'&&<Mantenimiento copropiedad={selectedCop}/>}
{selectedCop&&subTab==='cartera'&&<Cartera copropiedad={selectedCop}/>}
{selectedCop&&subTab==='sgsst'&&<SGSST copropiedad={selectedCop}/>}
</div>
</div>
</div>
)
  }
