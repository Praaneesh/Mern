import {Navbar} from './Navbar'
import {Outlet,Navigate,useNavigate} from 'react-router-dom'
import { useEffect } from 'react'
export function Layout(){

    let token = localStorage.getItem("token")
    const navigate = useNavigate()

    useEffect(() => {
        if(!token){
            navigate("/")
        }
    },[token])

    return(
        <>
            <Navbar/>
            <main className="main-wrapper">
                <Outlet/>
            </main>
        </>
    )
}