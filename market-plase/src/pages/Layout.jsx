import { Outlet } from "react-router-dom"


const Layout = () => {
    return (
        <div className="container">
            <NavBar />
            <Outlet />
        </div>
    )
}

export default Layout