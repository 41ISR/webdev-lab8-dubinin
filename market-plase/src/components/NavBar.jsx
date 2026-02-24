import { Link } from 'react-router-dom'
import { useUserStore } from '../store/useUserStore'

const NavBar = () => {
    const { session } = useUserStore()
    
    return (
        <div className="navbar">
            <div className="navbar-container">
                <h2 className="navbar-brand">Feedback</h2>
                <ul className="navbar-nav">
                    <li>
                        <Link to={"/"}>Домой</Link>
                    </li>
                    {!session ? (
                        <li>
                            <Link to={"/signin"}>Войти</Link>
                        </li>
                    ) : (
                        <>
                            <li>
                                <Link to={"/my-messages"}>Мои сообщения</Link>
                            </li>
                            <li>
                                <Link to={"/logout"}>Выйти</Link>
                            </li>
                        </>
                    )}
                </ul>
            </div>
        </div>
    )
}

export default NavBar