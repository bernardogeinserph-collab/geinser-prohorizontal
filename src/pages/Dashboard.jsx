import{useState,useEffect}from'react'
import{useAuth}from'../context/AuthContext'
import{useTable}from'../hooks/useSupabase'
import{supabase}from'../lib/supabase'
import{Building2,Users,Briefcase,Shield,CheckSquare,Wrench,TrendingUp,LogOut,Plus,Edit2,Trash2,X,CheckCircle,AlertTriangle,ArrowLeft,UserPlus,Bell,Camera,Download,MessageSquare,Zap,HardDrive,Search,ChevronRight,Menu,UserCog}from'lucide-react'
const GB='#1e6fae',GD='#0d2d4a',GG='#c9a227'
const fmt=d=>d?new Date(d+'T00:00:00').toLocaleDateString('es-CO',{day:'2-digit',month:'short',year:'numeric'}):'—'
const fmtM=v=>{const n=Number(v)||0;if(n>=1000000)return'$'+(n/1000000).toFixed(1)+'M';if(n>=1000)return'$'+Math.round(n/1000)+'K';return'$'+n.toLocaleString('es-CO')}
const daysTo=d=>d?Math.ceil((new Date(d+'T00:00:00')-new Date())/864e5):null
const isMob=()=>window.innerWidth<768
const inp={width:'100%',padding:'9px 12px',border:'1.5px solid #e5e7eb',borderRadius:10,fontSize:13,outline:'none',boxSizing:'border-box'}
function F({label,children,req}){return(<div style={{marginBottom:12}}><label style={{display:'block',fontSize:12,fontWeight:700,color:'#374151',marginBottom:5}}>{label}{req&&<span style={{color:'#dc2626'}}> *</span>}</label>{children}</div>)}
function Toast({msg,type}){return(<div style={{position:'fixed',bottom:80,right:16,background:type==='success'?'#065f46':'#991b1b',color:'#fff',borderRadius:12,padding:'12px 20px',fontWeight:700,fontSize:14,zIndex:9999,display:'flex',alignItems:'center',gap:8,maxWidth:'90vw'}}>{type==='success'?<CheckCircle size={16}/>:<AlertTriangle size={16}/>}{msg}</div>)}
function Modal({title,onClose,children,wide}){return(<div style={{position:'fixed',inset:0,background:'rgba(0,0,0,0.5)',zIndex:2000,display:'flex',alignItems:'flex-end',justifyContent:'center',padding:'0'}} onClick={onClose}><div style={{background:'#fff',borderRadius:'20px 20px 0 0',padding:24,width:'100%',maxWidth:720,maxHeight:'90vh',overflowY:'auto'}} onClick={e=>e.stopPropagation()}><div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:20}}><h2 style={{margin:0,fontSize:18,fontWeight:800,color:GD}}>{title}</h2><button onClick={onClose} style={{background:'#f3f4f6',border:'none',borderRadius:'50%',width:32,height:32,cursor:'pointer'}}><X size={16}/></button></div>{children}</div></div>)}
function Bdg({t,color,bg}){return <span style={{background:bg||color+'18',color,fontSize:10,borderRadius:20,padding:'2px 9px',fontWeight:700,whiteSpace:'nowrap'}}>{t}</span>}

const MESES_INF=['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre']
async function cargarJsPDF(){
if(window.jspdf?.jsPDF&&window.jspdf.jsPDF.API?.autoTable)return window.jspdf
if(!window.jspdf)await new Promise((res,rej)=>{const s=document.createElement('script');s.src='https://unpkg.com/jspdf@2.5.1/dist/jspdf.umd.min.js';s.onload=res;s.onerror=rej;document.head.appendChild(s)})
await new Promise((res,rej)=>{const s=document.createElement('script');s.src='https://unpkg.com/jspdf-autotable@3.8.2/dist/jspdf.plugin.autotable.min.js';s.onload=res;s.onerror=rej;document.head.appendChild(s)})
return window.jspdf
}
async function imgData(url){
try{const r=await fetch(url);const b=await r.blob();return await new Promise(res=>{const fr=new FileReader();fr.onload=()=>res(fr.result);fr.onerror=()=>res(null);fr.readAsDataURL(b)})}catch(e){return null}
}
async function genInformePDF({copropiedades,getDelegado,tipoInf,mesInf,anioInf}){
const{jsPDF}=await cargarJsPDF()
const ini=tipoInf==='mes'?new Date(anioInf,mesInf,1):new Date(anioInf,0,1)
const fin=tipoInf==='mes'?new Date(anioInf,mesInf+1,0,23,59,59):new Date(anioInf,11,31,23,59,59)
const enP=f=>{if(!f)return false;const d=new Date(f.length<=10?f+'T00:00:00':f);return d>=ini&&d<=fin}
const perLabel=tipoInf==='mes'?MESES_INF[mesInf]+' de '+anioInf:'Año '+anioInf
const fmtM=v=>{const n=Number(v)||0;return '$'+n.toLocaleString('es-CO')}
const doc=new jsPDF()
const W=doc.internal.pageSize.getWidth()
const AZ=[13,45,74],AB=[30,111,174],DO=[201,162,39],VE=[5,150,105],RO=[220,38,38],AM=[217,119,6],GR=[107,114,128]
let pagina=0
function header(sub){
doc.setFillColor(...AZ);doc.rect(0,0,W,30,'F')
doc.setFillColor(...DO);doc.rect(0,30,W,1.5,'F')
doc.setTextColor(...DO);doc.setFontSize(19);doc.setFont(undefined,'bold');doc.text('GEINSER',14,12)
doc.setTextColor(255,255,255);doc.setFontSize(6.5);doc.setFont(undefined,'normal');doc.text('P R O H O R I Z O N T A L',14,17)
doc.setFontSize(11);doc.setFont(undefined,'bold');doc.text('INFORME DE GESTION',14,26)
doc.setFontSize(9);doc.setFont(undefined,'normal');doc.text(sub.substring(0,60),W-14,22,{align:'right'})
doc.setFontSize(8);doc.setTextColor(200);doc.text(perLabel,W-14,27,{align:'right'})
}
function kpi(x,y,w,valor,label,color){
doc.setFillColor(250,250,252);doc.setDrawColor(228,231,235);doc.roundedRect(x,y,w,17,2,2,'FD')
doc.setFillColor(...color);doc.rect(x,y,1.6,17,'F')
doc.setTextColor(...color);doc.setFontSize(13);doc.setFont(undefined,'bold');doc.text(String(valor),x+5,y+8)
doc.setTextColor(...GR);doc.setFontSize(5.6);doc.setFont(undefined,'normal');doc.text(label.toUpperCase(),x+5,y+13.5)
}
function barras(x,y,w,titulo,datos){
doc.setTextColor(...AZ);doc.setFontSize(9);doc.setFont(undefined,'bold');doc.text(titulo,x,y);y+=4
const max=Math.max(...datos.map(d=>d.v),1)
for(const d of datos){
doc.setTextColor(80);doc.setFontSize(6.5);doc.setFont(undefined,'normal');doc.text(d.l,x,y+3)
const bw=Math.max((d.v/max)*(w-52),1)
doc.setFillColor(235,238,242);doc.roundedRect(x+34,y,w-52,4,1,1,'F')
doc.setFillColor(...d.c);doc.roundedRect(x+34,y,bw,4,1,1,'F')
doc.setTextColor(...AZ);doc.setFont(undefined,'bold');doc.text(String(d.v),x+34+(w-52)+3,y+3.4)
y+=7}
return y+3
}
function seccion(y,titulo,color){
if(y>255){doc.addPage();header(tituloDoc);y=40}
doc.setFillColor(...color);doc.rect(14,y,2.2,7,'F')
doc.setTextColor(...AZ);doc.setFontSize(10.5);doc.setFont(undefined,'bold');doc.text(titulo,19,y+5.2)
return y+10
}
let tituloDoc=''
for(const cop of copropiedades){
tituloDoc=cop.nombre
if(pagina>0)doc.addPage()
pagina++
header(cop.nombre)
let y=40
// Consultar datos de todos los modulos
const[rT,rC,rP,rM,rK,rQ,rS,rO]=await Promise.all([
supabase.from('tareas').select('*').eq('copropiedad_id',cop.id),
supabase.from('contratos').select('*').eq('copropiedad_id',cop.id),
supabase.from('polizas').select('*').eq('copropiedad_id',cop.id),
supabase.from('mantenimientos').select('*').eq('copropiedad_id',cop.id),
supabase.from('cartera').select('*').eq('copropiedad_id',cop.id),
supabase.from('pqrs').select('*').eq('copropiedad_id',cop.id),
supabase.from('sgsst').select('*').eq('copropiedad_id',cop.id),
supabase.from('obras').select('*').eq('copropiedad_id',cop.id)])
const tareas=rT.data||[],contratos=rC.data||[],polizas=rP.data||[],mants=rM.data||[],cartera=rK.data||[],pqrs=rQ.data||[],sgsst=rS.data||[],obras=rO.data||[]
const tP=tareas.filter(t=>enP(t.created_at)||enP(t.fecha_limite)||(Array.isArray(t.historial)&&t.historial.some(h=>enP(h.fecha))))
const acts=tareas.reduce((a,t)=>{if(Array.isArray(t.historial))t.historial.forEach(h=>{if(enP(h.fecha))a.push(h)});return a},[])
const comp=tP.filter(t=>t.estado==='Completada')
const cumpl=tP.length?Math.round(comp.length/tP.length*100):0
const avProm=tP.length?Math.round(tP.reduce((s,t)=>s+(Number(t.progreso)||0),0)/tP.length):0
const pqrsP=pqrs.filter(p=>enP(p.created_at)||enP(p.fecha_recepcion))
const pqrsRes=pqrsP.filter(p=>['Resuelta','Cerrada'].includes(p.estado))
const mantsP=mants.filter(m=>enP(m.created_at)||enP(m.fecha_programada)||enP(m.fecha))
const sgsstP=sgsst.filter(s=>enP(s.created_at)||enP(s.fecha_programada)||enP(s.fecha_ejecutada))
const hoy2=new Date()
const contVig=contratos.filter(x=>{const f=x.fecha_vencimiento||x.fecha_fin;return !f||new Date(f)>=hoy2})
// Datos del edificio
doc.setTextColor(...GR);doc.setFontSize(8)
const deleg=(getDelegado&&getDelegado(cop))||'Sin asignar'
doc.text('Direccion: '+(cop.direccion||'-')+'    |    Unidades: '+(cop.unidades||'-')+'    |    Administrador delegado: '+deleg,14,y);y+=4
doc.text('Fecha de elaboracion: '+new Date().toLocaleDateString('es-CO',{day:'2-digit',month:'long',year:'numeric'}),14,y);y+=8
// KPIs fila 1 y 2
doc.setTextColor(...AZ);doc.setFontSize(11);doc.setFont(undefined,'bold');doc.text('1. Indicadores del periodo',14,y);y+=4
const kw=(W-28-9)/4
kpi(14,y,kw,tP.length,'Tareas gestionadas',AB);kpi(14+kw+3,y,kw,comp.length,'Completadas',VE)
kpi(14+(kw+3)*2,y,kw,cumpl+'%','Cumplimiento',cumpl>=70?VE:cumpl>=40?AM:RO)
kpi(14+(kw+3)*3,y,kw,avProm+'%','Avance promedio',AB);y+=20
kpi(14,y,kw,pqrsP.length,'PQRs recibidas',AM);kpi(14+kw+3,y,kw,pqrsRes.length,'PQRs resueltas',VE)
kpi(14+(kw+3)*2,y,kw,mantsP.length,'Mantenimientos',[8,145,178])
kpi(14+(kw+3)*3,y,kw,sgsstP.length,'Actividades SST',[124,58,237]);y+=24
// Graficos
doc.setTextColor(...AZ);doc.setFontSize(11);doc.setFont(undefined,'bold');doc.text('2. Analisis de gestion',14,y);y+=6
const porEstado=['Pendiente','En progreso','Completada','Cancelada'].map(e=>({l:e,v:tP.filter(t=>t.estado===e).length,c:e==='Completada'?VE:e==='En progreso'?AB:e==='Cancelada'?RO:GR}))
const porPrior=['Alta','Media','Baja'].map(p=>({l:'Prioridad '+p,v:tP.filter(t=>t.prioridad===p).length,c:p==='Alta'?RO:p==='Media'?AM:VE}))
const y1=barras(14,y,(W-34)/2,'Tareas por estado',porEstado)
const y2=barras(14+(W-28)/2+3,y,(W-34)/2,'Tareas por prioridad',porPrior)
y=Math.max(y1,y2)+2
const actBar=[{l:'Comentarios',v:acts.filter(a=>a.tipo==='comentario').length,c:AB},{l:'Fotos',v:acts.filter(a=>a.tipo==='foto').length,c:[124,58,237]},{l:'Avances',v:acts.filter(a=>a.tipo==='avance').length,c:AM},{l:'Completadas',v:acts.filter(a=>a.tipo==='completada').length,c:VE}]
y=barras(14,y,(W-34)/2,'Actividad registrada por el delegado',actBar)
// 3. Contratos
if(contratos.length){
y=seccion(y,'3. Contratos de servicios',[124,58,237])
doc.autoTable({startY:y,head:[['Proveedor','Servicio','Valor','Vencimiento','Estado']],
body:contratos.map(x=>{const f=x.fecha_vencimiento||x.fecha_fin;const d=f?Math.ceil((new Date(f+'T00:00:00')-hoy2)/864e5):null;return[x.proveedor||x.nombre_proveedor||'-',x.servicio||x.objeto||'-',x.valor?fmtM(x.valor):'-',f?new Date(f+'T00:00:00').toLocaleDateString('es-CO'):'-',d===null?'-':d<0?'VENCIDO':d<=90?'Vence en '+d+'d':'Vigente']}),
theme:'striped',headStyles:{fillColor:[124,58,237],fontSize:6.5},bodyStyles:{fontSize:6.5},margin:{left:14,right:14},
didParseCell:d=>{if(d.section==='body'&&d.column.index===4){const v=String(d.cell.raw);if(v==='VENCIDO')d.cell.styles.textColor=RO;else if(v.startsWith('Vence'))d.cell.styles.textColor=AM;else if(v==='Vigente')d.cell.styles.textColor=VE}}})
y=doc.lastAutoTable.finalY+6}
// 4. Polizas
if(polizas.length){
y=seccion(y,(contratos.length?'4':'3')+'. Polizas de zonas comunes',[8,145,178])
doc.autoTable({startY:y,head:[['Aseguradora','No. Poliza','Inicio vigencia','Fin vigencia','Valor asegurado','Prima']],
body:polizas.map(x=>{const d=x.fin_vigencia?Math.ceil((new Date(x.fin_vigencia+'T00:00:00')-hoy2)/864e5):null;return[x.aseguradora||'-',x.numero_poliza||'-',x.inicio_vigencia?new Date(x.inicio_vigencia+'T00:00:00').toLocaleDateString('es-CO'):'-',(x.fin_vigencia?new Date(x.fin_vigencia+'T00:00:00').toLocaleDateString('es-CO'):'-')+(d!==null&&d>=0&&d<=90?' ('+d+'d)':d!==null&&d<0?' VENCIDA':''),fmtM(x.valor_asegurado),fmtM(x.costo_prima)]}),
theme:'striped',headStyles:{fillColor:[8,145,178],fontSize:6.5},bodyStyles:{fontSize:6.5},margin:{left:14,right:14}})
y=doc.lastAutoTable.finalY+6}
// 5. Tareas detalle
if(tP.length){
y=seccion(y,'Gestion de tareas del periodo',AB)
doc.autoTable({startY:y,head:[['Tarea','Estado','Prioridad','Avance','Fecha limite','Responsable']],
body:tP.map(t=>[t.titulo||'-',t.estado||'-',t.prioridad||'-',(t.progreso||0)+'%',t.fecha_limite?new Date(t.fecha_limite+'T00:00:00').toLocaleDateString('es-CO'):'-',t.responsable||'-']),
theme:'striped',headStyles:{fillColor:AZ,fontSize:6.5},bodyStyles:{fontSize:6.5},margin:{left:14,right:14},
didParseCell:d=>{if(d.section==='body'&&d.column.index===1&&d.cell.raw==='Completada')d.cell.styles.textColor=VE}})
y=doc.lastAutoTable.finalY+6}
// 6. Mantenimientos
if(mantsP.length){
y=seccion(y,'Mantenimientos',VE)
doc.autoTable({startY:y,head:[['Equipo/Area','Tipo','Fecha','Estado','Costo']],
body:mantsP.map(m=>[m.equipo||m.area||m.descripcion||'-',m.tipo||'-',(m.fecha_programada||m.fecha)?new Date((m.fecha_programada||m.fecha)+'T00:00:00').toLocaleDateString('es-CO'):'-',m.estado||'-',m.costo?fmtM(m.costo):'-']),
theme:'striped',headStyles:{fillColor:VE,fontSize:6.5},bodyStyles:{fontSize:6.5},margin:{left:14,right:14}})
y=doc.lastAutoTable.finalY+6}
// 7. PQRs
if(pqrsP.length){
y=seccion(y,'PQRs (Peticiones, Quejas y Reclamos)',[229,62,62])
doc.autoTable({startY:y,head:[['No.','Tipo','Solicitante','Descripcion','Estado']],
body:pqrsP.map(p=>[p.numero||'-',p.tipo||'-',p.nombre_solicitante||'-',(p.descripcion||'').substring(0,45),p.estado||'-']),
theme:'striped',headStyles:{fillColor:[229,62,62],fontSize:6.5},bodyStyles:{fontSize:6.5},margin:{left:14,right:14},
didParseCell:d=>{if(d.section==='body'&&d.column.index===4&&['Resuelta','Cerrada'].includes(String(d.cell.raw)))d.cell.styles.textColor=VE}})
y=doc.lastAutoTable.finalY+6}
// 8. Cartera
if(cartera.length){
const tD=cartera.reduce((s,x)=>s+(Number(x.monto_deuda)||0),0),tR=cartera.reduce((s,x)=>s+(Number(x.monto_recuperado)||0),0)
y=seccion(y,'Gestion de cartera',RO)
doc.autoTable({startY:y,head:[['Unidad','Deuda','Recuperado','Estado']],
body:[...cartera.map(x=>[x.unidad||'-',fmtM(x.monto_deuda),fmtM(x.monto_recuperado),x.estado||'-']),[{content:'TOTAL',styles:{fontStyle:'bold'}},{content:fmtM(tD),styles:{fontStyle:'bold'}},{content:fmtM(tR),styles:{fontStyle:'bold',textColor:VE}},'']],
theme:'striped',headStyles:{fillColor:RO,fontSize:6.5},bodyStyles:{fontSize:6.5},margin:{left:14,right:14}})
y=doc.lastAutoTable.finalY+6}
// 9. SG-SST
if(sgsstP.length){
y=seccion(y,'Seguridad y Salud en el Trabajo (SG-SST)',[8,145,178])
doc.autoTable({startY:y,head:[['Actividad','Programada','Ejecutada','Responsable','Estado']],
body:sgsstP.map(s=>[s.actividad||'-',s.fecha_programada?new Date(s.fecha_programada+'T00:00:00').toLocaleDateString('es-CO'):'-',s.fecha_ejecutada?new Date(s.fecha_ejecutada+'T00:00:00').toLocaleDateString('es-CO'):'-',s.responsable||'-',s.completada?'Completada':'Pendiente']),
theme:'striped',headStyles:{fillColor:[8,145,178],fontSize:6.5},bodyStyles:{fontSize:6.5},margin:{left:14,right:14},
didParseCell:d=>{if(d.section==='body'&&d.column.index===4&&d.cell.raw==='Completada')d.cell.styles.textColor=VE}})
y=doc.lastAutoTable.finalY+6}
// 10. Obras
const obrasP=obras.filter(o=>enP(o.created_at)||enP(o.fecha_inicio))
if(obrasP.length){
y=seccion(y,'Obras y mejoras',[249,115,22])
doc.autoTable({startY:y,head:[['Obra','Contratista','Avance','Costo','Estado']],
body:obrasP.map(o=>[o.nombre||o.descripcion||'-',o.contratista||'-',(o.progreso||o.avance||0)+'%',o.costo?fmtM(o.costo):'-',o.estado||'-']),
theme:'striped',headStyles:{fillColor:[249,115,22],fontSize:6.5},bodyStyles:{fontSize:6.5},margin:{left:14,right:14}})
y=doc.lastAutoTable.finalY+6}
// Evidencias
const conFotos=tP.filter(t=>Array.isArray(t.fotos)&&t.fotos.length>0)
if(conFotos.length){
y=seccion(y,'Registro fotografico de la gestion',DO)
for(const t of conFotos){
if(y>230){doc.addPage();header(cop.nombre);y=40}
doc.setFontSize(7);doc.setTextColor(60);doc.setFont(undefined,'bold');doc.text(t.titulo||'',14,y+2);y+=4
doc.setFont(undefined,'normal')
let x=14
for(const furl of t.fotos.slice(0,4)){
const d64=await imgData(furl)
if(d64){try{doc.addImage(d64,'JPEG',x,y,42,30)}catch(e){}}
x+=46;if(x>W-46){x=14;y+=34}}
y+=34}}
// Cierre
if(y>250){doc.addPage();header(cop.nombre);y=40}
doc.setDrawColor(...DO);doc.setLineWidth(0.5);doc.line(14,y+4,W-14,y+4)
doc.setTextColor(...GR);doc.setFontSize(7)
doc.text('Informe generado por la plataforma Geinser Prohorizontal como soporte de la gestion administrativa del periodo. Elaborado por: '+deleg,14,y+10,{maxWidth:W-28})
}
const pages=doc.internal.getNumberOfPages()
for(let i=1;i<=pages;i++){doc.setPage(i);doc.setFontSize(6.5);doc.setTextColor(160);doc.text('Geinser Prohorizontal · Informe de Gestion · '+perLabel+' · Pag. '+i+' de '+pages,W/2,291,{align:'center'})}
const fname='Informe_'+(tipoInf==='mes'?MESES_INF[mesInf]+'_':'Anual_')+anioInf+(copropiedades.length===1?'_'+copropiedades[0].nombre.replace(/[^a-zA-Z0-9]/g,'_'):'')+'_Geinser.pdf'
doc.save(fname)
}

