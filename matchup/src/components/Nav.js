import logo from "../images/MatchUpLogo.png";

const Nav = ({ authToken, showModel, setShowModel, setIsSignUp}) => {

    const handleClick = () => {
        setShowModel(true)
        setIsSignUp(false)
    }

    // const authToken = false

    return (
        <nav>
            <div className="logo-container">
                <img className="logo" src={logo} alt="logo"/>
            </div>

            {!authToken && <button 
            className="nav-button"
            onClick={handleClick}
            disabled={showModel}
            >Log in</button>}
        </nav>
    );
};
export default Nav