import { Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'

function PrivateRoute({ children }) {
  const { user, loading } = useAuth()
  if (loading) return (
    <div style={{display:'flex',alignItems:'center',justifyContent:'center',minHeight:'100vh',background:'#0d2d4a'}}>
      <div style={{textAlign:'center',color:'#fff'}}>
        <div style={{fontSize:32,fontWeight:900,color:'#1e6fae',marginBottom:4}}>GEINSER</div>
        <div style={{fontSize:11,color:'#c9a227',fontWeight:700,letterSpacing:4,marginBottom:20}}>PROHORIZONTAL</div>
        <div style={{width:32,height:3,background:'#c9a227',borderRadius:2,margin:'0 auto',animation:'pulse 1s infinite'}}/>
      </div>
    </div>
  )
  return user ? children : <Navigate to="/login" replace />
}

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/*" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
      </Routes>
    </AuthProvider>
  )
}