function PanelControl({onSelect}){
const[cops,setCops]=useState([]);const[tareas,setTareas]=useState([]);const[perfiles,setPerfiles]=useState([]);const[loading,setLoading]=useState(true)
const[showInf,setShowInf]=useState(false);const[tipoInf,setTipoInf]=useState('mes')
const[copSel,setCopSel]=useState('todos')
const hoyD=new Date()
const[mesInf,setMesInf]=useState(hoyD.getMonth());const[anioInf,setAnioInf]=useState(hoyD.getFullYear())
const[generando,setGenerando]=useState(false)
useEffect(()=>{(async()=>{
const[rc,rt,rp]=await Promise.all([
supabase.from('copropiedades').select('*').order('nombre'),
supabase.from('tareas').select('id,copropiedad_id,estado,progreso,fecha_limite,historial,titulo,prioridad,responsable,created_at,descripcion,fotos'),
supabase.from('perfiles').select('id,nombre,rol,activo')
])
setCops(rc.data||[]);setTareas(rt.data||[]);setPerfiles(rp.data||[]);setLoading(false)
})()},[])
const hoy=new Date();hoy.setHours(0,0,0,0)
const esVenc=t=>t.fecha_limite&&new Date(t.fecha_limite+'T00:00:00')<hoy&&t.estado!=='Completada'&&t.estado!=='Cancelada'
const resumen=cops.map(cop=>{
const ts=tareas.filter(t=>t.copropiedad_id===cop.id)
const activas=ts.filter(t=>t.estado!=='Completada'&&t.estado!=='Cancelada')
const vencidas=ts.filter(esVenc)
const completadas=ts.filter(t=>t.estado==='Completada')
const avance=ts.length?Math.round(ts.reduce((s,t)=>s+(Number(t.progreso)||0),0)/ts.length):0
let ultAct=null
ts.forEach(t=>{if(Array.isArray(t.historial))t.historial.forEach(h=>{if(!ultAct||h.fecha>ultAct.fecha)ultAct={...h,tarea:t.titulo}})})
const delegado=perfiles.find(p=>p.id===cop.delegado_id)
const sem=vencidas.length>0?'#dc2626':activas.length>0&&avance<50?'#d97706':'#059669'
return{cop,delegado,activas:activas.length,vencidas:vencidas.length,completadas:completadas.length,total:ts.length,avance,ultAct,sem}
})
const gTot={
edificios:cops.length,
delegados:perfiles.filter(p=>p.rol==='delegado'&&p.activo).length,
activas:tareas.filter(t=>t.estado!=='Completada'&&t.estado!=='Cancelada').length,
vencidas:tareas.filter(esVenc).length
}
async function generarInforme(){
setGenerando(true)
try{
const copsInf=copSel==='todos'?cops:cops.filter(x=>x.id===copSel)
await genInformePDF({copropiedades:copsInf,getDelegado:cop=>perfiles.find(p=>p.id===cop.delegado_id)?.nombre,tipoInf,mesInf,anioInf})
setShowInf(false)
}catch(err){alert('Error generando PDF: '+err.message)}
setGenerando(false)
}
if(loading)return<div style={{padding:40,textAlign:'center',color:'#9ca3af'}}>Cargando panel...</div>
return(<div>
<div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',flexWrap:'wrap',gap:10,marginBottom:4}}>
<div><h2 style={{margin:'0 0 4px',fontSize:20,fontWeight:900,color:GD}}>Panel de Control</h2>
<p style={{margin:'0 0 14px',fontSize:13,color:'#6b7280'}}>Seguimiento ejecutivo de la gestion por copropiedad</p></div>
<button onClick={()=>setShowInf(true)} style={{background:'#fff',color:GD,border:'1.5px solid '+GD,borderRadius:12,padding:'9px 16px',fontWeight:800,cursor:'pointer',display:'flex',alignItems:'center',gap:6,fontSize:13}}>📄 Descargar informe PDF</button>
</div>
<div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(130px,1fr))',gap:10,marginBottom:22}}>
<div style={{background:'linear-gradient(135deg,#0d2d4a,#1e6fae)',borderRadius:14,padding:'14px 16px'}}><div style={{fontSize:26,fontWeight:900,color:'#fff'}}>{gTot.edificios}</div><div style={{fontSize:11,color:'rgba(255,255,255,0.7)',fontWeight:700}}>COPROPIEDADES</div></div>
<div style={{background:'#fff',border:'1.5px solid #e5e7eb',borderRadius:14,padding:'14px 16px'}}><div style={{fontSize:26,fontWeight:900,color:GB}}>{gTot.delegados}</div><div style={{fontSize:11,color:'#6b7280',fontWeight:700}}>DELEGADOS</div></div>
<div style={{background:'#fff',border:'1.5px solid #e5e7eb',borderRadius:14,padding:'14px 16px'}}><div style={{fontSize:26,fontWeight:900,color:'#d97706'}}>{gTot.activas}</div><div style={{fontSize:11,color:'#6b7280',fontWeight:700}}>TAREAS ACTIVAS</div></div>
<div style={{background:'#fff',border:'1.5px solid '+(gTot.vencidas>0?'#fca5a5':'#e5e7eb'),borderRadius:14,padding:'14px 16px'}}><div style={{fontSize:26,fontWeight:900,color:gTot.vencidas>0?'#dc2626':'#9ca3af'}}>{gTot.vencidas}</div><div style={{fontSize:11,color:'#6b7280',fontWeight:700}}>VENCIDAS</div></div>
</div>
<div style={{display:'flex',flexDirection:'column',gap:12}}>
{resumen.map(r=>(<div key={r.cop.id} onClick={()=>onSelect(r.cop)} style={{background:'#fff',border:'1.5px solid #e5e7eb',borderLeft:'5px solid '+r.sem,borderRadius:14,padding:'14px 18px',cursor:'pointer',display:'flex',flexWrap:'wrap',gap:14,alignItems:'center',boxShadow:'0 1px 3px rgba(0,0,0,0.04)'}}>
<div style={{flex:'1 1 200px',minWidth:0}}>
<div style={{fontWeight:900,color:GD,fontSize:15}}>{r.cop.nombre}</div>
<div style={{fontSize:12,color:'#6b7280',display:'flex',alignItems:'center',gap:5,marginTop:2}}><Users size={12}/>{r.delegado?r.delegado.nombre:'Sin delegado asignado'}</div>
{r.ultAct&&<div style={{fontSize:11,color:'#9ca3af',marginTop:4}}>Ultima gestion: {r.ultAct.nota?.substring(0,45)}{r.ultAct.nota?.length>45?'...':''} · {new Date(r.ultAct.fecha).toLocaleDateString('es-CO',{day:'2-digit',month:'short'})}</div>}
{!r.ultAct&&r.total===0&&<div style={{fontSize:11,color:'#d1d5db',marginTop:4}}>Sin tareas registradas</div>}
</div>
<div style={{display:'flex',gap:16,alignItems:'center'}}>
<div style={{textAlign:'center'}}><div style={{fontSize:17,fontWeight:900,color:GB}}>{r.activas}</div><div style={{fontSize:9,color:'#9ca3af',fontWeight:700}}>ACTIVAS</div></div>
<div style={{textAlign:'center'}}><div style={{fontSize:17,fontWeight:900,color:r.vencidas>0?'#dc2626':'#d1d5db'}}>{r.vencidas}</div><div style={{fontSize:9,color:'#9ca3af',fontWeight:700}}>VENCIDAS</div></div>
<div style={{textAlign:'center'}}><div style={{fontSize:17,fontWeight:900,color:'#059669'}}>{r.completadas}</div><div style={{fontSize:9,color:'#9ca3af',fontWeight:700}}>LISTAS</div></div>
<div style={{width:110}}>
<div style={{display:'flex',justifyContent:'space-between',marginBottom:3}}><span style={{fontSize:9,color:'#9ca3af',fontWeight:700}}>AVANCE</span><span style={{fontSize:11,fontWeight:900,color:GD}}>{r.avance}%</span></div>
<div style={{background:'#e5e7eb',borderRadius:99,height:7}}><div style={{background:r.sem,borderRadius:99,height:7,width:r.avance+'%'}}/></div>
</div>
<ChevronRight size={16} color="#9ca3af"/>
</div>
</div>))}
</div>
{cops.length===0&&<div style={{textAlign:'center',padding:50,color:'#9ca3af'}}>No hay copropiedades registradas</div>}
{showInf&&<Modal title="Descargar informe de gestion" onClose={()=>setShowInf(false)}>
<div style={{display:'flex',gap:8,marginBottom:16}}>
<button onClick={()=>setTipoInf('mes')} style={{flex:1,background:tipoInf==='mes'?GB:'#fff',color:tipoInf==='mes'?'#fff':'#6b7280',border:'1.5px solid '+(tipoInf==='mes'?GB:'#e5e7eb'),borderRadius:10,padding:'10px 0',cursor:'pointer',fontWeight:800,fontSize:13}}>Mensual</button>
<button onClick={()=>setTipoInf('anio')} style={{flex:1,background:tipoInf==='anio'?GB:'#fff',color:tipoInf==='anio'?'#fff':'#6b7280',border:'1.5px solid '+(tipoInf==='anio'?GB:'#e5e7eb'),borderRadius:10,padding:'10px 0',cursor:'pointer',fontWeight:800,fontSize:13}}>Consolidado anual</button>
</div>
<F label="Edificio"><select style={inp} value={copSel} onChange={e=>setCopSel(e.target.value)}><option value="todos">Todos los edificios (consolidado)</option>{cops.map(cp=><option key={cp.id} value={cp.id}>{cp.nombre}</option>)}</select></F>
<div style={{display:'grid',gridTemplateColumns:tipoInf==='mes'?'1fr 1fr':'1fr',gap:10,marginBottom:16,marginTop:10}}>
{tipoInf==='mes'&&<F label="Mes"><select style={inp} value={mesInf} onChange={e=>setMesInf(Number(e.target.value))}>{MESES_INF.map((m,i)=><option key={m} value={i}>{m}</option>)}</select></F>}
<F label="Año"><select style={inp} value={anioInf} onChange={e=>setAnioInf(Number(e.target.value))}>{[hoyD.getFullYear(),hoyD.getFullYear()-1,hoyD.getFullYear()-2].map(a=><option key={a} value={a}>{a}</option>)}</select></F>
</div>
<div style={{background:'#f0f7ff',borderRadius:10,padding:12,fontSize:12,color:'#1e40af',marginBottom:16}}>El informe incluye: resumen ejecutivo, tareas gestionadas por copropiedad, estado y avance de cada una, y las actividades registradas por los delegados en el periodo (comentarios, fotos, avances).</div>
<button onClick={generarInforme} disabled={generando} style={{width:'100%',background:generando?'#9ca3af':GD,color:'#fff',border:'none',borderRadius:10,padding:12,fontWeight:800,cursor:generando?'wait':'pointer'}}>{generando?'Generando PDF...':'📄 Generar y descargar PDF'}</button>
</Modal>}
</div>)
}

function MiPerfil({perfil}){
const[pass1,setPass1]=useState('');const[pass2,setPass2]=useState('');const[saving,setSaving]=useState(false)
const[toast,setToast]=useState(null);const showT=(m,tp='success')=>{setToast({msg:m,type:tp});setTimeout(()=>setToast(null),3500)}
async function cambiarPassword(){
  if(!pass1||pass1.length<6){showT('La contrasena debe tener al menos 6 caracteres','error');return}
  if(pass1!==pass2){showT('Las contrasenas no coinciden','error');return}
  setSaving(true)
  const{error}=await supabase.auth.updateUser({password:pass1})
  if(error){showT('Error: '+error.message,'error')}else{showT('Contrasena actualizada');setPass1('');setPass2('')}
  setSaving(false)
}
return(<div style={{maxWidth:420}}>
<h2 style={{margin:'0 0 20px',fontSize:20,fontWeight:900,color:GD}}>Mi Perfil</h2>
<div style={{background:'#fff',border:'1.5px solid #e5e7eb',borderRadius:16,padding:20,marginBottom:20}}>
<div style={{display:'flex',alignItems:'center',gap:12,marginBottom:6}}>
<div style={{width:48,height:48,background:'#e8f4fd',borderRadius:'50%',display:'flex',alignItems:'center',justifyContent:'center'}}><span style={{fontSize:20,fontWeight:900,color:GB}}>{perfil.nombre?perfil.nombre[0].toUpperCase():'?'}</span></div>
<div><div style={{fontWeight:900,color:GD,fontSize:15}}>{perfil.nombre}</div><div style={{fontSize:12,color:'#9ca3af'}}>{perfil.email}</div></div>
</div>
<div style={{marginTop:8}}><Bdg t={(perfil.rol||'').toUpperCase()} color={GB}/></div>
</div>
<div style={{background:'#fff',border:'1.5px solid #e5e7eb',borderRadius:16,padding:20}}>
<h3 style={{margin:'0 0 14px',fontSize:14,fontWeight:800,color:GD}}>Cambiar contrasena</h3>
<F label="Nueva contrasena" req><input style={inp} type="password" value={pass1} onChange={e=>setPass1(e.target.value)} placeholder="Minimo 6 caracteres"/></F>
<F label="Confirmar contrasena" req><input style={inp} type="password" value={pass2} onChange={e=>setPass2(e.target.value)} placeholder="Repite la contrasena"/></F>
<button onClick={cambiarPassword} disabled={saving} style={{width:'100%',background:saving?'#9ca3af':GB,color:'#fff',border:'none',borderRadius:10,padding:11,cursor:saving?'not-allowed':'pointer',fontWeight:800,marginTop:6}}>{saving?'Guardando...':'Actualizar contrasena'}</button>
</div>
{showInfT&&<Modal title={'Informe de gestion - '+copropiedad.nombre} onClose={()=>setShowInfT(false)}>
<div style={{display:'flex',gap:8,marginBottom:16}}>
<button onClick={()=>setTipoInfT('mes')} style={{flex:1,background:tipoInfT==='mes'?GB:'#fff',color:tipoInfT==='mes'?'#fff':'#6b7280',border:'1.5px solid '+(tipoInfT==='mes'?GB:'#e5e7eb'),borderRadius:10,padding:'10px 0',cursor:'pointer',fontWeight:800,fontSize:13}}>Mensual</button>
<button onClick={()=>setTipoInfT('anio')} style={{flex:1,background:tipoInfT==='anio'?GB:'#fff',color:tipoInfT==='anio'?'#fff':'#6b7280',border:'1.5px solid '+(tipoInfT==='anio'?GB:'#e5e7eb'),borderRadius:10,padding:'10px 0',cursor:'pointer',fontWeight:800,fontSize:13}}>Anual</button>
</div>
<div style={{display:'grid',gridTemplateColumns:tipoInfT==='mes'?'1fr 1fr':'1fr',gap:10,marginBottom:16}}>
{tipoInfT==='mes'&&<F label="Mes"><select style={inp} value={mesInfT} onChange={e=>setMesInfT(Number(e.target.value))}>{MESES_INF.map((m,i)=><option key={m} value={i}>{m}</option>)}</select></F>}
<F label="Año"><select style={inp} value={anioInfT} onChange={e=>setAnioInfT(Number(e.target.value))}>{[hoyDT.getFullYear(),hoyDT.getFullYear()-1,hoyDT.getFullYear()-2].map(a=><option key={a} value={a}>{a}</option>)}</select></F>
</div>
<div style={{background:'#f0f7ff',borderRadius:10,padding:12,fontSize:12,color:'#1e40af',marginBottom:16}}>Incluye las tareas del periodo, su estado y avance, el registro de gestion (comentarios, avances, completadas) y las fotos de evidencia.</div>
<button onClick={generarInfCop} disabled={generandoT} style={{width:'100%',background:generandoT?'#9ca3af':GD,color:'#fff',border:'none',borderRadius:10,padding:12,fontWeight:800,cursor:generandoT?'wait':'pointer'}}>{generandoT?'Generando PDF...':'📄 Generar y descargar PDF'}</button>
</Modal>}
{toast&&<Toast msg={toast.msg} type={toast.type}/>}
</div>)
}

