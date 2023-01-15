import { useState } from 'react'
import Nav from "../components/Nav"
import { useCookies } from 'react-cookie'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'


const OnBoarding = () => {
    let navigate = useNavigate()

    const [cookies, setCookie, removeCookie] = useCookies(null)

    const [formData, setFormData] = useState ({
        user_id: cookies.UserId,
        first_name: '',
        personality: [], 
        url: '', 
        about: '', 
        matches: [], 
        interested_event_ids: [],
    })

    const handleSubmit = async (e) => {
        // console.log("Submitted")
        e.preventDefault()

        try {
            const response = await axios.put('http://localhost:8000/user', {formData})

            console.log(response)

            const success = response.status == 200

            if (success) navigate ('/dashboard')
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

        // if (personality[0] === "" ) {       // If first entry to personality
        //     setFormData((prevState) => ({
        //         ...prevState,
        //         personality: [value]
        //     }))
        // }
        setFormData((prevState) => ({
            ...prevState,
            personality: prevState.personality.concat(value)
        }))
    }

    // console.log(formData)

    return (
        <>
            <Nav 
            setShowModel = {() => {}}
            showModel = {false}
            />
            <div className = "onboarding">
                <h2>Create Account</h2>

                <form onSubmit={handleSubmit}>
                    <section>
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
                                onChange = {handleCheckbox}
                                checked={formData.personality.includes("Introverted")}
                            />
                            <label htmlFor="personality1">Introverted</label>

                            <input 
                                id = "personality2"
                                type = "checkbox"
                                name = "personality"
                                value = "Extroverted"
                                onChange = {handleCheckbox}
                                checked={formData.personality.includes("Extroverted")}
                            />
                            <label htmlFor="personality2">Extroverted</label>

                            <input 
                                id = "personality3"
                                type = "checkbox"
                                name = "personality"
                                value = "Adventurous"
                                onChange = {handleCheckbox}
                                checked={formData.personality.includes("Adventurous")}
                            />
                            <label htmlFor="personality3">Adventurous</label>

                            <input 
                                id = "personality4"
                                type = "checkbox"
                                name = "personality"
                                value = "Easy-going"
                                onChange = {handleCheckbox}
                                checked={formData.personality.includes("Easy-going")}
                            />
                            <label htmlFor="personality4">Easy-going</label>

                            <input 
                                id = "personality5"
                                type = "checkbox"
                                name = "personality"
                                value = "Quiet"
                                onChange = {handleCheckbox}
                                checked={formData.personality.includes("Quiet")}
                            />
                            <label htmlFor="personality5">Quiet</label>
                        </div>
                        <input type = "submit"/>
                    </section>

                    <section>
                        <label htmlFor="about">Profile Picture</label>
                            <input 
                                type = "url"
                                name = "url"
                                id = "url"
                                required = {true}
                                onChange = {handleChange}
                            />

                            <div className = "photo-container">
                                {formData.url && <img src={formData.url} alt = "Preview"/>}
                            </div>
                    </section>
                </form>
            </div>
        </>
    )
}
export default OnBoarding