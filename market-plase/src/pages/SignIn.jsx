import { useState } from "react"
import Button from "../components/Button"
import Input from "../components/Input"
import { api } from "../api/api"
import { Link, useNavigate } from "react-router-dom"
import { useUserStore } from "../store/useUserStore"

const SignIn = () => {
    const [error, setError] = useState("")
    const navigate = useNavigate()
    const { setSession } = useUserStore()

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError("")

        const user = {
            username: e.target.username.value,
            password: e.target.password.value
        }

        try {
            const data = await api.loginUser(user)
            console.log(data);
            
            setSession(data.data)
            navigate("/")
        } catch (error) {
            setError(error.response.data.error)
            console.error(error)
        }
    }

    return (
<div clasName="auth-container">
        <div clasName="auth-header">
            <div clasName="auth-icon">🔐</div>
            <h1 clasName="auth-title">Вход</h1>
            <p clasName="auth-subtitle">Войдите в свой аккаунт</p>
        </div>

        <div clasName="alert alert-error" id="error-alert">
            Неверное имя пользователя или пароль
        </div>

        <form id="login-form">
            <div clasName="form-group">
                <label clasName="form-label">Имя пользователя</label>
                <input 
                    type="text" 
                    clasName="form-input" 
                    name="username"
                    placeholder="Введите имя пользователя"
                    required
                    autocomplete="username"
                >
                <div clasName="form-error">Введите имя пользователя</div>
            </div>

            <div clasName="form-group">
                <label clasNameName="form-label">Пароль</label>
                <input 
                    type="password" 
                    clasName="form-input" 
                    name="password"
                    placeholder="Введите пароль"
                    required
                    autocomplete="current-password"
                >
                <div clasName="form-error">Введите пароль</div>
            </div>

            <button type="submit" clasName="btn-submit">Войти</button>
        </form>

        <div clasName="auth-divider">или</div>

        <div clasName="auth-link">
            Нет аккаунта? <a href="/register">Зарегистрироваться</a>
        </div>
    </div>
    )
}

export default SignIn