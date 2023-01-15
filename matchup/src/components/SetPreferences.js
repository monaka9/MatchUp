import { useState } from "react"
import axios from "axios"
import { useCookies } from "react-cookie"

const SetPreferences = ({ user, setShowPreferences }) => {
    const [cookies, setCookie, removeCookie] = useCookies(['user'])

    const [formData, setFormData] = useState ({
        user_id: cookies.UserId,
        first_name: user.first_name,
        personality: user.personality, 
        url: user.url,
        about: user.about, 
        matches: user.matches
    })

    const handleClick = () => {
        setShowPreferences(false)
    }

    const handleSubmit = async (e) => {
        console.log("Submitted")
        e.preventDefault()

        try {
            const response = await axios.put('http://localhost:8000/user', {formData})

            console.log(response)

            const success = response.status == 200

        } catch(err) {
            console.log(err)
        }
    }

    const handleChange = (e) => {
        const value = e.target.value
        const name = e.target.name

        setFormData((prevState) => ({
            ...prevState, 
            [name]:value 
        }))
    }

    const handleCheckbox = (e) => {
        const value = e.target.value

        if(formData.personality.includes(value))
        {
            console.log("removing value", value)
            const index = formData.personality.indexOf(value)
            setFormData((prevState) => ({
                ...prevState,
                personality: prevState.personality.splice(index, 1)
            }))
        }
        else 
        {
            console.log("adding value", value)
            setFormData((prevState) => ({
                ...prevState,
                personality: prevState.personality.concat(value)
            }))
        }

        console.log(formData.personality)
    }

    return (
        <div className="pref-model">
            <div className="close-icon" onClick={handleClick}>ⓧ</div>
            
            <h2>Change your account preferences</h2>

            <form onSubmit={handleSubmit}>
                    <label htmlFor="first_name">First Name</label>
                    <input 
                        id = "first_name"
                        type = "text"
                        name = "first_name"
                        placeholder = "First Name"
                        required = {true}
                        value = {formData.first_name}
                        onChange = {handleChange}
                    />

                    <label htmlFor="about">About Me</label>
                    <input 
                        id = "about"
                        type = "text"
                        name = "about"
                        placeholder = "I love coding..."
                        required = {true}
                        value = {formData.about}
                        onChange = {handleChange}
                    />

                    <div className = "multiple-input-container">
                        <input 
                            id = "personality1"
                            type = "checkbox"
                            name = "personality"
                            value = "Introverted"
                            onChange = {(e) => handleCheckbox(e)}
                            checked={formData.personality.includes("Introverted")}
                        />
                        <label htmlFor="personality1">Introverted</label>

                        <input 
                            id = "personality2"
                            type = "checkbox"
                            name = "personality"
                            value = "Extroverted"
                            onChange = {(e) => handleCheckbox(e)}
                            checked={formData.personality.includes("Extroverted")}
                        />
                        <label htmlFor="personality2">Extroverted</label>

                        <input 
                            id = "personality3"
                            type = "checkbox"
                            name = "personality"
                            value = "Adventurous"
                            onChange = {(e) => handleCheckbox(e)}
                            checked={formData.personality.includes("Adventurous")}
                        />
                        <label htmlFor="personality3">Adventurous</label>

                        <input 
                            id = "personality4"
                            type = "checkbox"
                            name = "personality"
                            value = "Easy-going"
                            onChange = {(e) => handleCheckbox(e)}
                            checked={formData.personality.includes("Easy-going")}
                        />
                        <label htmlFor="personality4">Easy-going</label>

                        <input 
                            id = "personality5"
                            type = "checkbox"
                            name = "personality"
                            value = "Quiet"
                            onChange = {(e) => handleCheckbox(e)}
                            checked={formData.personality.includes("Quiet")}
                        />
                        <label htmlFor="personality5">Quiet</label>
                    </div>
                    <input type = "submit"/>
                </form>
            <hr/>
        </div>
    )
}

export default SetPreferences