function PQRs({copropiedad}){
const{data,loading,insert,update,remove,refetch}=useTable('pqrs',{copropiedad_id:copropiedad.id})
const[show,setShow]=useState(false);const[edit,setEdit]=useState(null);const[det,setDet]=useState(null);const[subiendo,setSubiendo]=useState(false)
const FD={numero:'',tipo:'Peticion',estado:'Recibida',nombre_solicitante:'',unidad:'',descripcion:'',fecha_recepcion:new Date().toISOString().slice(0,10),fecha_respuesta:'',fecha_cierre:'',responsable:'',respuesta:'',prioridad:'Normal',canal:'Escrito',notas:'',evidencia:''}
const[form,setForm]=useState(FD);const Fv=(k,v)=>setForm(p=>({...p,[k]:v}))
const[toast,setToast]=useState(null);const showT=(m,t='success')=>{setToast({msg:m,type:t});setTimeout(()=>setToast(null),3000)}
async function save(){if(!form.descripcion){showT('Descripcion requerida','error');return};const p={...form,copropiedad_id:copropiedad.id};if(edit){await update(edit.id,p);showT('PQR actualizada')}else{await insert(p);showT('PQR registrada')};setShow(false);setEdit(null);setForm(FD)}
async function quitarEvidencia(){if(!edit?.evidencia)return;if(!window.confirm('Quitar la foto de este registro?'))return;const res=await update(edit.id,{evidencia:null});if(res?.error){showT('Error: '+res.error.message,'error');return};const path=decodeURIComponent((edit.evidencia.split('/geinser-fotos/')[1]||''));if(path)supabase.storage.from('geinser-fotos').remove([path]);setEdit(p=>({...p,evidencia:null}));showT('Foto eliminada');refetch()}
async function subirFoto(e,id){const file=e.target.files[0];if(!file)return;setSubiendo(true);const path=`pqrs/${id}/${Date.now()}.${file.name.split('.').pop()}`;await supabase.storage.from('geinser-fotos').upload(path,file,{upsert:true});const{data:u}=supabase.storage.from('geinser-fotos').getPublicUrl(path);await update(id,{evidencia:u.publicUrl});showT('Foto subida');setSubiendo(false);refetch()}
const cE={Recibida:'#3b82f6',EnGestion:'#d97706',Respondida:'#059669',Cerrada:'#6b7280',Escalada:'#dc2626'}
const cP={Urgente:'#dc2626',Alta:'#d97706',Normal:'#3b82f6',Baja:'#6b7280'}
if(loading)return<div style={{padding:40,textAlign:'center',color:'#9ca3af'}}>Cargando...</div>
return(<div>
<div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:20}}><div style={{display:'flex',alignItems:'center',gap:10}}><h2 style={{margin:0,fontSize:20,fontWeight:900,color:GD}}>PQRs</h2><Bdg t={data.filter(p=>p.estado!=='Cerrada').length+' pendientes'} color="#dc2626"/></div><button onClick={()=>{setForm(FD);setEdit(null);setShow(true)}} style={{background:'#e53e3e',color:'#fff',border:'none',borderRadius:12,padding:'9px 18px',fontWeight:800,cursor:'pointer',display:'flex',alignItems:'center',gap:6}}><Plus size={14}/>Nueva</button></div>
<div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(min(290px,100%),1fr))',gap:14}}>
{data.length===0&&<div style={{gridColumn:'1/-1',textAlign:'center',padding:40,color:'#9ca3af'}}><MessageSquare size={40} color="#e5e7eb" style={{margin:'0 auto 12px',display:'block'}}/><p>Sin PQRs</p></div>}
{data.map(p=>(<div key={p.id} style={{background:'#fff',border:'1.5px solid #e5e7eb',borderLeft:`4px solid ${cP[p.prioridad]||'#3b82f6'}`,borderRadius:14,padding:16,cursor:'pointer'}} onClick={()=>setDet(p)}>
<div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:8}}><div style={{display:'flex',gap:6,flexWrap:'wrap'}}><Bdg t={p.tipo} color="#7c3aed"/><Bdg t={p.estado} color={cE[p.estado?.replace(' ','')]||'#3b82f6'}/></div><div style={{display:'flex',gap:4}}><button onClick={e=>{e.stopPropagation();setForm({...FD,...p});setEdit(p);setShow(true)}} style={{background:'#f3f4f6',border:'none',borderRadius:6,padding:'3px 6px',cursor:'pointer'}}><Edit2 size={11}/></button><button onClick={e=>{e.stopPropagation();if(window.confirm('Eliminar?'))remove(p.id)}} style={{background:'#fef2f2',border:'none',borderRadius:6,padding:'3px 6px',cursor:'pointer',color:'#dc2626'}}><Trash2 size={11}/></button></div></div>
<div style={{fontWeight:800,color:GD,fontSize:14,marginBottom:3,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{p.descripcion}</div>
<div style={{fontSize:12,color:'#6b7280',marginBottom:6}}>{p.nombre_solicitante||'Anonimo'}{p.unidad?' · '+p.unidad:''}</div>
{p.evidencia&&<img src={p.evidencia} alt="foto" style={{width:'100%',height:90,objectFit:'cover',borderRadius:8,marginBottom:6}} onClick={e=>e.stopPropagation()}/>}
<div style={{display:'flex',justifyContent:'space-between',alignItems:'center',fontSize:11,color:'#9ca3af'}}><span>Recibida: {fmt(p.fecha_recepcion)}</span><label style={{background:'#fef2f2',borderRadius:7,padding:'4px 8px',cursor:'pointer',color:'#e53e3e',display:'flex',alignItems:'center',gap:3,fontSize:10,fontWeight:700}} onClick={e=>e.stopPropagation()}><Camera size={10}/>Foto<input type="file" accept="image/*" style={{display:'none'}} onChange={e=>subirFoto(e,p.id)} disabled={subiendo}/></label></div>
</div>))}
</div>
{show&&<Modal title={edit?'Editar PQR':'Nueva PQR'} onClose={()=>{setShow(false);setEdit(null)}} wide>
<div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(180px,1fr))',gap:12}}>
<F label="Numero"><input style={inp} value={form.numero} onChange={e=>Fv('numero',e.target.value)} placeholder="PQR-001"/></F>
<F label="Tipo"><select style={inp} value={form.tipo} onChange={e=>Fv('tipo',e.target.value)}><option>Peticion</option><option>Queja</option><option>Reclamo</option><option>Sugerencia</option><option>Felicitacion</option></select></F>
<F label="Prioridad"><select style={inp} value={form.prioridad} onChange={e=>Fv('prioridad',e.target.value)}><option>Urgente</option><option>Alta</option><option>Normal</option><option>Baja</option></select></F>
<F label="Estado"><select style={inp} value={form.estado} onChange={e=>Fv('estado',e.target.value)}><option>Recibida</option><option>En Gestion</option><option>Respondida</option><option>Cerrada</option><option>Escalada</option></select></F>
<F label="Solicitante"><input style={inp} value={form.nombre_solicitante} onChange={e=>Fv('nombre_solicitante',e.target.value)}/></F>
<F label="Unidad"><input style={inp} value={form.unidad} onChange={e=>Fv('unidad',e.target.value)}/></F>
<F label="Canal"><select style={inp} value={form.canal} onChange={e=>Fv('canal',e.target.value)}><option>Escrito</option><option>Verbal</option><option>Email</option><option>WhatsApp</option><option>Buzon</option></select></F>
<F label="Responsable"><input style={inp} value={form.responsable} onChange={e=>Fv('responsable',e.target.value)}/></F>
<F label="Fecha recepcion"><input style={inp} type="date" value={form.fecha_recepcion} onChange={e=>Fv('fecha_recepcion',e.target.value)}/></F>
<F label="Fecha respuesta"><input style={inp} type="date" value={form.fecha_respuesta} onChange={e=>Fv('fecha_respuesta',e.target.value)}/></F>
<F label="Fecha cierre"><input style={inp} type="date" value={form.fecha_cierre} onChange={e=>Fv('fecha_cierre',e.target.value)}/></F>
<div/>
<div style={{gridColumn:'1/-1'}}><F label="Descripcion" req><textarea style={{...inp,resize:'vertical',minHeight:65}} value={form.descripcion} onChange={e=>Fv('descripcion',e.target.value)}/></F></div>
<div style={{gridColumn:'1/-1'}}><F label="Respuesta dada"><textarea style={{...inp,resize:'vertical',minHeight:55}} value={form.respuesta} onChange={e=>Fv('respuesta',e.target.value)}/></F></div>
<div style={{gridColumn:'1/-1'}}><F label="Notas"><textarea style={{...inp,resize:'vertical',minHeight:45}} value={form.notas} onChange={e=>Fv('notas',e.target.value)}/></F></div>
</div>
<div style={{display:'flex',gap:10,marginTop:8}}><button onClick={()=>{setShow(false);setEdit(null)}} style={{flex:1,background:'#f3f4f6',border:'none',borderRadius:10,padding:11,cursor:'pointer',fontWeight:700}}>Cancelar</button><button onClick={save} style={{flex:2,background:'#e53e3e',color:'#fff',border:'none',borderRadius:10,padding:11,cursor:'pointer',fontWeight:800}}>{edit?'Guardar':'Registrar'}</button></div>
</Modal>}
{det&&<Modal title={'PQR — '+det.tipo} onClose={()=>setDet(null)} wide>
<div style={{display:'grid',gap:10}}>{[['Descripcion',det.descripcion],['Solicitante',det.nombre_solicitante||'Anonimo'],['Unidad',det.unidad||'—'],['Estado',det.estado],['Prioridad',det.prioridad],['Canal',det.canal],['Responsable',det.responsable||'—'],['Recibida',fmt(det.fecha_recepcion)],['Respuesta',fmt(det.fecha_respuesta)],['Cierre',fmt(det.fecha_cierre)]].map(([l,v])=>(<div key={l} style={{background:'#f9fafb',borderRadius:8,padding:'9px 14px'}}><div style={{fontSize:10,color:'#9ca3af',fontWeight:700,marginBottom:1}}>{l.toUpperCase()}</div><div style={{fontSize:13,color:'#1f2937'}}>{v}</div></div>))}{det.respuesta&&<div style={{background:'#e6f9f0',borderRadius:8,padding:'9px 14px'}}><div style={{fontSize:10,color:'#0d7a4a',fontWeight:700,marginBottom:1}}>RESPUESTA</div><div style={{fontSize:13}}>{det.respuesta}</div></div>}{det.evidencia&&<img src={det.evidencia} alt="foto" style={{width:'100%',borderRadius:10}}/>}</div>
<button onClick={()=>setDet(null)} style={{width:'100%',background:'#f3f4f6',border:'none',borderRadius:10,padding:11,cursor:'pointer',fontWeight:700,marginTop:14}}>Cerrar</button>
</Modal>}
{toast&&<Toast {...toast}/>}
</div>)
}
function ServiciosPublicos({copropiedad}){
const{data,loading,insert,update,remove,refetch}=useTable('servicios_publicos',{copropiedad_id:copropiedad.id})
const[show,setShow]=useState(false);const[edit,setEdit]=useState(null);const[subiendo,setSubiendo]=useState(false)
const uMap={Energia:'kWh',Agua:'m³',Gas:'m³',Internet:'Mbps',Aseo:'Ton',Telefono:'min'}
const FD={servicio:'Energia',periodo:'',fecha_factura:new Date().toISOString().slice(0,10),fecha_vencimiento:'',valor:0,consumo:0,unidad_consumo:'kWh',lectura_anterior:0,lectura_actual:0,estado:'Pendiente',observaciones:'',evidencia:''}
const[form,setForm]=useState(FD);const Fv=(k,v)=>setForm(p=>({...p,[k]:v}))
const[toast,setToast]=useState(null);const showT=(m,t='success')=>{setToast({msg:m,type:t});setTimeout(()=>setToast(null),3000)}
async function save(){if(!form.servicio){showT('Servicio requerido','error');return};const p={...form,copropiedad_id:copropiedad.id,valor:Number(form.valor)||0,consumo:Number(form.consumo)||0,lectura_anterior:Number(form.lectura_anterior)||0,lectura_actual:Number(form.lectura_actual)||0};if(edit){await update(edit.id,p);showT('Actualizado')}else{await insert(p);showT('Registrado')};setShow(false);setEdit(null);setForm(FD)}
async function subirFoto(e,id){const file=e.target.files[0];if(!file)return;setSubiendo(true);const path=`servicios_publicos/${id}/${Date.now()}.${file.name.split('.').pop()}`;await supabase.storage.from('geinser-fotos').upload(path,file,{upsert:true});const{data:u}=supabase.storage.from('geinser-fotos').getPublicUrl(path);await update(id,{evidencia:u.publicUrl});showT('Foto subida');setSubiendo(false);refetch()}
const cS={Energia:'#f59e0b',Agua:'#3b82f6',Gas:'#f97316',Internet:'#8b5cf6',Aseo:'#10b981',Telefono:'#ec4899'}
const iS={Energia:'⚡',Agua:'💧',Gas:'🔥',Internet:'📡',Aseo:'♻️',Telefono:'📞'}
const grupos={};data.forEach(d=>{if(!grupos[d.servicio])grupos[d.servicio]=[];grupos[d.servicio].push(d)})
if(loading)return<div style={{padding:40,textAlign:'center',color:'#9ca3af'}}>Cargando...</div>
return(<div>
<div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:20}}><h2 style={{margin:0,fontSize:20,fontWeight:900,color:GD}}>Servicios Publicos</h2><button onClick={()=>{setForm(FD);setEdit(null);setShow(true)}} style={{background:'#f59e0b',color:'#fff',border:'none',borderRadius:12,padding:'9px 18px',fontWeight:800,cursor:'pointer',display:'flex',alignItems:'center',gap:6}}><Plus size={14}/>Registrar</button></div>
{data.length===0&&<div style={{textAlign:'center',padding:48,color:'#9ca3af',background:'#fff',borderRadius:16,border:'1.5px solid #e5e7eb'}}><Zap size={40} color="#e5e7eb" style={{margin:'0 auto 12px',display:'block'}}/><p>Sin facturas</p></div>}
{Object.entries(grupos).map(([serv,facts])=>{const mx=Math.max(...facts.map(f=>Number(f.consumo)||0));return(<div key={serv} style={{background:'#fff',border:'1.5px solid #e5e7eb',borderRadius:16,padding:18,marginBottom:16}}>
<div style={{display:'flex',alignItems:'center',gap:10,marginBottom:14}}><span style={{fontSize:24}}>{iS[serv]||'🔌'}</span><div><div style={{fontWeight:900,fontSize:16,color:GD}}>{serv}</div><div style={{fontSize:11,color:'#9ca3af'}}>{facts.length} facturas</div></div></div>
<div style={{overflowX:'auto'}}><table style={{width:'100%',borderCollapse:'collapse',fontSize:12,minWidth:400}}>
<thead><tr style={{background:'#f9fafb'}}>{['Periodo','Consumo','Valor','Estado','Foto',''].map(h=><th key={h} style={{padding:'6px 8px',textAlign:'left',fontSize:10,color:'#9ca3af',fontWeight:700,whiteSpace:'nowrap'}}>{h}</th>)}</tr></thead>
<tbody>{facts.sort((a,b)=>b.fecha_factura>a.fecha_factura?1:-1).map(f=>{const pct=mx>0?Math.round((Number(f.consumo)||0)/mx*100):0;const esMax=Number(f.consumo)===mx&&mx>0;return(<tr key={f.id} style={{borderBottom:'1px solid #f3f4f6'}}>
<td style={{padding:'7px 8px',fontWeight:700,whiteSpace:'nowrap'}}>{f.periodo||fmt(f.fecha_factura)}</td>
<td style={{padding:'7px 8px'}}><div style={{display:'flex',alignItems:'center',gap:6}}><div style={{background:'#e5e7eb',borderRadius:99,height:5,width:40,flexShrink:0}}><div style={{background:esMax?'#dc2626':cS[serv]||'#3b82f6',borderRadius:99,height:5,width:pct+'%'}}/></div><span style={{fontWeight:700,color:esMax?'#dc2626':'inherit',whiteSpace:'nowrap'}}>{f.consumo} {f.unidad_consumo}</span>{esMax&&<Bdg t="MAX" color="#dc2626"/>}</div></td>
<td style={{padding:'7px 8px',fontWeight:700,whiteSpace:'nowrap'}}>{fmtM(f.valor)}</td>
<td style={{padding:'7px 8px'}}><Bdg t={f.estado} color={f.estado==='Pagado'?'#059669':f.estado==='Vencido'?'#dc2626':'#d97706'}/></td>
<td style={{padding:'7px 8px'}}>{f.evidencia?<img src={f.evidencia} alt="factura" style={{width:36,height:28,objectFit:'cover',borderRadius:4}}/>:<label style={{background:'#fffbeb',borderRadius:6,padding:'3px 6px',cursor:'pointer',color:'#f59e0b',display:'inline-flex',alignItems:'center'}} title="Foto"><Camera size={11}/><input type="file" accept="image/*" style={{display:'none'}} onChange={e=>subirFoto(e,f.id)} disabled={subiendo}/></label>}</td>
<td style={{padding:'7px 8px'}}><div style={{display:'flex',gap:3}}><button onClick={()=>{setForm({...FD,...f,valor:String(f.valor),consumo:String(f.consumo),lectura_anterior:String(f.lectura_anterior),lectura_actual:String(f.lectura_actual)});setEdit(f);setShow(true)}} style={{background:'#f3f4f6',border:'none',borderRadius:6,padding:'3px 5px',cursor:'pointer'}}><Edit2 size={11}/></button><button onClick={()=>{if(window.confirm('Eliminar?'))remove(f.id)}} style={{background:'#fef2f2',border:'none',borderRadius:6,padding:'3px 5px',cursor:'pointer',color:'#dc2626'}}><Trash2 size={11}/></button></div></td>
</tr>)})}
</tbody></table></div></div>)})}
{show&&<Modal title={edit?'Editar factura':'Registrar factura'} onClose={()=>{setShow(false);setEdit(null)}} wide>
<div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(180px,1fr))',gap:12}}>
<F label="Servicio"><select style={inp} value={form.servicio} onChange={e=>{Fv('servicio',e.target.value);Fv('unidad_consumo',uMap[e.target.value]||'kWh')}}><option>Energia</option><option>Agua</option><option>Gas</option><option>Internet</option><option>Aseo</option><option>Telefono</option><option>Otro</option></select></F>
<F label="Periodo"><input style={inp} value={form.periodo} onChange={e=>Fv('periodo',e.target.value)} placeholder="Ej: Enero 2025"/></F>
<F label="Fecha factura"><input style={inp} type="date" value={form.fecha_factura} onChange={e=>Fv('fecha_factura',e.target.value)}/></F>
<F label="Fecha vencimiento"><input style={inp} type="date" value={form.fecha_vencimiento} onChange={e=>Fv('fecha_vencimiento',e.target.value)}/></F>
<F label="Valor ($)"><input style={inp} type="number" value={form.valor} onChange={e=>Fv('valor',e.target.value)}/></F>
<F label={"Consumo ("+form.unidad_consumo+")"}><input style={inp} type="number" value={form.consumo} onChange={e=>Fv('consumo',e.target.value)}/></F>
<F label="Lectura anterior"><input style={inp} type="number" value={form.lectura_anterior} onChange={e=>Fv('lectura_anterior',e.target.value)}/></F>
<F label="Lectura actual"><input style={inp} type="number" value={form.lectura_actual} onChange={e=>Fv('lectura_actual',e.target.value)}/></F>
<F label="Estado"><select style={inp} value={form.estado} onChange={e=>Fv('estado',e.target.value)}><option>Pendiente</option><option>Pagado</option><option>Vencido</option><option>En disputa</option></select></F><div/>
<div style={{gridColumn:'1/-1'}}><F label="Observaciones"><textarea style={{...inp,resize:'vertical',minHeight:50}} value={form.observaciones} onChange={e=>Fv('observaciones',e.target.value)}/></F></div>
</div>
<div style={{display:'flex',gap:10,marginTop:8}}><button onClick={()=>{setShow(false);setEdit(null)}} style={{flex:1,background:'#f3f4f6',border:'none',borderRadius:10,padding:11,cursor:'pointer',fontWeight:700}}>Cancelar</button><button onClick={save} style={{flex:2,background:'#f59e0b',color:'#fff',border:'none',borderRadius:10,padding:11,cursor:'pointer',fontWeight:800}}>{edit?'Guardar':'Registrar'}</button></div>
</Modal>}
{toast&&<Toast {...toast}/>}
</div>)
}
function Obras({copropiedad}){
const{data:obras,loading,insert,update,remove}=useTable('obras',{copropiedad_id:copropiedad.id})
const[show,setShow]=useState(false);const[edit,setEdit]=useState(null);const[obraAct,setObraAct]=useState(null)
const[reportes,setReportes]=useState([]);const[showR,setShowR]=useState(false);const[subiendo,setSubiendo]=useState(false)
const FD={nombre:'',descripcion:'',contratista:'',valor_contrato:0,fecha_inicio:'',fecha_fin_estimada:'',estado:'En ejecucion',porcentaje_avance:0,interventor:'',evidencia:''}
const FDR={fecha:new Date().toISOString().slice(0,10),tipo:'Avance',descripcion:'',porcentaje_avance:0,novedad:'',concepto_interventor:''}
const[form,setForm]=useState(FD);const[formR,setFormR]=useState(FDR)
const[toast,setToast]=useState(null);const showT=(m,t='success')=>{setToast({msg:m,type:t});setTimeout(()=>setToast(null),3000)}
async function loadR(o){setObraAct(o);const{data:d}=await supabase.from('obra_reportes').select('*').eq('obra_id',o.id).order('fecha',{ascending:false});setReportes(d||[])}
async function save(){if(!form.nombre){showT('Nombre requerido','error');return};const p={...form,copropiedad_id:copropiedad.id,valor_contrato:Number(form.valor_contrato)||0,porcentaje_avance:Number(form.porcentaje_avance)||0};if(edit){await update(edit.id,p);showT('Actualizada')}else{await insert(p);showT('Obra creada')};setShow(false);setEdit(null);setForm(FD)}
async function saveR(){if(!formR.descripcion){showT('Descripcion requerida','error');return};const{error}=await supabase.from('obra_reportes').insert({...formR,obra_id:obraAct.id,porcentaje_avance:Number(formR.porcentaje_avance)||0});if(!error){showT('Reporte registrado');await loadR(obraAct);if(formR.porcentaje_avance)await update(obraAct.id,{porcentaje_avance:Number(formR.porcentaje_avance)});setShowR(false);setFormR(FDR)}else showT('Error: '+error.message,'error')}
async function subirEv(e,rid){const file=e.target.files[0];if(!file)return;setSubiendo(true);const path=`obras/${rid}/${Date.now()}.${file.name.split('.').pop()}`;await supabase.storage.from('geinser-fotos').upload(path,file,{upsert:true});const{data:u}=supabase.storage.from('geinser-fotos').getPublicUrl(path);await supabase.from('obra_reportes').update({evidencia:u.publicUrl}).eq('id',rid);await loadR(obraAct);setSubiendo(false);showT('Foto subida')}
const cEst={'En ejecucion':'#3b82f6',Suspendida:'#d97706',Finalizada:'#059669',Cancelada:'#dc2626','En licitacion':'#8b5cf6'}
if(loading)return<div style={{padding:40,textAlign:'center',color:'#9ca3af'}}>Cargando...</div>
return(<div>
<div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:20}}><h2 style={{margin:0,fontSize:20,fontWeight:900,color:GD}}>Obras</h2><button onClick={()=>{setForm(FD);setEdit(null);setShow(true)}} style={{background:'#f97316',color:'#fff',border:'none',borderRadius:12,padding:'9px 18px',fontWeight:800,cursor:'pointer',display:'flex',alignItems:'center',gap:6}}><Plus size={14}/>Nueva</button></div>
{obraAct?(<div>
<button onClick={()=>setObraAct(null)} style={{background:'#f3f4f6',border:'none',borderRadius:10,padding:'8px 14px',cursor:'pointer',fontWeight:700,fontSize:13,display:'flex',alignItems:'center',gap:6,marginBottom:16}}><ArrowLeft size={14}/>Volver</button>
<div style={{background:'#fff',border:'1.5px solid #e5e7eb',borderRadius:16,padding:18,marginBottom:16}}>
<div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:12}}><div><div style={{fontWeight:900,fontSize:17,color:GD}}>{obraAct.nombre}</div><div style={{fontSize:12,color:'#6b7280'}}>{obraAct.contratista||'Sin contratista'}</div></div><Bdg t={obraAct.estado} color={cEst[obraAct.estado]||'#3b82f6'}/></div>
<div style={{marginBottom:10}}><div style={{display:'flex',justifyContent:'space-between',marginBottom:4}}><span style={{fontSize:12,color:'#6b7280'}}>Avance</span><span style={{fontWeight:900,color:GB}}>{obraAct.porcentaje_avance||0}%</span></div><div style={{background:'#e5e7eb',borderRadius:99,height:10}}><div style={{background:GB,borderRadius:99,height:10,width:(obraAct.porcentaje_avance||0)+'%'}}/></div></div>
<div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:6,marginBottom:obraAct.interventor?8:0}}>{[['Valor',fmtM(obraAct.valor_contrato)],['Inicio',fmt(obraAct.fecha_inicio)],['Fin est.',fmt(obraAct.fecha_fin_estimada)],['Interventor',obraAct.interventor||'—']].map(([l,v])=><div key={l} style={{background:'#f9fafb',borderRadius:8,padding:'6px 10px'}}><div style={{fontSize:9,color:'#9ca3af'}}>{l}</div><div style={{fontSize:12,fontWeight:700,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{v}</div></div>)}</div>
</div>
<div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:12}}><h3 style={{margin:0,fontSize:16,fontWeight:800,color:GD}}>Reportes ({reportes.length})</h3><button onClick={()=>{setFormR(FDR);setShowR(true)}} style={{background:'#f97316',color:'#fff',border:'none',borderRadius:10,padding:'8px 14px',fontWeight:800,cursor:'pointer',fontSize:13,display:'flex',alignItems:'center',gap:5}}><Plus size={13}/>Nuevo</button></div>
<div style={{display:'grid',gap:12}}>
{reportes.length===0&&<div style={{textAlign:'center',padding:30,color:'#9ca3af',background:'#fff',borderRadius:12,border:'1px solid #e5e7eb'}}>Sin reportes</div>}
{reportes.map(rep=>(<div key={rep.id} style={{background:'#fff',border:'1.5px solid #e5e7eb',borderRadius:14,padding:16}}>
<div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:8}}><div style={{display:'flex',gap:6}}><Bdg t={rep.tipo} color='#f97316'/><span style={{fontSize:11,color:'#9ca3af'}}>{fmt(rep.fecha)}</span></div><span style={{fontWeight:800,color:GB}}>{rep.porcentaje_avance}%</span></div>
<div style={{fontSize:13,color:'#1f2937',marginBottom:rep.novedad||rep.concepto_interventor?8:0}}>{rep.descripcion}</div>
{rep.novedad&&<div style={{background:'#fffbeb',borderRadius:8,padding:'7px 12px',fontSize:12,marginBottom:6}}><b style={{color:'#d97706'}}>Novedad:</b> {rep.novedad}</div>}
{rep.concepto_interventor&&<div style={{background:'#f0f9ff',borderRadius:8,padding:'7px 12px',fontSize:12,marginBottom:6}}><b style={{color:'#0369a1'}}>Interventor:</b> {rep.concepto_interventor}</div>}
{rep.evidencia&&<img src={rep.evidencia} alt="ev" style={{width:'100%',maxHeight:160,objectFit:'cover',borderRadius:8,marginBottom:8}}/>}
<label style={{display:'inline-flex',alignItems:'center',gap:4,marginTop:4,background:'#fff7ed',border:'1px solid #fed7aa',borderRadius:7,padding:'5px 10px',cursor:'pointer',color:'#f97316',fontSize:11,fontWeight:700}}><Camera size={11}/>Foto<input type="file" accept="image/*" style={{display:'none'}} onChange={e=>subirEv(e,rep.id)} disabled={subiendo}/></label>
</div>))}
</div>
{showR&&<Modal title="Nuevo reporte" onClose={()=>setShowR(false)} wide>
<div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(180px,1fr))',gap:12}}>
<F label="Fecha"><input style={inp} type="date" value={formR.fecha} onChange={e=>setFormR(p=>({...p,fecha:e.target.value}))}/></F>
<F label="Tipo"><select style={inp} value={formR.tipo} onChange={e=>setFormR(p=>({...p,tipo:e.target.value}))}><option>Avance</option><option>Novedad</option><option>Supervision</option><option>Interventoria</option><option>Semanal</option><option>Diario</option></select></F>
<F label="Avance (%)"><input style={inp} type="number" min="0" max="100" value={formR.porcentaje_avance} onChange={e=>setFormR(p=>({...p,porcentaje_avance:e.target.value}))}/></F><div/>
<div style={{gridColumn:'1/-1'}}><F label="Descripcion" req><textarea style={{...inp,resize:'vertical',minHeight:65}} value={formR.descripcion} onChange={e=>setFormR(p=>({...p,descripcion:e.target.value}))}/></F></div>
<div style={{gridColumn:'1/-1'}}><F label="Novedades / Imprevistos"><textarea style={{...inp,resize:'vertical',minHeight:50}} value={formR.novedad} onChange={e=>setFormR(p=>({...p,novedad:e.target.value}))}/></F></div>
<div style={{gridColumn:'1/-1'}}><F label="Concepto del interventor"><textarea style={{...inp,resize:'vertical',minHeight:50}} value={formR.concepto_interventor} onChange={e=>setFormR(p=>({...p,concepto_interventor:e.target.value}))}/></F></div>
</div>
<div style={{display:'flex',gap:10,marginTop:8}}><button onClick={()=>setShowR(false)} style={{flex:1,background:'#f3f4f6',border:'none',borderRadius:10,padding:11,cursor:'pointer',fontWeight:700}}>Cancelar</button><button onClick={saveR} style={{flex:2,background:'#f97316',color:'#fff',border:'none',borderRadius:10,padding:11,cursor:'pointer',fontWeight:800}}>Registrar</button></div>
</Modal>}
</div>):(<div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(min(280px,100%),1fr))',gap:16}}>
{obras.length===0&&<div style={{gridColumn:'1/-1',textAlign:'center',padding:48,color:'#9ca3af',background:'#fff',borderRadius:16,border:'1.5px solid #e5e7eb'}}><HardDrive size={40} color="#e5e7eb" style={{margin:'0 auto 12px',display:'block'}}/><p>Sin obras</p></div>}
{obras.map(o=>(<div key={o.id} style={{background:'#fff',border:'1.5px solid #e5e7eb',borderRadius:16,padding:18,cursor:'pointer'}} onClick={()=>loadR(o)}>
<div style={{display:'flex',justifyContent:'space-between',marginBottom:10}}><div style={{background:'#fff7ed',borderRadius:9,padding:7}}><HardDrive size={18} color="#f97316"/></div><div style={{display:'flex',gap:5}}><Bdg t={o.estado} color={cEst[o.estado]||'#3b82f6'}/><button onClick={e=>{e.stopPropagation();setForm({...FD,...o,valor_contrato:String(o.valor_contrato),porcentaje_avance:String(o.porcentaje_avance)});setEdit(o);setShow(true)}} style={{background:'#f3f4f6',border:'none',borderRadius:6,padding:'3px 6px',cursor:'pointer'}}><Edit2 size={11}/></button></div></div>
<div style={{fontWeight:900,fontSize:15,color:GD,marginBottom:3}}>{o.nombre}</div>
<div style={{fontSize:12,color:'#6b7280',marginBottom:8}}>{o.contratista||'Sin contratista'}</div>
<div style={{marginBottom:6}}><div style={{display:'flex',justifyContent:'space-between',marginBottom:3}}><span style={{fontSize:11,color:'#6b7280'}}>Avance</span><span style={{fontSize:12,fontWeight:800,color:'#f97316'}}>{o.porcentaje_avance||0}%</span></div><div style={{background:'#e5e7eb',borderRadius:99,height:7}}><div style={{background:'#f97316',borderRadius:99,height:7,width:(o.porcentaje_avance||0)+'%'}}/></div></div>
<div style={{display:'flex',justifyContent:'space-between',fontSize:11,color:'#9ca3af',marginTop:8}}><span>{fmtM(o.valor_contrato)}</span><span style={{color:GB,fontWeight:700,display:'flex',alignItems:'center',gap:2}}>Ver reportes <ChevronRight size={11}/></span></div>
</div>))}
</div>)}
{show&&<Modal title={edit?'Editar obra':'Nueva obra'} onClose={()=>{setShow(false);setEdit(null)}} wide>
<div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(180px,1fr))',gap:12}}>
<div style={{gridColumn:'1/-1'}}><F label="Nombre" req><input style={inp} value={form.nombre} onChange={e=>setForm(p=>({...p,nombre:e.target.value}))}/></F></div>
<F label="Contratista"><input style={inp} value={form.contratista} onChange={e=>setForm(p=>({...p,contratista:e.target.value}))}/></F>
<F label="Interventor"><input style={inp} value={form.interventor} onChange={e=>setForm(p=>({...p,interventor:e.target.value}))}/></F>
<F label="Valor ($)"><input style={inp} type="number" value={form.valor_contrato} onChange={e=>setForm(p=>({...p,valor_contrato:e.target.value}))}/></F>
<F label="Estado"><select style={inp} value={form.estado} onChange={e=>setForm(p=>({...p,estado:e.target.value}))}><option>En ejecucion</option><option>Suspendida</option><option>Finalizada</option><option>Cancelada</option><option>En licitacion</option></select></F>
<F label="Fecha inicio"><input style={inp} type="date" value={form.fecha_inicio} onChange={e=>setForm(p=>({...p,fecha_inicio:e.target.value}))}/></F>
<F label="Fecha fin est."><input style={inp} type="date" value={form.fecha_fin_estimada} onChange={e=>setForm(p=>({...p,fecha_fin_estimada:e.target.value}))}/></F>
<F label="Avance (%)"><input style={inp} type="number" min="0" max="100" value={form.porcentaje_avance} onChange={e=>setForm(p=>({...p,porcentaje_avance:e.target.value}))}/></F><div/>
<div style={{gridColumn:'1/-1'}}><F label="Descripcion"><textarea style={{...inp,resize:'vertical',minHeight:55}} value={form.descripcion} onChange={e=>setForm(p=>({...p,descripcion:e.target.value}))}/></F></div>
</div>
<div style={{display:'flex',gap:10,marginTop:8}}><button onClick={()=>{setShow(false);setEdit(null)}} style={{flex:1,background:'#f3f4f6',border:'none',borderRadius:10,padding:11,cursor:'pointer',fontWeight:700}}>Cancelar</button><button onClick={save} style={{flex:2,background:'#f97316',color:'#fff',border:'none',borderRadius:10,padding:11,cursor:'pointer',fontWeight:800}}>{edit?'Guardar':'Crear'}</button></div>
</Modal>}
{toast&&<Toast {...toast}/>}
</div>)
}
function Cotizaciones({copropiedad}){
const{data,loading,insert,update,remove,refetch}=useTable('cotizaciones',{copropiedad_id:copropiedad.id})
const[show,setShow]=useState(false);const[edit,setEdit]=useState(null);const[subiendo,setSubiendo]=useState(false)
const FD={numero:'',descripcion:'',solicitante:'',tipo:'Reparacion',estado:'Solicitada',proveedor:'',valor:0,fecha_solicitud:new Date().toISOString().slice(0,10),fecha_recepcion:'',fecha_vencimiento:'',aprobada:false,observaciones:'',evidencia:''}
const[form,setForm]=useState(FD);const Fv=(k,v)=>setForm(p=>({...p,[k]:v}))
const[toast,setToast]=useState(null);const showT=(m,t='success')=>{setToast({msg:m,type:t});setTimeout(()=>setToast(null),3000)}
async function save(){if(!form.descripcion){showT('Descripcion requerida','error');return};const p={...form,copropiedad_id:copropiedad.id,valor:Number(form.valor)||0};if(edit){await update(edit.id,p);showT('Actualizada')}else{await insert(p);showT('Registrada')};setShow(false);setEdit(null);setForm(FD)}
async function subirFoto(e,id){const file=e.target.files[0];if(!file)return;setSubiendo(true);const path=`cotizaciones/${id}/${Date.now()}.${file.name.split('.').pop()}`;await supabase.storage.from('geinser-fotos').upload(path,file,{upsert:true});const{data:u}=supabase.storage.from('geinser-fotos').getPublicUrl(path);await update(id,{evidencia:u.publicUrl});showT('Foto subida');setSubiendo(false);refetch()}
const cEst={Solicitada:'#3b82f6',Recibida:'#8b5cf6',EnEvaluacion:'#d97706',Aprobada:'#059669',Rechazada:'#dc2626',Vencida:'#6b7280'}
if(loading)return<div style={{padding:40,textAlign:'center',color:'#9ca3af'}}>Cargando...</div>
return(<div>
<div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:20}}><h2 style={{margin:0,fontSize:20,fontWeight:900,color:GD}}>Cotizaciones</h2><button onClick={()=>{setForm(FD);setEdit(null);setShow(true)}} style={{background:'#8b5cf6',color:'#fff',border:'none',borderRadius:12,padding:'9px 18px',fontWeight:800,cursor:'pointer',display:'flex',alignItems:'center',gap:6}}><Plus size={14}/>Nueva</button></div>
<div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(min(290px,100%),1fr))',gap:14}}>
{data.length===0&&<div style={{gridColumn:'1/-1',textAlign:'center',padding:48,color:'#9ca3af',background:'#fff',borderRadius:16,border:'1.5px solid #e5e7eb'}}><Search size={40} color="#e5e7eb" style={{margin:'0 auto 12px',display:'block'}}/><p>Sin cotizaciones</p></div>}
{data.map(ct=>(<div key={ct.id} style={{background:'#fff',border:`1.5px solid ${ct.aprobada?'#bbf7d0':'#e5e7eb'}`,borderRadius:14,padding:16}}>
<div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:8}}><div style={{display:'flex',gap:6,flexWrap:'wrap'}}><Bdg t={ct.tipo} color="#8b5cf6"/><Bdg t={ct.estado} color={cEst[ct.estado?.replace(' ','')]||'#3b82f6'}/>{ct.aprobada&&<Bdg t="✓ Aprobada" color="#059669" bg="#dcfce7"/>}</div><div style={{display:'flex',gap:4}}><button onClick={()=>{setForm({...FD,...ct,valor:String(ct.valor)});setEdit(ct);setShow(true)}} style={{background:'#f3f4f6',border:'none',borderRadius:6,padding:'3px 6px',cursor:'pointer'}}><Edit2 size={11}/></button><button onClick={()=>{if(window.confirm('Eliminar?'))remove(ct.id)}} style={{background:'#fef2f2',border:'none',borderRadius:6,padding:'3px 6px',cursor:'pointer',color:'#dc2626'}}><Trash2 size={11}/></button></div></div>
{ct.numero&&<div style={{fontSize:11,color:'#9ca3af',marginBottom:2}}>#{ct.numero}</div>}
<div style={{fontWeight:800,color:GD,fontSize:14,marginBottom:4}}>{ct.descripcion}</div>
{ct.solicitante&&<div style={{fontSize:12,color:'#6b7280',marginBottom:3}}>Solicitante: {ct.solicitante}</div>}
{ct.proveedor&&<div style={{fontSize:12,color:'#6b7280',marginBottom:6}}>Proveedor: <b>{ct.proveedor}</b></div>}
{ct.valor>0&&<div style={{fontSize:14,fontWeight:900,color:'#8b5cf6',marginBottom:6}}>{fmtM(ct.valor)}</div>}
{ct.evidencia&&<img src={ct.evidencia} alt="cot" style={{width:'100%',height:100,objectFit:'cover',borderRadius:8,marginBottom:8}}/>}
<div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginTop:4}}>
<span style={{fontSize:11,color:'#9ca3af'}}>{fmt(ct.fecha_solicitud)}</span>
<label style={{background:'#f5f3ff',borderRadius:7,padding:'4px 8px',cursor:'pointer',color:'#8b5cf6',display:'flex',alignItems:'center',gap:3,fontSize:10,fontWeight:700}}><Camera size={10}/>Foto<input type="file" accept="image/*" style={{display:'none'}} onChange={e=>subirFoto(e,ct.id)} disabled={subiendo}/></label>
</div>
{ct.observaciones&&<div style={{marginTop:7,background:'#f9fafb',borderRadius:7,padding:'5px 10px',fontSize:11,color:'#6b7280'}}>{ct.observaciones}</div>}
</div>))}
</div>
{show&&<Modal title={edit?'Editar':'Nueva cotizacion'} onClose={()=>{setShow(false);setEdit(null)}} wide>
<div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(180px,1fr))',gap:12}}>
<F label="Numero"><input style={inp} value={form.numero} onChange={e=>Fv('numero',e.target.value)} placeholder="COT-001"/></F>
<F label="Tipo"><select style={inp} value={form.tipo} onChange={e=>Fv('tipo',e.target.value)}><option>Reparacion</option><option>Mantenimiento</option><option>Obra</option><option>Servicio</option><option>Suministro</option><option>Otro</option></select></F>
<F label="Estado"><select style={inp} value={form.estado} onChange={e=>Fv('estado',e.target.value)}><option>Solicitada</option><option>Recibida</option><option>En Evaluacion</option><option>Aprobada</option><option>Rechazada</option><option>Vencida</option></select></F>
<F label="Solicitante"><input style={inp} value={form.solicitante} onChange={e=>Fv('solicitante',e.target.value)}/></F>
<F label="Proveedor"><input style={inp} value={form.proveedor} onChange={e=>Fv('proveedor',e.target.value)}/></F>
<F label="Valor ($)"><input style={inp} type="number" value={form.valor} onChange={e=>Fv('valor',e.target.value)}/></F>
<F label="Fecha solicitud"><input style={inp} type="date" value={form.fecha_solicitud} onChange={e=>Fv('fecha_solicitud',e.target.value)}/></F>
<F label="Fecha recepcion"><input style={inp} type="date" value={form.fecha_recepcion} onChange={e=>Fv('fecha_recepcion',e.target.value)}/></F>
<F label="Fecha vencimiento"><input style={inp} type="date" value={form.fecha_vencimiento} onChange={e=>Fv('fecha_vencimiento',e.target.value)}/></F>
<F label="Aprobada"><div style={{display:'flex',alignItems:'center',gap:8,paddingTop:6}}><input type="checkbox" checked={!!form.aprobada} onChange={e=>Fv('aprobada',e.target.checked)} style={{width:16,height:16}}/><span style={{fontSize:13}}>Si, fue aprobada</span></div></F>
<div style={{gridColumn:'1/-1'}}><F label="Descripcion" req><textarea style={{...inp,resize:'vertical',minHeight:60}} value={form.descripcion} onChange={e=>Fv('descripcion',e.target.value)}/></F></div>
<div style={{gridColumn:'1/-1'}}><F label="Observaciones"><textarea style={{...inp,resize:'vertical',minHeight:45}} value={form.observaciones} onChange={e=>Fv('observaciones',e.target.value)}/></F></div>
</div>
<div style={{display:'flex',gap:10,marginTop:8}}><button onClick={()=>{setShow(false);setEdit(null)}} style={{flex:1,background:'#f3f4f6',border:'none',borderRadius:10,padding:11,cursor:'pointer',fontWeight:700}}>Cancelar</button><button onClick={save} style={{flex:2,background:'#8b5cf6',color:'#fff',border:'none',borderRadius:10,padding:11,cursor:'pointer',fontWeight:800}}>{edit?'Guardar':'Registrar'}</button></div>
</Modal>}
{toast&&<Toast {...toast}/>}
</div>)
}
function ModuloBase({tabla,copropiedad,titulo,color,campos,FD,renderCard}){
const{data,loading,insert,update,remove,refetch}=useTable(tabla,{copropiedad_id:copropiedad.id})
const[show,setShow]=useState(false);const[edit,setEdit]=useState(null);const[form,setForm]=useState(FD);const[subiendo,setSubiendo]=useState(false)
const Fv=(k,v)=>setForm(p=>({...p,[k]:v}))
const[toast,setToast]=useState(null);const showT=(m,t='success')=>{setToast({msg:m,type:t});setTimeout(()=>setToast(null),3000)}
async function save(){const payload={...form,copropiedad_id:copropiedad.id};Object.keys(payload).forEach(k=>{if(['valor','monto_deuda','monto_recuperado','costo','progreso','valor_asegurado','costo_prima'].includes(k)&&payload[k]!=='')payload[k]=Number(payload[k]);if(k.includes('fecha')&&payload[k]==='')payload[k]=null});const res=edit?await update(edit.id,payload):await insert(payload);if(res?.error){showT('Error al guardar: '+res.error.message,'error');return}showT(edit?'Actualizado':'Registrado');setShow(false);setEdit(null);setForm(FD)}
async function subirFoto(e,id){const file=e.target.files[0];if(!file)return;setSubiendo(true);const path=`${tabla}/${id}/${Date.now()}.${file.name.split('.').pop()||'jpg'}`;const{error}=await supabase.storage.from('geinser-fotos').upload(path,file,{upsert:true});if(error){showT('Error subiendo foto: '+error.message,'error');setSubiendo(false);return};const{data:u}=supabase.storage.from('geinser-fotos').getPublicUrl(path);const res=await update(id,{evidencia:u.publicUrl});setSubiendo(false);if(res?.error){showT('Error guardando foto: '+res.error.message,'error');return}showT('Foto subida');refetch()}
if(loading)return<div style={{padding:40,textAlign:'center',color:'#9ca3af'}}>Cargando...</div>
return(<div><div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:20}}><h2 style={{margin:0,fontSize:20,fontWeight:900,color:GD}}>{titulo}</h2><button onClick={()=>{setForm(FD);setEdit(null);setShow(true)}} style={{background:color,color:'#fff',border:'none',borderRadius:12,padding:'9px 18px',fontWeight:800,cursor:'pointer',display:'flex',alignItems:'center',gap:6}}><Plus size={14}/>Nuevo</button></div>
<div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(min(280px,100%),1fr))',gap:14}}>{data.length===0&&<div style={{gridColumn:'1/-1',textAlign:'center',padding:40,color:'#9ca3af'}}><p>Sin registros</p></div>}{data.map(item=>renderCard(item,()=>{setForm(Object.fromEntries(Object.keys(FD).map(k=>[k,item[k]??FD[k]])));setEdit(item);setShow(true)},()=>{if(window.confirm('Eliminar?'))remove(item.id)},subirFoto,subiendo))}</div>
{show&&<Modal title={edit?'Editar':'Nuevo'} onClose={()=>{setShow(false);setEdit(null)}} wide><div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(180px,1fr))',gap:12}}>{campos.map(({key,label,type,options,full})=>(<div key={key} style={full?{gridColumn:'1/-1'}:{}}><F label={label}>{type==='select'?<select style={inp} value={form[key]||''} onChange={e=>Fv(key,e.target.value)}>{options.map(o=><option key={o}>{o}</option>)}</select>:type==='textarea'?<textarea style={{...inp,resize:'vertical',minHeight:55}} value={form[key]||''} onChange={e=>Fv(key,e.target.value)}/>:type==='checkbox'?<input type="checkbox" checked={!!form[key]} onChange={e=>Fv(key,e.target.checked)} style={{width:18,height:18}}/>:<input style={inp} type={type||'text'} value={form[key]||''} onChange={e=>Fv(key,e.target.value)}/>}</F></div>))}</div>
<div style={{display:'flex',gap:10,marginTop:8}}><button onClick={()=>{setShow(false);setEdit(null)}} style={{flex:1,background:'#f3f4f6',border:'none',borderRadius:10,padding:11,cursor:'pointer',fontWeight:700}}>Cancelar</button>{edit&&edit.evidencia&&<div style={{display:'flex',alignItems:'center',gap:10,margin:'6px 0',width:'100%'}}><img src={edit.evidencia} alt="" style={{width:70,height:52,objectFit:'cover',borderRadius:8}}/><button onClick={quitarEvidencia} style={{background:'#fef2f2',color:'#dc2626',border:'1.5px solid #fca5a5',borderRadius:8,padding:'7px 14px',cursor:'pointer',fontWeight:700,fontSize:12}}>Quitar foto actual</button></div>}
<button onClick={save} style={{flex:2,background:color,color:'#fff',border:'none',borderRadius:10,padding:11,cursor:'pointer',fontWeight:800}}>{edit?'Guardar':'Registrar'}</button></div>
</Modal>}{toast&&<Toast {...toast}/>}</div>)
}
function Contratos({copropiedad}){return<ModuloBase tabla="contratos" copropiedad={copropiedad} titulo="Contratos" color="#7c3aed" FD={{proveedor:'',servicio:'',valor:'',fecha_inicio:'',fecha_vencimiento:'',contacto:'',telefono:'',estado:'Activo',notas:'',evidencia:''}} campos={[{key:'proveedor',label:'Proveedor'},{key:'servicio',label:'Servicio'},{key:'valor',label:'Valor ($)',type:'number'},{key:'estado',label:'Estado',type:'select',options:['Activo','Vencido','Cancelado','En renovacion']},{key:'fecha_inicio',label:'Inicio',type:'date'},{key:'fecha_vencimiento',label:'Vencimiento',type:'date'},{key:'contacto',label:'Contacto'},{key:'telefono',label:'Telefono'},{key:'notas',label:'Notas',type:'textarea',full:true}]} renderCard={(i,onE,onD,subF,sub)=>{const d=daysTo(i.fecha_vencimiento);return(<div key={i.id} style={{background:'#fff',border:`1.5px solid ${d!==null&&d>=0&&d<=60?'#fca5a5':'#e5e7eb'}`,borderRadius:14,padding:16}}><div style={{display:'flex',justifyContent:'space-between',marginBottom:8}}><Bdg t={i.estado} color="#7c3aed"/>{d!==null&&d>=0&&d<=90&&<Bdg t={d+'d'} color="#dc2626"/>}</div><div style={{fontWeight:900,color:'#7c3aed'}}>{i.proveedor}</div><div style={{fontSize:12,color:GD,fontWeight:700,marginBottom:4}}>{i.servicio}</div><div style={{fontSize:11,color:'#6b7280',marginBottom:8}}>{fmtM(i.valor)}/mes · Vence {fmt(i.fecha_vencimiento)}</div>{i.evidencia&&<img src={i.evidencia} alt="foto" style={{width:'100%',height:100,objectFit:'cover',borderRadius:8,marginBottom:8}}/>}<div style={{display:'flex',gap:6}}><button onClick={onE} style={{flex:1,background:'#f3f4f6',border:'none',borderRadius:7,padding:6,cursor:'pointer',fontSize:11,fontWeight:700}}>Editar</button><label style={{background:'#f5f3ff',borderRadius:7,padding:'6px 9px',cursor:'pointer',color:'#7c3aed',display:'flex',alignItems:'center'}}><Camera size={12}/><input type="file" accept="image/*" style={{display:'none'}} onChange={e=>subF(e,i.id)} disabled={sub}/></label><button onClick={onD} style={{background:'#fef2f2',border:'none',borderRadius:7,padding:'6px 9px',cursor:'pointer',color:'#dc2626'}}><Trash2 size={12}/></button></div></div>)}}/>}
function Tareas({copropiedad,perfil}){
const cP={Alta:'#dc2626',Media:'#d97706',Baja:'#059669'}
const FD={titulo:'',descripcion:'',prioridad:'Media',estado:'Pendiente',progreso:0,fecha_limite:'',responsable:'',observaciones:'',comentarios:'',fecha_alerta:'',fotos:[],historial:[]}
const{data,loading,insert,update,remove,refetch}=useTable('tareas',{copropiedad_id:copropiedad.id})
const[show,setShow]=useState(false);const[det,setDet]=useState(null);const[edit,setEdit]=useState(null)
const[form,setForm]=useState(FD);const Fv=(k,v)=>setForm(p=>({...p,[k]:v}))
const[toast,setToast]=useState(null);const showT=(m,tp='success')=>{setToast({msg:m,type:tp});setTimeout(()=>setToast(null),4000)}
const[subiendo,setSubiendo]=useState(false);const[comentNuevo,setComentNuevo]=useState('');const[avRapido,setAvRapido]=useState(null)
const[filtro,setFiltro]=useState('activas')
const[showInfT,setShowInfT]=useState(false);const[tipoInfT,setTipoInfT]=useState('mes')
const hoyDT=new Date();const[mesInfT,setMesInfT]=useState(hoyDT.getMonth());const[anioInfT,setAnioInfT]=useState(hoyDT.getFullYear());const[generandoT,setGenerandoT]=useState(false)
async function generarInfCop(){setGenerandoT(true);try{await genInformePDF({copropiedades:[copropiedad],tareas:data,getDelegado:()=>perfil?.rol==='delegado'?perfil?.nombre:null,tipoInf:tipoInfT,mesInf:mesInfT,anioInf:anioInfT});setShowInfT(false)}catch(err){showT('Error PDF: '+err.message,'error')}setGenerandoT(false)}
const hoy=new Date();hoy.setHours(0,0,0,0)
const esVencida=t=>t.fecha_limite&&new Date(t.fecha_limite+'T00:00:00')<hoy&&t.estado!=='Completada'&&t.estado!=='Cancelada'
const stats={
  total:data.length,
  activas:data.filter(t=>t.estado!=='Completada'&&t.estado!=='Cancelada').length,
  vencidas:data.filter(esVencida).length,
  completadas:data.filter(t=>t.estado==='Completada').length,
  avance:data.length?Math.round(data.reduce((s,t)=>s+(Number(t.progreso)||0),0)/data.length):0
}
const dataF=data.filter(t=>{
  if(filtro==='todas')return true
  if(filtro==='activas')return t.estado!=='Completada'&&t.estado!=='Cancelada'
  if(filtro==='vencidas')return esVencida(t)
  if(filtro==='completadas')return t.estado==='Completada'
  return true
})
function armarHist(base,tipo,nota){return[...(Array.isArray(base)?base:[]),{fecha:new Date().toISOString(),tipo,usuario:perfil?.nombre||'Usuario',nota}]}
async function save(){
  if(!form.titulo){showT('El titulo es requerido','error');return}
  const payload={...form,copropiedad_id:copropiedad.id,progreso:Number(form.progreso)||0,fecha_limite:form.fecha_limite||null,fecha_alerta:form.fecha_alerta||null}
  const res=edit
    ?await update(edit.id,{...payload,historial:armarHist(edit.historial,'edicion','Tarea editada')})
    :await insert({...payload,historial:armarHist([],'creacion','Tarea creada')})
  if(res.error){showT('Error: '+res.error.message,'error');return}
  showT(edit?'Tarea actualizada':'Tarea registrada');setShow(false);setEdit(null);setForm(FD)
}
async function completar(t){
  const hist=armarHist(t.historial,'completada','Marcada como completada')
  const res=await update(t.id,{estado:'Completada',progreso:100,historial:hist})
  if(res.error){showT('Error: '+res.error.message,'error');return}
  showT('Tarea completada');if(det?.id===t.id)setDet(d=>({...d,estado:'Completada',progreso:100,historial:hist}))
}
async function setAvance(t,pct){
  pct=Math.max(0,Math.min(100,Number(pct)||0))
  const hist=armarHist(t.historial,'avance','Avance: '+pct+'%')
  const res=await update(t.id,{progreso:pct,historial:hist,estado:pct>=100?'Completada':(t.estado==='Pendiente'?'En progreso':t.estado)})
  if(res.error){showT('Error: '+res.error.message,'error');return}
  showT('Avance actualizado');if(det?.id===t.id)setDet(d=>({...d,progreso:pct,historial:hist}));setAvRapido(null)
}
async function addComentario(t){
  if(!comentNuevo.trim())return
  const hist=armarHist(t.historial,'comentario',comentNuevo.trim())
  const res=await update(t.id,{historial:hist})
  if(res.error){showT('Error: '+res.error.message,'error');return}
  showT('Comentario agregado');setComentNuevo('');if(det?.id===t.id)setDet(d=>({...d,historial:hist}))
}
async function delFoto(t,url){
if(!window.confirm('Eliminar esta foto?'))return
const fa=(Array.isArray(t.fotos)?t.fotos:[]).filter(f=>f!==url)
const hist=armarHist(t.historial,'foto','Foto eliminada')
const res=await update(t.id,{fotos:fa,historial:hist})
if(res.error){showT('Error: '+res.error.message,'error');return}
const path=decodeURIComponent((url.split('/geinser-fotos/')[1]||''))
if(path)supabase.storage.from('geinser-fotos').remove([path])
showT('Foto eliminada');if(det?.id===t.id)setDet(d=>({...d,fotos:fa,historial:hist}))
}
async function addFoto(e,t){
  const file=e.target.files[0];if(!file)return;setSubiendo(true)
  const path='tareas/'+t.id+'/'+Date.now()+'.'+(file.name.split('.').pop()||'jpg')
  const{error:eUp}=await supabase.storage.from('geinser-fotos').upload(path,file,{upsert:true})
  if(eUp){showT('Error subiendo foto: '+eUp.message,'error');setSubiendo(false);return}
  const{data:u}=supabase.storage.from('geinser-fotos').getPublicUrl(path)
  const fa=[...(Array.isArray(t.fotos)?t.fotos:[]),u.publicUrl]
  const hist=armarHist(t.historial,'foto','Foto de evidencia agregada')
  const res=await update(t.id,{fotos:fa,historial:hist})
  setSubiendo(false)
  if(res.error){showT('Error guardando foto: '+res.error.message,'error');return}
  showT('Foto guardada');if(det?.id===t.id)setDet(d=>({...d,fotos:fa,historial:hist}))
}
const cE={Pendiente:'#6b7280','En progreso':GB,Completada:'#059669',Cancelada:'#dc2626'}
const ic={creacion:'🆕',edicion:'✏️',avance:'📈',comentario:'💬',foto:'📷',completada:'✅'}
const chips=[['activas','Activas ('+stats.activas+')'],['vencidas','Vencidas ('+stats.vencidas+')'],['completadas','Completadas ('+stats.completadas+')'],['todas','Todas ('+stats.total+')']]
if(loading)return<div style={{padding:40,textAlign:'center',color:'#9ca3af'}}>Cargando...</div>
return(<div>
<div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:14,flexWrap:'wrap',gap:10}}>
<h2 style={{margin:0,fontSize:20,fontWeight:900,color:GD}}>Tareas</h2>
<div style={{display:'flex',gap:8}}>
<button onClick={()=>setShowInfT(true)} style={{background:'#fff',color:GD,border:'1.5px solid '+GD,borderRadius:12,padding:'9px 14px',fontWeight:800,cursor:'pointer',fontSize:12}}>📄 Informe</button>
<button onClick={()=>{setForm(FD);setEdit(null);setShow(true)}} style={{background:GB,color:'#fff',border:'none',borderRadius:12,padding:'9px 18px',fontWeight:800,cursor:'pointer',display:'flex',alignItems:'center',gap:6}}><Plus size={14}/>Nueva tarea</button>
</div>
</div>
<div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(110px,1fr))',gap:8,marginBottom:14}}>
<div style={{background:'#fff',border:'1.5px solid #e5e7eb',borderRadius:12,padding:'10px 14px'}}><div style={{fontSize:22,fontWeight:900,color:GB}}>{stats.activas}</div><div style={{fontSize:11,color:'#6b7280',fontWeight:700}}>ACTIVAS</div></div>
<div style={{background:'#fff',border:'1.5px solid '+(stats.vencidas>0?'#fca5a5':'#e5e7eb'),borderRadius:12,padding:'10px 14px'}}><div style={{fontSize:22,fontWeight:900,color:stats.vencidas>0?'#dc2626':'#9ca3af'}}>{stats.vencidas}</div><div style={{fontSize:11,color:'#6b7280',fontWeight:700}}>VENCIDAS</div></div>
<div style={{background:'#fff',border:'1.5px solid #e5e7eb',borderRadius:12,padding:'10px 14px'}}><div style={{fontSize:22,fontWeight:900,color:'#059669'}}>{stats.completadas}</div><div style={{fontSize:11,color:'#6b7280',fontWeight:700}}>COMPLETADAS</div></div>
<div style={{background:'#fff',border:'1.5px solid #e5e7eb',borderRadius:12,padding:'10px 14px'}}><div style={{fontSize:22,fontWeight:900,color:GD}}>{stats.avance}%</div><div style={{fontSize:11,color:'#6b7280',fontWeight:700}}>AVANCE PROM.</div></div>
</div>
<div style={{display:'flex',gap:6,marginBottom:16,flexWrap:'wrap'}}>
{chips.map(([k,l])=><button key={k} onClick={()=>setFiltro(k)} style={{background:filtro===k?GB:'#fff',color:filtro===k?'#fff':'#6b7280',border:'1.5px solid '+(filtro===k?GB:'#e5e7eb'),borderRadius:99,padding:'5px 14px',cursor:'pointer',fontSize:12,fontWeight:700}}>{l}</button>)}
</div>
{dataF.length===0&&<div style={{textAlign:'center',padding:50,color:'#9ca3af',background:'#fff',borderRadius:14,border:'1.5px dashed #e5e7eb'}}><p style={{margin:0}}>{filtro==='activas'?'No hay tareas activas':'Sin tareas en este filtro'}</p></div>}
<div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(min(300px,100%),1fr))',gap:14}}>
{dataF.map(t=>{const dias=daysTo(t.fecha_limite);const venc=esVencida(t);const prox=t.fecha_limite&&dias!==null&&dias>=0&&dias<=3&&t.estado!=='Completada';const fotos=Array.isArray(t.fotos)?t.fotos:[];return(<div key={t.id} style={{background:'#fff',border:'1.5px solid '+(venc?'#fca5a5':prox?'#fde68a':'#e5e7eb'),borderRadius:14,padding:16,cursor:'pointer',boxShadow:'0 1px 3px rgba(0,0,0,0.04)'}} onClick={()=>setDet(t)}>
<div style={{display:'flex',justifyContent:'space-between',marginBottom:8}}><Bdg t={t.prioridad} color={cP[t.prioridad]||'#888'}/><Bdg t={t.estado} color={cE[t.estado]||'#888'}/></div>
<div style={{fontWeight:900,color:GD,marginBottom:4}}>{t.titulo}</div>
{t.descripcion&&<div style={{fontSize:12,color:'#6b7280',marginBottom:6,display:'-webkit-box',WebkitLineClamp:2,WebkitBoxOrient:'vertical',overflow:'hidden'}}>{t.descripcion}</div>}
<div style={{marginBottom:8}}><div style={{display:'flex',justifyContent:'space-between',marginBottom:3}}><span style={{fontSize:11,color:'#6b7280'}}>Avance</span><span style={{fontSize:11,fontWeight:700,color:GB}}>{t.progreso||0}%</span></div><div style={{background:'#e5e7eb',borderRadius:99,height:6}}><div style={{background:t.estado==='Completada'?'#059669':GB,borderRadius:99,height:6,width:(t.progreso||0)+'%'}}/></div></div>
<div style={{display:'flex',justifyContent:'space-between',fontSize:11,color:'#9ca3af',marginBottom:8}}><span>{t.responsable||'Sin asignar'}</span>{t.fecha_limite&&<span style={{color:venc?'#dc2626':prox?'#d97706':'inherit',fontWeight:venc||prox?700:400}}>{venc?'Venció hace '+Math.abs(dias)+'d':prox?'Vence en '+dias+'d':fmt(t.fecha_limite)}</span>}</div>
{fotos.length>0&&<div style={{display:'flex',gap:4,marginBottom:8}}>{fotos.slice(0,3).map((f,i)=><img key={i} src={f} alt="" style={{width:48,height:36,objectFit:'cover',borderRadius:5}}/>)}{fotos.length>3&&<div style={{width:48,height:36,background:'#f3f4f6',borderRadius:5,display:'flex',alignItems:'center',justifyContent:'center',fontSize:10,color:'#6b7280'}}>+{fotos.length-3}</div>}</div>}
<div style={{display:'flex',gap:5}} onClick={e=>e.stopPropagation()}>
{t.estado!=='Completada'&&<button onClick={()=>completar(t)} style={{background:'#f0fdf4',border:'none',borderRadius:7,padding:'5px 8px',cursor:'pointer',color:'#059669',fontSize:11,fontWeight:700}}>Completar</button>}
<button onClick={()=>{setForm(Object.fromEntries(Object.keys(FD).map(k=>[k,t[k]??FD[k]])));setEdit(t);setShow(true)}} style={{background:'#f3f4f6',border:'none',borderRadius:7,padding:'5px 8px',cursor:'pointer',fontSize:11,fontWeight:700}}>Editar</button>
<label style={{background:'#e8f4fd',borderRadius:7,padding:'5px 8px',cursor:'pointer',color:GB,display:'flex',alignItems:'center'}}><Camera size={12}/><input type="file" accept="image/*" style={{display:'none'}} onChange={e=>addFoto(e,t)} disabled={subiendo}/></label>
<button onClick={e=>{if(window.confirm('Eliminar esta tarea?'))remove(t.id)}} style={{background:'#fef2f2',border:'none',borderRadius:7,padding:'5px 8px',cursor:'pointer',color:'#dc2626'}}><Trash2 size={12}/></button>
</div></div>)})}
</div>
{det&&<Modal title={det.titulo} onClose={()=>{setDet(null);setComentNuevo('')}}>
<div style={{display:'flex',gap:6,marginBottom:14,flexWrap:'wrap'}}><Bdg t={det.prioridad} color={cP[det.prioridad]||'#888'}/><Bdg t={det.estado} color={cE[det.estado]||'#888'}/>{det.responsable&&<Bdg t={det.responsable} color="#6b7280"/>}{det.fecha_alerta&&<Bdg t={'Alerta: '+fmt(det.fecha_alerta)} color="#d97706"/>}</div>
{det.descripcion&&<div style={{background:'#f9fafb',borderRadius:10,padding:12,marginBottom:12,fontSize:13,color:GD}}>{det.descripcion}</div>}
<div style={{marginBottom:14}}><div style={{display:'flex',justifyContent:'space-between',marginBottom:4}}><span style={{fontSize:13,fontWeight:700,color:GD}}>Avance</span><span style={{fontWeight:900,color:GB,fontSize:14}}>{det.progreso||0}%</span></div><div style={{background:'#e5e7eb',borderRadius:99,height:8,marginBottom:8}}><div style={{background:det.estado==='Completada'?'#059669':GB,borderRadius:99,height:8,width:(det.progreso||0)+'%',transition:'width .3s'}}/></div>
{det.estado!=='Completada'&&(avRapido===det.id?<div style={{display:'flex',gap:5,alignItems:'center',flexWrap:'wrap'}}>{[25,50,75,100].map(p=><button key={p} onClick={()=>setAvance(det,p)} style={{flex:1,minWidth:48,background:GB,color:'#fff',border:'none',borderRadius:7,padding:6,cursor:'pointer',fontSize:12,fontWeight:700}}>{p}%</button>)}<input type="number" min="0" max="100" defaultValue={det.progreso||0} onBlur={e=>setAvance(det,e.target.value)} style={{...inp,width:60,textAlign:'center'}}/><button onClick={()=>setAvRapido(null)} style={{background:'#f3f4f6',border:'none',borderRadius:7,padding:'5px 8px',cursor:'pointer'}}>x</button></div>:<button onClick={()=>setAvRapido(det.id)} style={{width:'100%',background:'#f0f7ff',border:'1.5px solid #bfdbfe',borderRadius:8,padding:7,cursor:'pointer',color:GB,fontWeight:700,fontSize:12}}>Actualizar avance</button>)}</div>
{det.observaciones&&<div style={{marginBottom:12}}><div style={{fontSize:11,fontWeight:700,color:'#6b7280',marginBottom:4}}>OBSERVACIONES</div><div style={{background:'#fffbeb',borderRadius:8,padding:10,fontSize:13}}>{det.observaciones}</div></div>}
{Array.isArray(det.fotos)&&det.fotos.length>0&&<div style={{marginBottom:14}}><div style={{fontSize:11,fontWeight:700,color:'#6b7280',marginBottom:6}}>FOTOS ({det.fotos.length})</div><div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(80px,1fr))',gap:5}}>{det.fotos.map((f,i)=><div key={i} style={{position:'relative'}}><a href={f} target="_blank" rel="noreferrer"><img src={f} alt="" style={{width:'100%',height:65,objectFit:'cover',borderRadius:7,display:'block'}}/></a><button onClick={()=>delFoto(det,f)} style={{position:'absolute',top:2,right:2,background:'rgba(220,38,38,0.9)',color:'#fff',border:'none',borderRadius:'50%',width:18,height:18,fontSize:11,lineHeight:'16px',cursor:'pointer',padding:0}}>×</button></div>)}</div></div>}
<div style={{marginBottom:14}}><div style={{fontSize:11,fontWeight:700,color:'#6b7280',marginBottom:6}}>COMENTARIO / NOVEDAD</div><textarea value={comentNuevo} onChange={e=>setComentNuevo(e.target.value)} style={{...inp,resize:'vertical',minHeight:55,marginBottom:5}} placeholder="Escribe una novedad, comentario o avance..."/><div style={{display:'flex',gap:8}}><button onClick={()=>addComentario(det)} disabled={!comentNuevo.trim()} style={{flex:1,background:comentNuevo.trim()?GB:'#9ca3af',color:'#fff',border:'none',borderRadius:8,padding:'7px 0',cursor:comentNuevo.trim()?'pointer':'not-allowed',fontWeight:700,fontSize:13}}>Guardar comentario</button><label style={{display:'flex',alignItems:'center',gap:5,background:'#e8f4fd',borderRadius:8,padding:'7px 12px',cursor:'pointer',color:GB,fontWeight:700,fontSize:13}}><Camera size={13}/>Foto<input type="file" accept="image/*" style={{display:'none'}} onChange={e=>addFoto(e,det)} disabled={subiendo}/></label></div>{subiendo&&<div style={{marginTop:6,fontSize:12,color:GB}}>Subiendo foto...</div>}</div>
{Array.isArray(det.historial)&&det.historial.length>0&&<div style={{marginBottom:14}}><div style={{fontSize:11,fontWeight:700,color:'#6b7280',marginBottom:6}}>HISTORIAL DE GESTION</div><div style={{maxHeight:180,overflowY:'auto',display:'flex',flexDirection:'column',gap:4}}>{[...det.historial].reverse().map((h,i)=><div key={i} style={{display:'flex',gap:7,padding:'5px 9px',background:'#f9fafb',borderRadius:7,fontSize:12}}><span>{ic[h.tipo]||'📌'}</span><div><div style={{color:GD,fontWeight:600}}>{h.nota}</div><div style={{color:'#9ca3af',fontSize:10}}>{h.usuario} · {new Date(h.fecha).toLocaleDateString('es-CO',{day:'2-digit',month:'short',hour:'2-digit',minute:'2-digit'})}</div></div></div>)}</div></div>}
<div style={{display:'flex',gap:8,paddingTop:12,borderTop:'1px solid #e5e7eb'}}>{det.estado!=='Completada'&&<button onClick={()=>completar(det)} style={{flex:1,background:'#059669',color:'#fff',border:'none',borderRadius:8,padding:10,cursor:'pointer',fontWeight:800}}>Marcar completada</button>}<button onClick={()=>{setDet(null);setForm(Object.fromEntries(Object.keys(FD).map(k=>[k,det[k]??FD[k]])));setEdit(det);setShow(true)}} style={{flex:1,background:'#f3f4f6',border:'none',borderRadius:8,padding:10,cursor:'pointer',fontWeight:700}}>Editar</button></div>
</Modal>}
{show&&<Modal title={edit?'Editar tarea':'Nueva tarea'} onClose={()=>{setShow(false);setEdit(null);setForm(FD)}}>
<F label="Titulo" req><input style={inp} value={form.titulo} onChange={e=>Fv('titulo',e.target.value)} placeholder="Titulo de la tarea"/></F>
<F label="Descripcion"><textarea style={{...inp,resize:'vertical',minHeight:65}} value={form.descripcion} onChange={e=>Fv('descripcion',e.target.value)} placeholder="Detalle de lo que se debe hacer..."/></F>
<div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:10}}>
<F label="Prioridad"><select style={inp} value={form.prioridad} onChange={e=>Fv('prioridad',e.target.value)}>{['Alta','Media','Baja'].map(o=><option key={o}>{o}</option>)}</select></F>
<F label="Estado"><select style={inp} value={form.estado} onChange={e=>Fv('estado',e.target.value)}>{['Pendiente','En progreso','Completada','Cancelada'].map(o=><option key={o}>{o}</option>)}</select></F>
<F label="Avance (%)"><input style={inp} type="number" min="0" max="100" value={form.progreso} onChange={e=>Fv('progreso',e.target.value)}/></F>
<F label="Responsable"><input style={inp} value={form.responsable} onChange={e=>Fv('responsable',e.target.value)} placeholder="Nombre"/></F>
<F label="Fecha limite"><input style={inp} type="date" value={form.fecha_limite||''} onChange={e=>Fv('fecha_limite',e.target.value)}/></F>
<F label="Fecha alerta"><input style={inp} type="date" value={form.fecha_alerta||''} onChange={e=>Fv('fecha_alerta',e.target.value)}/></F>
</div>
<F label="Observaciones"><textarea style={{...inp,resize:'vertical',minHeight:55}} value={form.observaciones||''} onChange={e=>Fv('observaciones',e.target.value)} placeholder="Contexto, condiciones, antecedentes..."/></F>
<button onClick={save} style={{width:'100%',background:GB,color:'#fff',border:'none',borderRadius:10,padding:11,fontWeight:800,cursor:'pointer',marginTop:4}}>{edit?'Guardar cambios':'Crear tarea'}</button>
</Modal>}
{toast&&<Toast msg={toast.msg} type={toast.type}/>}
</div>)
}
function Mantenimiento({copropiedad}){return<ModuloBase tabla="mantenimientos" copropiedad={copropiedad} titulo="Mantenimiento" color="#059669" FD={{area:'',proveedor:'',periodicidad:'Mensual',ultima_fecha:'',proxima_fecha:'',costo:'',estado:'Programado',notas:'',evidencia:''}} campos={[{key:'area',label:'Area / Sistema'},{key:'proveedor',label:'Proveedor'},{key:'periodicidad',label:'Periodicidad',type:'select',options:['Mensual','Bimestral','Trimestral','Semestral','Anual','Unico']},{key:'estado',label:'Estado',type:'select',options:['Programado','Ejecutado','Vencido','Cancelado']},{key:'ultima_fecha',label:'Ultima fecha',type:'date'},{key:'proxima_fecha',label:'Proxima fecha',type:'date'},{key:'costo',label:'Costo ($)',type:'number'},{key:'notas',label:'Notas',type:'textarea',full:true}]} renderCard={(i,onE,onD,subF,sub)=>{const d=daysTo(i.proxima_fecha);return(<div key={i.id} style={{background:'#fff',border:'1.5px solid #e5e7eb',borderRadius:14,padding:16}}><div style={{display:'flex',justifyContent:'space-between',marginBottom:8}}><Bdg t={i.estado} color="#059669"/>{d!==null&&d>=0&&d<=7&&<Bdg t={d+'d'} color="#d97706"/>}</div><div style={{fontWeight:900,color:GD}}>{i.area}</div><div style={{fontSize:12,color:'#6b7280',marginBottom:4}}>{i.proveedor||'Sin proveedor'} · {i.periodicidad}</div><div style={{fontSize:11,color:'#6b7280',marginBottom:8}}>Proxima: {fmt(i.proxima_fecha)} · {fmtM(i.costo)}</div>{i.evidencia&&<img src={i.evidencia} alt="foto" style={{width:'100%',height:100,objectFit:'cover',borderRadius:8,marginBottom:8}}/>}<div style={{display:'flex',gap:6}}><button onClick={onE} style={{flex:1,background:'#f3f4f6',border:'none',borderRadius:7,padding:6,cursor:'pointer',fontSize:11,fontWeight:700}}>Editar</button><label style={{background:'#dcfce7',borderRadius:7,padding:'6px 9px',cursor:'pointer',color:'#059669',display:'flex',alignItems:'center'}}><Camera size={12}/><input type="file" accept="image/*" style={{display:'none'}} onChange={e=>subF(e,i.id)} disabled={sub}/></label><button onClick={onD} style={{background:'#fef2f2',border:'none',borderRadius:7,padding:'6px 9px',cursor:'pointer',color:'#dc2626'}}><Trash2 size={12}/></button></div></div>)}}/>}
function Cartera({copropiedad}){return<ModuloBase tabla="cartera" copropiedad={copropiedad} titulo="Cartera" color="#dc2626" FD={{concepto:'',deudor:'',unidad:'',monto_deuda:'',monto_recuperado:'',fecha_mora:'',estado:'En mora',accion:'',notas:'',evidencia:''}} campos={[{key:'concepto',label:'Concepto'},{key:'deudor',label:'Deudor'},{key:'unidad',label:'Unidad'},{key:'estado',label:'Estado',type:'select',options:['En mora','En acuerdo','Recuperado','Juridico','Castigado']},{key:'monto_deuda',label:'Deuda ($)',type:'number'},{key:'monto_recuperado',label:'Recuperado ($)',type:'number'},{key:'fecha_mora',label:'Fecha mora',type:'date'},{key:'accion',label:'Accion tomada'},{key:'notas',label:'Notas',type:'textarea',full:true}]} renderCard={(i,onE,onD,subF,sub)=>(<div key={i.id} style={{background:'#fff',border:'1.5px solid #fecaca',borderRadius:14,padding:16}}><div style={{display:'flex',justifyContent:'space-between',marginBottom:8}}><Bdg t={i.estado} color="#dc2626"/><span style={{fontSize:11,fontWeight:700,color:'#dc2626'}}>{fmtM(i.monto_deuda)}</span></div><div style={{fontWeight:900,color:GD}}>{i.concepto}</div><div style={{fontSize:12,color:'#6b7280',marginBottom:4}}>{i.deudor||'—'}{i.unidad?' · '+i.unidad:''}</div>{i.monto_recuperado>0&&<div style={{fontSize:11,color:'#059669',marginBottom:4}}>Recuperado: {fmtM(i.monto_recuperado)}</div>}{i.evidencia&&<img src={i.evidencia} alt="foto" style={{width:'100%',height:100,objectFit:'cover',borderRadius:8,marginBottom:8}}/>}<div style={{display:'flex',gap:6}}><button onClick={onE} style={{flex:1,background:'#f3f4f6',border:'none',borderRadius:7,padding:6,cursor:'pointer',fontSize:11,fontWeight:700}}>Editar</button><label style={{background:'#fef2f2',borderRadius:7,padding:'6px 9px',cursor:'pointer',color:'#dc2626',display:'flex',alignItems:'center'}}><Camera size={12}/><input type="file" accept="image/*" style={{display:'none'}} onChange={e=>subF(e,i.id)} disabled={sub}/></label><button onClick={onD} style={{background:'#fef2f2',border:'none',borderRadius:7,padding:'6px 9px',cursor:'pointer',color:'#dc2626'}}><Trash2 size={12}/></button></div></div>)}/>}
function SGSST({copropiedad}){return<ModuloBase tabla="sgsst" copropiedad={copropiedad} titulo="SG-SST" color="#0891b2" FD={{actividad:'',fecha_programada:'',fecha_ejecutada:'',responsable:'',completada:false,evidencia:'',observaciones:''}} campos={[{key:'actividad',label:'Actividad',full:true},{key:'responsable',label:'Responsable'},{key:'fecha_programada',label:'Programada',type:'date'},{key:'fecha_ejecutada',label:'Ejecutada',type:'date'},{key:'completada',label:'Completada',type:'checkbox'},{key:'observaciones',label:'Observaciones',type:'textarea',full:true}]} renderCard={(i,onE,onD,subF,sub)=>(<div key={i.id} style={{background:'#fff',border:'1.5px solid #e0f2fe',borderRadius:14,padding:16}}><div style={{display:'flex',justifyContent:'space-between',marginBottom:8}}><Bdg t={i.completada?'Ejecutada':'Pendiente'} color={i.completada?'#059669':'#0369a1'}/></div><div style={{fontWeight:900,color:GD,marginBottom:4}}>{i.actividad}</div><div style={{fontSize:11,color:'#6b7280',marginBottom:4}}>Programada: {fmt(i.fecha_programada)}</div>{i.responsable&&<div style={{fontSize:11,color:'#6b7280',marginBottom:6}}>Responsable: {i.responsable}</div>}{i.evidencia&&<img src={i.evidencia} alt="ev" style={{width:'100%',height:90,objectFit:'cover',borderRadius:8,marginBottom:6}}/>}<div style={{display:'flex',gap:6}}><button onClick={onE} style={{flex:1,background:'#f3f4f6',border:'none',borderRadius:7,padding:6,cursor:'pointer',fontSize:11,fontWeight:700}}>Editar</button><label style={{background:'#e0f2fe',borderRadius:7,padding:'6px 9px',cursor:'pointer',color:'#0891b2',display:'flex',alignItems:'center'}}><Camera size={12}/><input type="file" accept="image/*" style={{display:'none'}} onChange={e=>subF(e,i.id)} disabled={sub}/></label><button onClick={onD} style={{background:'#fef2f2',border:'none',borderRadius:7,padding:'6px 9px',cursor:'pointer',color:'#dc2626'}}><Trash2 size={12}/></button></div></div>)}/>}
function Polizas({copropiedad}){
const fmtP=v=>{const n=Number(v)||0;return '$'+n.toLocaleString('es-CO')}
return<ModuloBase tabla="polizas" copropiedad={copropiedad} titulo="Polizas" color="#0891b2" FD={{aseguradora:'',numero_poliza:'',inicio_vigencia:'',fin_vigencia:'',valor_asegurado:'',costo_prima:'',observaciones:'',evidencia:''}} campos={[{key:'aseguradora',label:'Aseguradora',full:true},{key:'numero_poliza',label:'Numero de poliza'},{key:'inicio_vigencia',label:'Inicio de vigencia',type:'date'},{key:'fin_vigencia',label:'Fin de vigencia',type:'date'},{key:'valor_asegurado',label:'Valor asegurado ($)',type:'number'},{key:'costo_prima',label:'Costo de la prima ($)',type:'number'},{key:'observaciones',label:'Observaciones',type:'textarea',full:true}]} renderCard={(i,onE,onD,subF,sub)=>{const d=daysTo(i.fin_vigencia);const venc=d!==null&&d<0;const prox=d!==null&&d>=0&&d<=90;return(<div key={i.id} style={{background:'#fff',border:'1.5px solid '+(venc?'#fca5a5':prox?'#fde68a':'#e5e7eb'),borderRadius:14,padding:16}}>
<div style={{display:'flex',justifyContent:'space-between',marginBottom:8}}><Bdg t="Zonas comunes" color="#0891b2"/>{venc?<Bdg t="VENCIDA" color="#dc2626"/>:prox?<Bdg t={'Vence en '+d+'d'} color="#d97706"/>:i.fin_vigencia?<Bdg t="Vigente" color="#059669"/>:null}</div>
<div style={{fontWeight:900,color:GD,marginBottom:2}}>{i.aseguradora||'Sin aseguradora'}</div>
<div style={{fontSize:11,color:'#9ca3af',marginBottom:8}}>Poliza No. {i.numero_poliza||'-'}</div>
<div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:6,marginBottom:8,fontSize:11}}>
<div style={{background:'#f9fafb',borderRadius:8,padding:'6px 8px'}}><div style={{color:'#9ca3af',fontSize:9,fontWeight:700}}>VIGENCIA</div><div style={{color:GD,fontWeight:700}}>{i.inicio_vigencia?fmt(i.inicio_vigencia):'-'} a {i.fin_vigencia?fmt(i.fin_vigencia):'-'}</div></div>
<div style={{background:'#f9fafb',borderRadius:8,padding:'6px 8px'}}><div style={{color:'#9ca3af',fontSize:9,fontWeight:700}}>VALOR ASEGURADO</div><div style={{color:GD,fontWeight:700}}>{fmtP(i.valor_asegurado)}</div></div>
<div style={{background:'#f0f7ff',borderRadius:8,padding:'6px 8px',gridColumn:'1/-1'}}><div style={{color:'#9ca3af',fontSize:9,fontWeight:700}}>PRIMA</div><div style={{color:GB,fontWeight:900}}>{fmtP(i.costo_prima)}</div></div>
</div>
{i.observaciones&&<div style={{fontSize:11,color:'#6b7280',marginBottom:8}}>{i.observaciones}</div>}
{i.evidencia&&<img src={i.evidencia} alt="poliza" style={{width:'100%',height:80,objectFit:'cover',borderRadius:8,marginBottom:8}}/>}
<div style={{display:'flex',gap:6}}>
<button onClick={onE} style={{flex:1,background:'#f3f4f6',border:'none',borderRadius:7,padding:6,cursor:'pointer',fontSize:11,fontWeight:700}}>Editar</button>
<label style={{background:'#e8f4fd',borderRadius:7,padding:'6px 9px',cursor:'pointer',color:GB,display:'flex',alignItems:'center'}}><Camera size={12}/><input type="file" accept="image/*" style={{display:'none'}} onChange={e=>subF(e,i.id)} disabled={sub}/></label>
<button onClick={onD} style={{background:'#fef2f2',border:'none',borderRadius:7,padding:'6px 9px',cursor:'pointer',color:'#dc2626'}}><Trash2 size={12}/></button>
</div></div>)}}/>}

