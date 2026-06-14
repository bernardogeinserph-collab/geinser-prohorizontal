import{BrowserRouter,Routes,Route,Navigate}from'react-router-dom'
import{AuthProvider,useAuth}from'./context/AuthContext'
import Login from'./pages/Login'
import Dashboard from'./pages/Dashboard'
import ResetPassword from'./pages/ResetPassword'

function PrivateRoute({children}){
const{user,loading}=useAuth()
if(loading)return<div style={{display:'flex',alignItems:'center',justifyContent:'center',minHeight:'100vh',background:'#0d2d4a',color:'rgba(255,255,255,0.5)',fontSize:14}}>Cargando...</div>
return user?children:<Navigate to="/login"/>
}

export default function App(){
return(
<AuthProvider>
<BrowserRouter>
<Routes>
<Route path="/login" element={<Login/>}/>
<Route path="/reset-password" element={<ResetPassword/>}/>
<Route path="/" element={<PrivateRoute><Dashboard/></PrivateRoute>}/>
<Route path="*" element={<Navigate to="/"/>}/>
</Routes>
</BrowserRouter>
</AuthProvider>
)
}
