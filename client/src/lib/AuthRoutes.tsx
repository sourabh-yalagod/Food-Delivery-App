import useAuth from '../hooks/useAuth'
import { Navigate, Outlet } from 'react-router-dom'

const AuthRoutes = () => {
    const { isAuthenticated } = useAuth()
    console.log("isAuthenticated : ", isAuthenticated)
    return isAuthenticated ? <Outlet /> : <Navigate to={"/signin"} />
}

export default AuthRoutes