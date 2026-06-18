import{createContext,useContext,useEffect,useState,useRef}from'react'
import{supabase}from'../lib/supabase'
const AuthContext=createContext({})
export function AuthProvider({children}){
  const[user,setUser]=useState(null)
  const[perfil,setPerfil]=useState(null)
  const[loading,setLoading]=useState(true)
  const fetchedUid=useRef(null)
  useEffect(()=>{
    supabase.auth.getSession().then(({data:{session}})=>{
      setUser(session?.user??null)
      if(session?.user)fetchPerfil(session.user.id)
      else setLoading(false)
    })
    const{data:{subscription}}=supabase.auth.onAuthStateChange((event,session)=>{
      if(event==='TOKEN_REFRESHED')return
      setUser(session?.user??null)
      if(session?.user){
        if(session.user.id!==fetchedUid.current)fetchPerfil(session.user.id)
      }else{
        fetchedUid.current=null
        setPerfil(null);setLoading(false)
      }
    })
    return()=>subscription.unsubscribe()
  },[])
  async function fetchPerfil(uid){
    fetchedUid.current=uid
    const{data}=await supabase.from('perfiles').select('*').eq('id',uid).single()
    setPerfil(data);setLoading(false)
  }
  async function signIn(email,password){
    const{error}=await supabase.auth.signInWithPassword({email,password})
    return{error}
  }
  async function signOut(){fetchedUid.current=null;await supabase.auth.signOut();setPerfil(null)}
  return <AuthContext.Provider value={{user,perfil,loading,signIn,signOut}}>{children}</AuthContext.Provider>
}
export const useAuth=()=>useContext(AuthContext)
