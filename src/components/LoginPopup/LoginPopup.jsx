import './LoginPopup.css'
import { assets } from '../../assets/assets'
import { useContext, useState } from 'react'
import { StoreContext } from '../../context/StoreContext'
import axios from 'axios'
import { toast } from 'react-toastify'

const LoginPopup = ({ setShowLogin }) => {
    const { API_BASE_URL, setToken } = useContext(StoreContext)
    const [currState, setCurrState] = useState('Login')
    const [data, setData] = useState({
        name: '',
        email: '',
        password: '',
    })

    const onChangeHandler = (event) => {
        const name = event.target.name
        const value = event.target.value
        setData((data) => ({ ...data, [name]: value }))
    }

    const onLogin = async (event) => {
        event.preventDefault()
        let newUrl = API_BASE_URL
        if (currState === 'Login') {
            newUrl += '/api/user/login'
        } else {
            newUrl += '/api/user/register'
        }

        try {
            const response = await axios.post(newUrl, data)

            if (response.data.success) {
                setToken(response.data.token)
                localStorage.setItem('token', response.data.token)
                setShowLogin(false)
                toast.success(response.data.message)
            } else {
                toast.error(response.data.message)
            }
        } catch (error) {
            if (error.response && error.response.data) {
                toast.error(error.response.data.message || 'An error occurred')
            } else {
                toast.error('Something went wrong, please try again.')
            }
        }
    }

    return (
        <div className="login-popup">
            <form onSubmit={onLogin} className="login-popup-container">
                <div className="login-popup-title">
                    <h2>{currState}</h2>
                    <img
                        onClick={() => setShowLogin(false)}
                        src={assets.cross_icon}
                        alt=""
                    />
                </div>
                <div className="login-popup-inputs">
                    {currState === 'Register' && (
                        <input
                            name="name"
                            onChange={onChangeHandler}
                            value={data.name}
                            type="text"
                            placeholder="Your name"
                            required
                        />
                    )}
                    <input
                        name="email"
                        onChange={onChangeHandler}
                        value={data.email}
                        type="email"
                        placeholder="Your email"
                        required
                    />
                    <input
                        name="password"
                        onChange={onChangeHandler}
                        value={data.password}
                        type="password"
                        placeholder="Password"
                        required
                    />
                </div>
                <button type="submit">
                    {currState === 'Register' ? 'Create account' : 'Login'}
                </button>
                <div className="login-popup-condition">
                    <input type="checkbox" required />
                    <p>
                        By continuing, i agree to the terms of use & privacy
                        policy.
                    </p>
                </div>
                {currState === 'Register' ? (
                    <p>
                        Already have an account?{' '}
                        <span onClick={() => setCurrState('Login')}>
                            Login here
                        </span>
                    </p>
                ) : (
                    <p>
                        Create a new account?{' '}
                        <span onClick={() => setCurrState('Register')}>
                            Click here
                        </span>
                    </p>
                )}
            </form>
        </div>
    )
}

export default LoginPopup
