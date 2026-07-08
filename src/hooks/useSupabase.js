import{useState,useEffect,useCallback}from'react'
import{supabase}from'../lib/supabase'
export function useTable(tabla,filtros={}){
  const[data,setData]=useState([])
  const[loading,setLoading]=useState(true)
  const k=JSON.stringify(filtros)
  const load=useCallback(async()=>{
    setLoading(true)
    let q=supabase.from(tabla).select('*').order('created_at',{ascending:false})
    Object.entries(filtros).forEach(([key,val])=>{if(val)q=q.eq(key,val)})
    const{data:d,error:e}=await q
    if(!e)setData(d||[])
    setLoading(false)
  },[tabla,k])
  useEffect(()=>{load()},[load])
  async function insert(item){
    const{data:d,error:e}=await supabase.from(tabla).insert(item).select().single()
    if(!e){setData(p=>[d,...p]);return{data:d,error:null}}
    console.error('INSERT error',tabla,e)
    return{data:null,error:e}
  }
  async function update(id,item){
    const{data:d,error:e}=await supabase.from(tabla).update(item).eq('id',id).select().single()
    if(!e){setData(p=>p.map(x=>x.id===id?d:x));return{data:d,error:null}}
    console.error('UPDATE error',tabla,e)
    return{data:null,error:e}
  }
  async function remove(id){
    const{error:e}=await supabase.from(tabla).delete().eq('id',id)
    if(!e)setData(p=>p.filter(x=>x.id!==id))
    return{error:e}
  }
  return{data,loading,error:null,refetch:load,insert,update,remove}
}