function Alertas(){
const[alerts,setAlerts]=useState([]);const[loading,setLoading]=useState(true)
useEffect(()=>{Promise.all([supabase.from('contratos').select('*,copropiedades(nombre)'),supabase.from('tareas').select('*,copropiedades(nombre)'),supabase.from('mantenimientos').select('*,copropiedades(nombre)'),supabase.from('cartera').select('*,copropiedades(nombre)'),supabase.from('pqrs').select('*,copropiedades(nombre)'),supabase.from('polizas').select('*,copropiedades(nombre)')]).then(([c,t,m,k,p,pz])=>{const a=[]
;(c.data||[]).forEach(x=>{const d=daysTo(x.fecha_vencimiento);if(d!==null&&d>=0&&d<=90)a.push({tipo:'Contrato',icono:'📄',color:'#dc2626',msg:x.proveedor+' — '+x.servicio,sub:'Vence en '+d+'d · '+(x.copropiedades?.nombre||''),u:d<=15?3:d<=45?2:1})})
;(pz?.data||[]).forEach(x=>{const d=daysTo(x.fin_vigencia);if(d!==null&&d>=0&&d<=90)a.push({tipo:'Poliza',icono:'🛡️',color:'#0891b2',msg:'Poliza '+(x.aseguradora||'')+' '+(x.numero_poliza||''),sub:'Vence en '+d+'d · '+(x.copropiedades?.nombre||''),u:d<=15?3:d<=45?2:1})})
;(t.data||[]).forEach(x=>{const d=daysTo(x.fecha_limite);if(d!==null&&d<=0&&x.estado!=='Completada')a.push({tipo:'Tarea vencida',icono:'⚠️',color:'#b91c1c',msg:x.titulo,sub:'Vencio hace '+Math.abs(d)+'d · '+(x.copropiedades?.nombre||''),u:3})})
;(m.data||[]).forEach(x=>{const d=daysTo(x.proxima_fecha);if(d!==null&&d>=0&&d<=15)a.push({tipo:'Mantenimiento',icono:'🔧',color:'#d97706',msg:x.area+' — '+(x.proveedor||''),sub:'En '+d+'d · '+(x.copropiedades?.nombre||''),u:d<=3?3:2})})
;(k.data||[]).forEach(x=>{if(x.estado==='En mora'&&Number(x.monto_deuda)>0)a.push({tipo:'Cartera mora',icono:'💰',color:'#7c3aed',msg:x.concepto+' — '+(x.deudor||''),sub:'Deuda: '+fmtM(x.monto_deuda)+' · '+(x.copropiedades?.nombre||''),u:2})})
;(p.data||[]).filter(x=>x.estado!=='Cerrada').forEach(x=>a.push({tipo:'PQR '+x.tipo,icono:'📋',color:'#3b82f6',msg:(x.descripcion||'').slice(0,60),sub:(x.nombre_solicitante||'Anonimo')+' · '+(x.copropiedades?.nombre||''),u:x.prioridad==='Urgente'?3:x.prioridad==='Alta'?2:1}))
a.sort((x,y)=>y.u-x.u);setAlerts(a);setLoading(false)})},[])
if(loading)return<div style={{padding:40,textAlign:'center',color:'#9ca3af'}}>Cargando...</div>
return(<div><div style={{display:'flex',alignItems:'center',gap:10,marginBottom:20}}><h2 style={{margin:0,fontSize:20,fontWeight:900,color:GD}}>Alertas</h2><span style={{background:alerts.length>0?'#dc2626':'#059669',color:'#fff',borderRadius:99,padding:'2px 10px',fontSize:12,fontWeight:800}}>{alerts.length}</span></div>
{alerts.length===0&&<div style={{textAlign:'center',padding:60,color:'#9ca3af',background:'#fff',borderRadius:16,border:'1.5px solid #e5e7eb'}}><Bell size={48} color="#e5e7eb" style={{margin:'0 auto 16px',display:'block'}}/><p style={{fontSize:16}}>Sin alertas ✓</p></div>}
<div style={{display:'grid',gap:10}}>{alerts.map((a,i)=>(<div key={i} style={{background:a.color+'09',border:`1.5px solid ${a.color}30`,borderLeft:`4px solid ${a.color}`,borderRadius:12,padding:'13px 16px',display:'flex',alignItems:'flex-start',gap:12}}><span style={{fontSize:20,flexShrink:0}}>{a.icono}</span><div style={{flex:1,minWidth:0}}><div style={{display:'flex',alignItems:'center',gap:8,marginBottom:3,flexWrap:'wrap'}}><Bdg t={a.tipo} color={a.color}/>{a.u===3&&<Bdg t="URGENTE" color="#dc2626" bg="#dc2626"/>}</div><div style={{fontWeight:800,color:GD,fontSize:13,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{a.msg}</div><div style={{fontSize:12,color:'#6b7280',marginTop:2}}>{a.sub}</div></div></div>))}</div>
</div>)
}
function DelegadosPanel(){
const{data:perfiles,loading,refetch}=useTable('perfiles');const{data:cops}=useTable('copropiedades')
const delegados=perfiles.filter(p=>p.rol==='delegado')
const[show,setShow]=useState(false);const[form,setForm]=useState({nombre:'',email:'',password:'',telefono:'',copropiedad_id:''});const[saving,setSaving]=useState(false)
const[toast,setToast]=useState(null);const showT=(m,t='success')=>{setToast({msg:m,type:t});setTimeout(()=>setToast(null),4000)}
async function crearDelegado(){if(!form.nombre||!form.email||!form.password){showT('Nombre, correo y contrasena requeridos','error');return};setSaving(true)
try{const{data,error}=await supabase.rpc('crear_delegado',{p_email:form.email,p_password:form.password,p_nombre:form.nombre,p_telefono:form.telefono||''});if(error)throw error;if(form.copropiedad_id)await supabase.from('copropiedades').update({delegado_id:data.id}).eq('id',form.copropiedad_id);showT('Delegado creado');setShow(false);setForm({nombre:'',email:'',password:'',telefono:'',copropiedad_id:''});refetch()}catch(e){showT('Error: '+e.message,'error')};setSaving(false)}
if(loading)return<div style={{padding:40,textAlign:'center',color:'#9ca3af'}}>Cargando...</div>
return(<div><div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:20}}><h2 style={{margin:0,fontSize:20,fontWeight:900,color:GD}}>Delegados ({delegados.length})</h2><button onClick={()=>setShow(true)} style={{background:GB,color:'#fff',border:'none',borderRadius:12,padding:'9px 18px',fontWeight:800,cursor:'pointer',display:'flex',alignItems:'center',gap:6}}><UserPlus size={14}/>Nuevo</button></div>
<div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(min(250px,100%),1fr))',gap:14}}>
{delegados.length===0&&<div style={{gridColumn:'1/-1',textAlign:'center',padding:48,color:'#9ca3af'}}><Users size={40} color="#e5e7eb" style={{margin:'0 auto 12px',display:'block'}}/><p>Sin delegados</p></div>}
{delegados.map(d=>{const cd=cops.filter(c=>c.delegado_id===d.id);return(<div key={d.id} style={{background:'#fff',border:'1.5px solid #e5e7eb',borderRadius:16,padding:18}}><div style={{display:'flex',alignItems:'center',gap:10,marginBottom:10}}><div style={{width:40,height:40,background:'#e8f4fd',borderRadius:'50%',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}><span style={{fontSize:16,fontWeight:900,color:GB}}>{d.nombre?d.nombre[0].toUpperCase():'?'}</span></div><div style={{flex:1,minWidth:0}}><div style={{fontWeight:900,color:GD,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{d.nombre}</div><div style={{fontSize:11,color:'#9ca3af',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{d.email}</div></div></div><div style={{fontSize:11,color:'#9ca3af',marginBottom:4}}>EDIFICIOS ({cd.length})</div>{cd.map(c=><div key={c.id} style={{fontSize:11,background:'#f0f7ff',color:GB,borderRadius:5,padding:'2px 7px',display:'inline-block',marginRight:4,marginBottom:3}}>{c.nombre}</div>)}<div style={{marginTop:10,display:'flex',justifyContent:'space-between',alignItems:'center'}}><Bdg t={d.activo?'Activo':'Inactivo'} color={d.activo?'#059669':'#dc2626'}/><button onClick={async()=>{await supabase.from('perfiles').update({activo:!d.activo}).eq('id',d.id);refetch()}} style={{background:'#f3f4f6',border:'none',borderRadius:7,padding:'4px 9px',cursor:'pointer',fontSize:11,fontWeight:700}}>{d.activo?'Desactivar':'Activar'}</button></div></div>)})}
</div>
{show&&<Modal title="Nuevo Delegado" onClose={()=>setShow(false)}><F label="Nombre" req><input style={inp} value={form.nombre} onChange={e=>setForm(p=>({...p,nombre:e.target.value}))}/></F><F label="Correo" req><input style={inp} type="email" value={form.email} onChange={e=>setForm(p=>({...p,email:e.target.value}))}/></F><F label="Contrasena" req><input style={inp} type="password" value={form.password} onChange={e=>setForm(p=>({...p,password:e.target.value}))}/></F><F label="Telefono"><input style={inp} value={form.telefono} onChange={e=>setForm(p=>({...p,telefono:e.target.value}))}/></F><F label="Edificio"><select style={inp} value={form.copropiedad_id} onChange={e=>setForm(p=>({...p,copropiedad_id:e.target.value}))}><option value="">Sin asignar</option>{cops.map(c=><option key={c.id} value={c.id}>{c.nombre}</option>)}</select></F><div style={{display:'flex',gap:10,marginTop:8}}><button onClick={()=>setShow(false)} style={{flex:1,background:'#f3f4f6',border:'none',borderRadius:10,padding:11,cursor:'pointer',fontWeight:700}}>Cancelar</button><button onClick={crearDelegado} disabled={saving} style={{flex:2,background:saving?'#9ca3af':GB,color:'#fff',border:'none',borderRadius:10,padding:11,cursor:'pointer',fontWeight:800}}>{saving?'Creando...':'Crear'}</button></div></Modal>}
{toast&&<Toast {...toast}/>}
</div>)
}
async function generarPDF(cop,perfiles){
const[c,t,m,k,s,p,sp,o,cot]=await Promise.all([supabase.from('contratos').select('*').eq('copropiedad_id',cop.id),supabase.from('tareas').select('*').eq('copropiedad_id',cop.id),supabase.from('mantenimientos').select('*').eq('copropiedad_id',cop.id),supabase.from('cartera').select('*').eq('copropiedad_id',cop.id),supabase.from('sgsst').select('*').eq('copropiedad_id',cop.id),supabase.from('pqrs').select('*').eq('copropiedad_id',cop.id),supabase.from('servicios_publicos').select('*').eq('copropiedad_id',cop.id),supabase.from('obras').select('*').eq('copropiedad_id',cop.id),supabase.from('cotizaciones').select('*').eq('copropiedad_id',cop.id)])
const del=perfiles.find(x=>x.id===cop.delegado_id);const fecha=new Date().toLocaleDateString('es-CO',{day:'2-digit',month:'long',year:'numeric'})
const sec=(titulo,rows,hs,cells)=>rows?.length>0?`<div class="sec"><div class="sh">${titulo} (${rows.length})</div><table><tr>${hs.map(h=>`<th>${h}</th>`).join('')}</tr>${rows.map(r=>`<tr>${cells(r)}</tr>`).join('')}</table></div>`:''
const html=`<!DOCTYPE html><html><head><meta charset="utf-8"><title>Informe ${cop.nombre}</title><style>*{margin:0;padding:0;box-sizing:border-box;font-family:'Segoe UI',Arial,sans-serif}body{padding:28px;color:#1f2937;font-size:12px}.h{background:#0d2d4a;color:#fff;padding:20px 28px;border-radius:12px;margin-bottom:20px;display:flex;justify-content:space-between}.logo{font-size:20px;font-weight:900}.logo span{color:#c9a227}.sec{margin-bottom:16px;border:1px solid #e5e7eb;border-radius:10px;overflow:hidden}.sh{background:#1e6fae;color:#fff;padding:8px 14px;font-weight:800}table{width:100%;border-collapse:collapse}th{background:#f1f5f9;padding:6px 10px;text-align:left;font-size:10px;font-weight:700;color:#64748b;text-transform:uppercase}td{padding:6px 10px;border-bottom:1px solid #f3f4f6;font-size:11px}tr:last-child td{border:none}.ig{display:grid;grid-template-columns:1fr 1fr}.ii{padding:8px 14px;border-bottom:1px solid #f3f4f6}.il{font-size:9px;color:#9ca3af;font-weight:700;text-transform:uppercase}.iv{font-size:12px;font-weight:700;color:#1f2937;margin-top:1px}.ft{margin-top:20px;border-top:1px solid #e5e7eb;padding-top:12px;text-align:center;color:#9ca3af;font-size:10px}</style></head><body>
<div class="h"><div><div class="logo">GEIN<span>SER</span> PROHORIZONTAL</div><div style="font-size:10px;opacity:.6;margin-top:3px">Plataforma de Gestion Integral</div></div><div style="text-align:right"><div style="font-size:15px;font-weight:800">INFORME DE GESTION</div><div style="font-size:10px;opacity:.7">Generado: ${fecha}</div></div></div>
<div class="sec"><div class="sh">🏢 Informacion General</div><div class="ig">${[['Copropiedad',cop.nombre],['Direccion',cop.direccion||'—'],['Ciudad',cop.ciudad||'Bogota'],['Tipo',cop.tipo||'—'],['Unidades',cop.unidades||0],['Honorarios',fmtM(cop.honorarios)+'/mes'],['Delegado',del?.nombre||'Sin asignar'],['Vigencia',fmt(cop.fecha_inicio)+' — '+fmt(cop.fecha_vencimiento)]].map(([l,v])=>`<div class="ii"><div class="il">${l}</div><div class="iv">${v}</div></div>`).join('')}</div></div>
${sec('📄 Contratos',c.data,['Proveedor','Servicio','Valor','Vencimiento','Estado'],r=>`<td>${r.proveedor}</td><td>${r.servicio}</td><td>${fmtM(r.valor)}</td><td>${fmt(r.fecha_vencimiento)}</td><td>${r.estado}</td>`)}
${sec('✅ Tareas',t.data,['Titulo','Prioridad','Estado','Avance','Limite'],r=>`<td>${r.titulo}</td><td>${r.prioridad}</td><td>${r.estado}</td><td>${r.progreso||0}%</td><td>${fmt(r.fecha_limite)}</td>`)}
${sec('🔧 Mantenimiento',m.data,['Area','Proveedor','Periodicidad','Proxima fecha','Estado'],r=>`<td>${r.area}</td><td>${r.proveedor||'—'}</td><td>${r.periodicidad}</td><td>${fmt(r.proxima_fecha)}</td><td>${r.estado}</td>`)}
${sec('💰 Cartera',k.data,['Concepto','Deudor','Deuda','Recuperado','Estado'],r=>`<td>${r.concepto}</td><td>${r.deudor||'—'}</td><td style="color:#dc2626;font-weight:700">${fmtM(r.monto_deuda)}</td><td style="color:#059669">${fmtM(r.monto_recuperado)}</td><td>${r.estado}</td>`)}
${sec('📋 PQRs',p.data,['Tipo','Descripcion','Solicitante','Recibida','Estado'],r=>`<td>${r.tipo}</td><td>${(r.descripcion||'').slice(0,45)}</td><td>${r.nombre_solicitante||'—'}</td><td>${fmt(r.fecha_recepcion)}</td><td>${r.estado}</td>`)}
${sec('⚡ Servicios Publicos',sp.data,['Servicio','Periodo','Consumo','Valor','Estado'],r=>`<td>${r.servicio}</td><td>${r.periodo||'—'}</td><td>${r.consumo} ${r.unidad_consumo}</td><td style="font-weight:700">${fmtM(r.valor)}</td><td>${r.estado}</td>`)}
${sec('🏗 Obras',o.data,['Nombre','Contratista','Avance','Valor','Estado'],r=>`<td>${r.nombre}</td><td>${r.contratista||'—'}</td><td style="font-weight:700;color:#f97316">${r.porcentaje_avance||0}%</td><td>${fmtM(r.valor_contrato)}</td><td>${r.estado}</td>`)}
${sec('📎 Cotizaciones',cot.data,['Descripcion','Proveedor','Valor','Solicitud','Estado'],r=>`<td>${(r.descripcion||'').slice(0,40)}</td><td>${r.proveedor||'—'}</td><td style="color:#8b5cf6;font-weight:700">${fmtM(r.valor)}</td><td>${fmt(r.fecha_solicitud)}</td><td>${r.estado}</td>`)}
${sec('🛡 SG-SST',s.data,['Actividad','Responsable','Programada','Ejecutada','Estado'],r=>`<td>${r.actividad}</td><td>${r.responsable||'—'}</td><td>${fmt(r.fecha_programada)}</td><td>${fmt(r.fecha_ejecutada)}</td><td>${r.completada?'Ejecutada':'Pendiente'}</td>`)}
<div class="ft"><p>Informe generado por Geinser Prohorizontal · ${fecha}</p></div></body></html>`
const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([html],{type:'text/html'}));a.download=`Informe_${cop.nombre.replace(/\s+/g,'_')}_${new Date().toISOString().slice(0,10)}.html`;a.click();URL.revokeObjectURL(a.href)}
function Copropiedades({perfil,onSelect}){
const{data:cops,loading,insert,update,remove}=useTable('copropiedades');const{data:perfiles}=useTable('perfiles')
const copsVisibles=perfil?.rol==='delegado'?cops.filter(x=>x.delegado_id===perfil.id):cops
const[infCop,setInfCop]=useState(null);const[tipoInfC,setTipoInfC]=useState('mes')
const hoyDC=new Date();const[mesInfC,setMesInfC]=useState(hoyDC.getMonth());const[anioInfC,setAnioInfC]=useState(hoyDC.getFullYear());const[genC,setGenC]=useState(false)
async function generarInfDeCop(){setGenC(true);try{await genInformePDF({copropiedades:[infCop],getDelegado:cp=>perfiles.find(p=>p.id===cp.delegado_id)?.nombre,tipoInf:tipoInfC,mesInf:mesInfC,anioInf:anioInfC});setInfCop(null)}catch(err){alert('Error PDF: '+err.message)}setGenC(false)}
const delegados=perfiles.filter(p=>p.rol==='delegado')
const[show,setShow]=useState(false);const[edit,setEdit]=useState(null)
const FD={nombre:'',direccion:'',ciudad:'Bogota',tipo:'Residencial',unidades:'',honorarios:'',fecha_inicio:'',fecha_vencimiento:'',delegado_id:'',notas:''}
const[form,setForm]=useState(FD);const Fv=(k,v)=>setForm(p=>({...p,[k]:v}))
const[toast,setToast]=useState(null);const showT=(m,t='success')=>{setToast({msg:m,type:t});setTimeout(()=>setToast(null),3000)}
async function save(){if(!form.nombre){showT('Nombre requerido','error');return};const p={...form,unidades:Number(form.unidades)||0,honorarios:Number(form.honorarios)||0,delegado_id:form.delegado_id||null};if(edit){await update(edit.id,p);showT('Actualizada')}else{await insert(p);showT('Creada')};setShow(false);setEdit(null);setForm(FD)}
const myCops=perfil.rol==='delegado'?cops.filter(c=>c.delegado_id===perfil.id):cops
if(loading)return<div style={{padding:40,textAlign:'center',color:'#9ca3af'}}>Cargando...</div>
return(<div>
<div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:20}}><h2 style={{margin:0,fontSize:20,fontWeight:900,color:GD}}>Copropiedades</h2>{perfil.rol==='director'&&<button onClick={()=>{setForm(FD);setEdit(null);setShow(true)}} style={{background:GB,color:'#fff',border:'none',borderRadius:12,padding:'9px 18px',fontWeight:800,cursor:'pointer',display:'flex',alignItems:'center',gap:6}}><Plus size={14}/>Nueva</button>}</div>
<div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(min(280px,100%),1fr))',gap:16}}>
{myCops.length===0&&<div style={{gridColumn:'1/-1',textAlign:'center',padding:48,color:'#9ca3af'}}><Building2 size={40} color="#e5e7eb" style={{margin:'0 auto 12px',display:'block'}}/><p>{perfil.rol==='delegado'?'Sin edificios asignados':'Sin copropiedades'}</p></div>}
{myCops.map(ct=>{const del=perfiles.find(p=>p.id===ct.delegado_id);const d=daysTo(ct.fecha_vencimiento);return(<div key={ct.id} style={{background:'#fff',border:'1.5px solid #e5e7eb',borderRadius:16,padding:18,cursor:'pointer'}} onClick={()=>onSelect(ct)}>
<div style={{display:'flex',justifyContent:'space-between',marginBottom:10}}><div style={{background:'#e8f4fd',borderRadius:9,padding:7}}><Building2 size={18} color={GB}/></div>
<div style={{display:'flex',gap:4}}>{d!==null&&d>=0&&d<=90&&<Bdg t={d+'d'} color="#dc2626"/>}
<button onClick={e=>{e.stopPropagation();setInfCop(ct)}} style={{background:'#f0f7ff',border:'none',borderRadius:7,padding:'4px 7px',cursor:'pointer',color:GB,display:'flex',alignItems:'center',gap:2,fontSize:10,fontWeight:700}} title="Informe PDF"><Download size={11}/>PDF</button>
{perfil.rol==='director'&&<><button onClick={e=>{e.stopPropagation();setForm({...ct,unidades:String(ct.unidades),honorarios:String(ct.honorarios),delegado_id:ct.delegado_id||''});setEdit(ct);setShow(true)}} style={{background:'#f3f4f6',border:'none',borderRadius:7,padding:'4px 7px',cursor:'pointer'}}><Edit2 size={12}/></button><button onClick={e=>{e.stopPropagation();if(window.confirm('Eliminar?'))remove(ct.id)}} style={{background:'#fef2f2',border:'none',borderRadius:7,padding:'4px 7px',cursor:'pointer',color:'#dc2626'}}><Trash2 size={12}/></button></>}
</div></div>
<div style={{fontWeight:900,fontSize:15,color:GD,marginBottom:2}}>{ct.nombre}</div>
<div style={{fontSize:12,color:'#6b7280',marginBottom:8}}>{ct.direccion||'Sin direccion'}</div>
<div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:4}}>{[{l:'Tipo',v:ct.tipo},{l:'Unidades',v:ct.unidades},{l:'Honorarios',v:fmtM(ct.honorarios)},{l:'Delegado',v:del?.nombre||'Sin asignar'}].map(({l,v})=>(<div key={l} style={{background:'#f9fafb',borderRadius:6,padding:'5px 8px'}}><div style={{fontSize:9,color:'#9ca3af'}}>{l}</div><div style={{fontSize:11,fontWeight:700,color:'#374151',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{v}</div></div>))}</div>
</div>)})}
</div>
{show&&<Modal title={edit?'Editar':'Nueva copropiedad'} onClose={()=>{setShow(false);setEdit(null)}} wide><div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(180px,1fr))',gap:12}}><div style={{gridColumn:'1/-1'}}><F label="Nombre" req><input style={inp} value={form.nombre} onChange={e=>Fv('nombre',e.target.value)}/></F></div><F label="Direccion"><input style={inp} value={form.direccion} onChange={e=>Fv('direccion',e.target.value)}/></F><F label="Ciudad"><input style={inp} value={form.ciudad} onChange={e=>Fv('ciudad',e.target.value)}/></F><F label="Tipo"><select style={inp} value={form.tipo} onChange={e=>Fv('tipo',e.target.value)}><option>Residencial</option><option>Comercial</option><option>Mixto</option><option>Oficinas</option></select></F><F label="Unidades"><input style={inp} type="number" value={form.unidades} onChange={e=>Fv('unidades',e.target.value)}/></F><F label="Honorarios ($)"><input style={inp} type="number" value={form.honorarios} onChange={e=>Fv('honorarios',e.target.value)}/></F><F label="Delegado"><select style={inp} value={form.delegado_id} onChange={e=>Fv('delegado_id',e.target.value)}><option value="">Sin asignar</option>{delegados.map(d=><option key={d.id} value={d.id}>{d.nombre}</option>)}</select></F><F label="Inicio"><input style={inp} type="date" value={form.fecha_inicio} onChange={e=>Fv('fecha_inicio',e.target.value)}/></F><F label="Vencimiento"><input style={inp} type="date" value={form.fecha_vencimiento} onChange={e=>Fv('fecha_vencimiento',e.target.value)}/></F><div style={{gridColumn:'1/-1'}}><F label="Notas"><textarea style={{...inp,resize:'vertical',minHeight:45}} value={form.notas} onChange={e=>Fv('notas',e.target.value)}/></F></div></div><div style={{display:'flex',gap:10,marginTop:8}}><button onClick={()=>{setShow(false);setEdit(null)}} style={{flex:1,background:'#f3f4f6',border:'none',borderRadius:10,padding:11,cursor:'pointer',fontWeight:700}}>Cancelar</button><button onClick={save} style={{flex:2,background:GB,color:'#fff',border:'none',borderRadius:10,padding:11,cursor:'pointer',fontWeight:800}}>{edit?'Guardar':'Crear'}</button></div></Modal>}
{toast&&<Toast {...toast}/>}
</div>)
}
// ========= DASHBOARD PRINCIPAL CON RESPONSIVE =========
export default function Dashboard(){
const{perfil:perfilRaw,signOut}=useAuth()
const modoAcceso=localStorage.getItem('geinser_modo')
const perfil=(perfilRaw?.rol==='director'&&modoAcceso==='delegado')?{...perfilRaw,rol:'delegado'}:perfilRaw
const[tab,setTab]=useState('copropiedades')
useEffect(()=>{if(perfil?.rol==='director')setTab('panel')},[perfil?.rol])
const[selCop,setSelCop]=useState(null)
const[subTab,setSubTab]=useState('contratos')
const[menuOpen,setMenuOpen]=useState(false)
const[masOpen,setMasOpen]=useState(false)
const[mobile,setMobile]=useState(isMob())
useEffect(()=>{const fn=()=>setMobile(isMob());window.addEventListener('resize',fn);return()=>window.removeEventListener('resize',fn)},[])
const{data:cops}=useTable('copropiedades')
const{data:perfiles}=useTable('perfiles')
if(!perfil)return<div style={{display:'flex',alignItems:'center',justifyContent:'center',minHeight:'100vh',background:GD}}><div style={{color:'rgba(255,255,255,0.6)'}}>Cargando...</div></div>
const menuItems=[...(perfil.rol==='director'?[{key:'panel',label:'Panel de Control',icon:TrendingUp}]:[]),{key:'copropiedades',label:'Copropiedades',icon:Building2},...(perfil.rol==='director'?[{key:'alertas',label:'Alertas',icon:Bell},{key:'delegados',label:'Delegados',icon:Users}]:[]),{key:'miperfil',label:'Mi Perfil',icon:UserCog}]
const subItemsTop=[{key:'contratos',label:'Contratos',icon:Briefcase,color:'#7c3aed'},{key:'tareas',label:'Tareas',icon:CheckSquare,color:GB},{key:'mantenimiento',label:'Mantenimiento',icon:Wrench,color:'#059669'}]
const subItemsMas=[{key:'polizas',label:'Polizas',icon:Shield,color:'#0891b2'},{key:'cartera',label:'Cartera',icon:TrendingUp,color:'#dc2626'},{key:'sgsst',label:'SG-SST',icon:Shield,color:'#0891b2'},{key:'pqrs',label:'PQRs',icon:MessageSquare,color:'#e53e3e'},{key:'servicios',label:'Servicios Pub.',icon:Zap,color:'#f59e0b'},{key:'obras',label:'Obras',icon:HardDrive,color:'#f97316'},{key:'cotizaciones',label:'Cotizaciones',icon:Search,color:'#8b5cf6'}]
const allSubItems=[...subItemsTop,...subItemsMas]
const goTab=(k)=>{setTab(k);setMenuOpen(false)}
const goSub=(k)=>{setSubTab(k);setMasOpen(false);setMenuOpen(false)}
// ---- MENÚ LATERAL DESKTOP ----
const SidebarDesktop=()=>(<div style={{width:220,background:GD,height:'100vh',position:'fixed',left:0,top:0,zIndex:200,display:'flex',flexDirection:'column'}}>
<div style={{padding:'16px 18px 12px',borderBottom:'1px solid #1a4a6e'}}><div style={{display:'flex',alignItems:'center',gap:10}}><div style={{background:'#1e6fae',borderRadius:10,width:40,height:40,display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}><span style={{fontSize:22,fontWeight:900,color:'#c9a227'}}>G</span></div><div><div style={{fontSize:15,fontWeight:900,color:'#fff',letterSpacing:'1px'}}>GEINSER</div><div style={{fontSize:8,fontWeight:700,color:'#c9a227',letterSpacing:'3px',marginTop:2}}>PROHORIZONTAL</div></div></div></div>
<div style={{padding:'8px 14px',borderBottom:'1px solid rgba(255,255,255,0.08)'}}><div style={{fontSize:9,color:'rgba(255,255,255,0.4)',fontWeight:700}}>{perfil.rol==='director'?'DIRECTOR':'DELEGADO'}</div><div style={{fontSize:12,fontWeight:700,color:'#fff',marginTop:1}}>{perfil.nombre}</div></div>
{selCop&&<div style={{padding:'8px 14px',borderBottom:'1px solid rgba(255,255,255,0.08)',background:'rgba(30,111,174,0.25)'}}><div style={{fontSize:9,color:'rgba(255,255,255,0.4)',marginBottom:1}}>COPROPIEDAD</div><div style={{fontSize:11,fontWeight:700,color:'#fff',marginBottom:2}}>{selCop.nombre}</div><button onClick={()=>{setSelCop(null);setTab('copropiedades')}} style={{background:'none',border:'none',color:'rgba(255,255,255,0.4)',fontSize:10,cursor:'pointer',padding:0,display:'flex',alignItems:'center',gap:3}}><ArrowLeft size={10}/>Volver</button></div>}
<nav style={{flex:1,padding:'4px 0',overflowY:'auto'}}>
{!selCop&&menuItems.map(({key,label,icon:Icon})=>(<button key={key} onClick={()=>setTab(key)} style={{width:'100%',display:'flex',alignItems:'center',gap:8,padding:'9px 18px',border:'none',background:tab===key?'rgba(30,111,174,0.4)':'transparent',color:tab===key?'#fff':'rgba(255,255,255,0.5)',cursor:'pointer',fontSize:12,fontWeight:tab===key?700:400,textAlign:'left'}}><Icon size={14}/>{label}</button>))}
{selCop&&allSubItems.map(({key,label,icon:Icon,color})=>(<button key={key} onClick={()=>setSubTab(key)} style={{width:'100%',display:'flex',alignItems:'center',gap:8,padding:'8px 18px 8px 22px',border:'none',background:subTab===key?'rgba(30,111,174,0.4)':'transparent',color:subTab===key?'#fff':'rgba(255,255,255,0.45)',cursor:'pointer',fontSize:11,fontWeight:subTab===key?700:400,textAlign:'left'}}><Icon size={13} color={subTab===key?'#fff':color}/>{label}</button>))}
</nav>
<button onClick={signOut} style={{margin:10,background:'rgba(255,255,255,0.07)',border:'none',borderRadius:10,padding:'8px 12px',color:'rgba(255,255,255,0.55)',cursor:'pointer',display:'flex',alignItems:'center',gap:8,fontSize:11}}><LogOut size={12}/>Cerrar sesion</button>
</div>)
// ---- TOPBAR MÓVIL ----
const TopBarMobile=()=>(<div style={{background:GD,padding:'0 16px',height:52,display:'flex',alignItems:'center',justifyContent:'space-between',position:'fixed',top:0,left:0,right:0,zIndex:300}}>
<div style={{display:'flex',alignItems:'center',gap:10}}>
{selCop&&<button onClick={()=>{setSelCop(null);setTab('copropiedades')}} style={{background:'rgba(255,255,255,0.1)',border:'none',borderRadius:8,padding:'6px 8px',cursor:'pointer',color:'#fff',display:'flex',alignItems:'center'}}><ArrowLeft size={16}/></button>}
<div style={{display:'flex',alignItems:'center',gap:8}}><div style={{background:'#1e6fae',borderRadius:8,width:30,height:30,display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}><span style={{fontSize:16,fontWeight:900,color:'#c9a227'}}>G</span></div><div><div style={{fontSize:12,fontWeight:900,color:'#fff',letterSpacing:'1px'}}>GEINSER</div><div style={{fontSize:7,fontWeight:700,color:'#c9a227',letterSpacing:'2px',marginTop:1}}>PROHORIZONTAL</div></div></div>
</div>
<div style={{display:'flex',alignItems:'center',gap:8}}>
{selCop&&<span style={{color:'rgba(255,255,255,0.7)',fontSize:12,fontWeight:700,maxWidth:120,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{selCop.nombre}</span>}
<button onClick={()=>setMenuOpen(true)} style={{background:'rgba(255,255,255,0.1)',border:'none',borderRadius:8,padding:'6px 8px',cursor:'pointer',color:'#fff',display:'flex',alignItems:'center'}}><Menu size={20}/></button>
</div>
</div>)
// ---- MENÚ HAMBURGUESA SLIDE ----
const MenuHamburguesa=()=>menuOpen&&(<>
<div onClick={()=>setMenuOpen(false)} style={{position:'fixed',inset:0,background:'rgba(0,0,0,0.5)',zIndex:400}}/>
<div style={{position:'fixed',top:0,right:0,bottom:0,width:280,background:GD,zIndex:500,display:'flex',flexDirection:'column',overflowY:'auto'}}>
<div style={{padding:'16px 18px',borderBottom:'1px solid rgba(255,255,255,0.1)',display:'flex',justifyContent:'space-between',alignItems:'center'}}>
<div><div style={{fontSize:9,color:'rgba(255,255,255,0.4)',fontWeight:700}}>{perfil.rol==='director'?'DIRECTOR':'DELEGADO'}</div><div style={{fontSize:14,fontWeight:700,color:'#fff'}}>{perfil.nombre}</div></div>
<button onClick={()=>setMenuOpen(false)} style={{background:'rgba(255,255,255,0.1)',border:'none',borderRadius:8,padding:'6px 8px',cursor:'pointer',color:'#fff'}}><X size={18}/></button>
</div>
{selCop&&<div style={{padding:'10px 18px',borderBottom:'1px solid rgba(255,255,255,0.08)',background:'rgba(30,111,174,0.3)'}}><div style={{fontSize:9,color:'rgba(255,255,255,0.4)',marginBottom:1}}>COPROPIEDAD ACTIVA</div><div style={{fontSize:13,fontWeight:700,color:'#fff'}}>{selCop.nombre}</div></div>}
<nav style={{flex:1,padding:'8px 0'}}>
{!selCop&&<div style={{padding:'4px 0'}}>
<div style={{fontSize:9,color:'rgba(255,255,255,0.3)',padding:'6px 18px',fontWeight:700}}>NAVEGACION</div>
{menuItems.map(({key,label,icon:Icon})=>(<button key={key} onClick={()=>goTab(key)} style={{width:'100%',display:'flex',alignItems:'center',gap:12,padding:'12px 18px',border:'none',background:tab===key?'rgba(30,111,174,0.4)':'transparent',color:tab===key?'#fff':'rgba(255,255,255,0.6)',cursor:'pointer',fontSize:14,fontWeight:tab===key?700:400,textAlign:'left'}}><Icon size={16}/>{label}</button>))}
</div>}
{selCop&&<div>
<div style={{fontSize:9,color:'rgba(255,255,255,0.3)',padding:'10px 18px 4px',fontWeight:700}}>MODULOS</div>
{allSubItems.map(({key,label,icon:Icon,color})=>(<button key={key} onClick={()=>goSub(key)} style={{width:'100%',display:'flex',alignItems:'center',gap:12,padding:'11px 18px',border:'none',background:subTab===key?'rgba(30,111,174,0.4)':'transparent',color:subTab===key?'#fff':'rgba(255,255,255,0.55)',cursor:'pointer',fontSize:14,fontWeight:subTab===key?700:400,textAlign:'left'}}><Icon size={15} color={subTab===key?'#fff':color}/>{label}</button>))}
</div>}
</nav>
<button onClick={signOut} style={{margin:12,background:'rgba(255,255,255,0.08)',border:'none',borderRadius:10,padding:'12px 16px',color:'rgba(255,255,255,0.6)',cursor:'pointer',display:'flex',alignItems:'center',gap:10,fontSize:13}}><LogOut size={14}/>Cerrar sesion</button>
</div>
</>)
// ---- BOTTOM BAR MÓVIL ----
const BottomBar=()=>{
if(!selCop)return null
const masActivo=subItemsMas.some(x=>x.key===subTab)
return(<div style={{position:'fixed',bottom:0,left:0,right:0,background:'#fff',borderTop:'1px solid #e5e7eb',display:'flex',zIndex:300,paddingBottom:'env(safe-area-inset-bottom,0px)'}}>
{subItemsTop.map(({key,label,icon:Icon,color})=>(<button key={key} onClick={()=>goSub(key)} style={{flex:1,display:'flex',flexDirection:'column',alignItems:'center',gap:2,padding:'8px 4px',border:'none',background:'transparent',cursor:'pointer',borderTop:`2px solid ${subTab===key?color:'transparent'}`}}>
<Icon size={20} color={subTab===key?color:'#9ca3af'}/>
<span style={{fontSize:9,color:subTab===key?color:'#9ca3af',fontWeight:subTab===key?700:400,whiteSpace:'nowrap'}}>{label}</span>
</button>))}
<button onClick={()=>{if(masActivo)setSubTab(subItemsMas[0].key);else setMasOpen(!masOpen)}} style={{flex:1,display:'flex',flexDirection:'column',alignItems:'center',gap:2,padding:'8px 4px',border:'none',background:'transparent',cursor:'pointer',position:'relative',borderTop:`2px solid ${masActivo?subItemsMas.find(x=>x.key===subTab)?.color||GB:'transparent'}`}}>
{masActivo?<CheckSquare size={20} color={subItemsMas.find(x=>x.key===subTab)?.color||GB}/>:<Menu size={20} color={masOpen?GB:'#9ca3af'}/>}
<span style={{fontSize:9,color:masActivo?subItemsMas.find(x=>x.key===subTab)?.color||GB:masOpen?GB:'#9ca3af',fontWeight:masActivo||masOpen?700:400}}>Mas</span>
</button>
{masOpen&&<>
<div onClick={()=>setMasOpen(false)} style={{position:'fixed',inset:0,zIndex:290}} />
<div style={{position:'absolute',bottom:'100%',right:0,background:'#fff',border:'1px solid #e5e7eb',borderRadius:'12px 12px 0 0',width:200,zIndex:310,boxShadow:'0 -4px 20px rgba(0,0,0,0.1)'}}>
{subItemsMas.map(({key,label,icon:Icon,color})=>(<button key={key} onClick={()=>goSub(key)} style={{width:'100%',display:'flex',alignItems:'center',gap:12,padding:'12px 16px',border:'none',background:subTab===key?color+'12':'transparent',cursor:'pointer',fontSize:13,fontWeight:subTab===key?700:400,color:subTab===key?color:GD,textAlign:'left',borderLeft:subTab===key?`3px solid ${color}`:'3px solid transparent'}}><Icon size={16} color={color}/>{label}</button>))}
</div>
</>}
{infCop&&<Modal title={'Informe de gestion - '+infCop.nombre} onClose={()=>setInfCop(null)}>
<div style={{display:'flex',gap:8,marginBottom:16}}>
<button onClick={()=>setTipoInfC('mes')} style={{flex:1,background:tipoInfC==='mes'?GB:'#fff',color:tipoInfC==='mes'?'#fff':'#6b7280',border:'1.5px solid '+(tipoInfC==='mes'?GB:'#e5e7eb'),borderRadius:10,padding:'10px 0',cursor:'pointer',fontWeight:800,fontSize:13}}>Mensual</button>
<button onClick={()=>setTipoInfC('anio')} style={{flex:1,background:tipoInfC==='anio'?GB:'#fff',color:tipoInfC==='anio'?'#fff':'#6b7280',border:'1.5px solid '+(tipoInfC==='anio'?GB:'#e5e7eb'),borderRadius:10,padding:'10px 0',cursor:'pointer',fontWeight:800,fontSize:13}}>Anual</button>
</div>
<div style={{display:'grid',gridTemplateColumns:tipoInfC==='mes'?'1fr 1fr':'1fr',gap:10,marginBottom:16}}>
{tipoInfC==='mes'&&<F label="Mes"><select style={inp} value={mesInfC} onChange={e=>setMesInfC(Number(e.target.value))}>{MESES_INF.map((m,i2)=><option key={m} value={i2}>{m}</option>)}</select></F>}
<F label="Año"><select style={inp} value={anioInfC} onChange={e=>setAnioInfC(Number(e.target.value))}>{[hoyDC.getFullYear(),hoyDC.getFullYear()-1,hoyDC.getFullYear()-2].map(a=><option key={a} value={a}>{a}</option>)}</select></F>
</div>
<div style={{background:'#f0f7ff',borderRadius:10,padding:12,fontSize:12,color:'#1e40af',marginBottom:16}}>Informe gerencial completo: indicadores, graficas de gestion, contratos, polizas, tareas, mantenimientos, PQRs, cartera, SG-SST, obras y registro fotografico.</div>
<button onClick={generarInfDeCop} disabled={genC} style={{width:'100%',background:genC?'#9ca3af':GD,color:'#fff',border:'none',borderRadius:10,padding:12,fontWeight:800,cursor:genC?'wait':'pointer'}}>{genC?'Generando informe...':'📄 Generar y descargar PDF'}</button>
</Modal>}
</div>)
}
// ---- RENDER ----
const ContentArea=()=>(<div style={{flex:1,padding:mobile?'16px':24,overflowY:'auto',paddingBottom:mobile&&selCop?'80px':'24px'}}>
{!selCop&&tab==='panel'&&perfil.rol==='director'&&<PanelControl onSelect={ct=>{setSelCop(ct);setSubTab('tareas')}}/>}
{!selCop&&tab==='copropiedades'&&<Copropiedades perfil={perfil} onSelect={ct=>{setSelCop(ct);setSubTab('contratos')}}/>}
{!selCop&&tab==='alertas'&&<Alertas/>}
{!selCop&&tab==='delegados'&&perfil.rol==='director'&&<DelegadosPanel/>}
{!selCop&&tab==='miperfil'&&<MiPerfil perfil={perfil}/>}
{selCop&&subTab==='contratos'&&<Contratos copropiedad={selCop}/>}
{selCop&&subTab==='tareas'&&<Tareas copropiedad={selCop} perfil={perfil}/>}
{selCop&&subTab==='mantenimiento'&&<Mantenimiento copropiedad={selCop}/>}
{selCop&&subTab==='polizas'&&<Polizas copropiedad={selCop}/>}
{selCop&&subTab==='cartera'&&<Cartera copropiedad={selCop}/>}
{selCop&&subTab==='sgsst'&&<SGSST copropiedad={selCop}/>}
{selCop&&subTab==='pqrs'&&<PQRs copropiedad={selCop}/>}
{selCop&&subTab==='servicios'&&<ServiciosPublicos copropiedad={selCop}/>}
{selCop&&subTab==='obras'&&<Obras copropiedad={selCop}/>}
{selCop&&subTab==='cotizaciones'&&<Cotizaciones copropiedad={selCop}/>}
</div>)
if(mobile)return(
<div style={{display:'flex',flexDirection:'column',minHeight:'100vh',fontFamily:"'Segoe UI',system-ui,sans-serif",background:'#f1f5f9'}}>
<TopBarMobile/>
<MenuHamburguesa/>
<div style={{flex:1,marginTop:52,display:'flex',flexDirection:'column'}}>
<div style={{background:'#fff',borderBottom:'1px solid #e5e7eb',padding:'0 16px',height:40,display:'flex',alignItems:'center',justifyContent:'space-between'}}>
<h1 style={{margin:0,fontSize:13,fontWeight:800,color:GD,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{selCop?subTab.charAt(0).toUpperCase()+subTab.slice(1):tab.charAt(0).toUpperCase()+tab.slice(1)}</h1>
<div style={{fontSize:10,color:'#9ca3af',flexShrink:0}}>{new Date().toLocaleDateString('es-CO',{day:'2-digit',month:'short'})}</div>
</div>
<ContentArea/>
</div>
<BottomBar/>
</div>
)
return(
<div style={{display:'flex',minHeight:'100vh',fontFamily:"'Segoe UI',system-ui,sans-serif",background:'#f1f5f9'}}>
<SidebarDesktop/>
<div style={{marginLeft:220,flex:1,display:'flex',flexDirection:'column'}}>
<div style={{background:'#fff',borderBottom:'1px solid #e5e7eb',padding:'0 24px',height:50,display:'flex',alignItems:'center',justifyContent:'space-between',position:'sticky',top:0,zIndex:100}}><h1 style={{margin:0,fontSize:15,fontWeight:800,color:GD}}>{selCop?selCop.nombre:tab.charAt(0).toUpperCase()+tab.slice(1)}</h1><div style={{fontSize:11,color:'#9ca3af'}}>{new Date().toLocaleDateString('es-CO',{day:'2-digit',month:'short',year:'numeric'})}</div></div>
<ContentArea/>
</div>
</div>
)
                                       }
