import Nav from "../components/Nav"
import { useState } from 'react'
import AuthModel from "../components/AuthModel"
import { useCookies } from "react-cookie"


const Home = () => {
    const [showModel, setShowModel] = useState(false)
    const [isSignUp, setIsSignUp] = useState(true)
    const [cookies, setCookie, removeCookie] = useCookies(['user'])

    const authToken = cookies.authToken

    const handleClick = () => {
        // console.log("button clicked")
        if (authToken){
            removeCookie('UserId', cookies.UserId)
            removeCookie('AuthToken', cookies.AuthToken)
            window.location.reload()
            return
        }
        setShowModel(true)
        setIsSignUp(true)
    }

    return (
        <>
        <div className="overlay">
            <Nav 
            authToken={authToken} 
            showModel={showModel} 
            setShowModel={setShowModel} 
            setIsSignUp={setIsSignUp}
            />
                <div className = "home">
                    <h1 className="primary-title">Find your people</h1>
                    <button className = "primary-button" onClick={handleClick}>
                        {authToken ? "Sign Out" : "Create Account" }
                    </button>

                    {showModel && (
                        <AuthModel 
                        setShowModel={setShowModel} 
                        isSignUp={isSignUp}
                        />
                    )}
                </div>
        </div>
        </>
    )
}
export default Home