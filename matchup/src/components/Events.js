import { useEffect, useState } from "react"
import axios from "axios"
import { useCookies } from "react-cookie"

const Events = ({ user, setShowEvents }) => {
    const [cookies, setCookie, removeCookie] = useCookies(['user'])
    const [viewEvents, setViewEvents] = useState(true)
    const [addEvent, setAddEvent] = useState(false)
    const [showSuccess, setShowSuccess] = useState(false)
    const [events, setEvents] = useState(null)

    // console.log(user)
    const [formData, setFormData] = useState ({
        eventName: '',
        time: '',
        loc: '', 
        url: '',
        created_by: user.first_name
    })

    const handleClick = () => {
        setShowEvents(false)
    }

    // Add events
    const handleAdd = async (e) => {
        console.log("Submitted")
        e.preventDefault()

        try {
            const response = await axios.post('http://localhost:8000/addEvent', {formData})

            // console.log(response)

            const success = response.status == 200

            if (success) { setShowSuccess(true) }
        } catch(err) {
            console.log(err)
        }
    }

    // Retrieve events
    const getEvents = async () => {

        // console.log("GetEvents called")
        try {
            const response = await axios.get('http://localhost:8000/getEvent')

            setEvents(response.data)
        } catch(err) {
            console.log(err)
        }
    }

    useEffect(() => {
        getEvents()
    }, [])

    const handleChange = (e) => {
        const value = e.target.value
        const name = e.target.name

        setFormData((prevState) => ({
            ...prevState, 
            [name]:value 
        }))
    }

    const handleViewEvent = () => {
        setViewEvents(true)
        setAddEvent(false)
        setShowSuccess(false)
        getEvents()

        // console.log(addEvent)
    }

    const handleAddEvent = () => {
        setAddEvent(true)
        setViewEvents(false)

        // console.log(addEvent)
    }

    const handleInterest = async (passedEventId) => {
        const userId = user.user_id
        const eventId = passedEventId

        console.log("UserID", userId)
        console.log("Event Id", eventId)

        try {
            const response = await axios.put('http://localhost:8000/addToEvent', { userId, eventId })

            const success = response.status == 200

            console.log(success)

            // if (success) { setShowSuccess(true) }
        } catch(err) {
            console.log(err)
        }
    }

    return (
        <div className="events">
            <div className="switch-buttons">
                <input 
                id = "viewEvent"
                name = "viewEvent"
                type = "radio" 
                onClick={handleViewEvent}
                checked={viewEvents}
                />
                <label htmlFor="viewEvent">View Events</label>

                <input
                id = "addEvent"
                name = "viewEvent"
                type = "radio" 
                onClick={handleAddEvent}
                checked={addEvent}
                />
                <label htmlFor="addEvent">Add Event</label>
            </div>
            <div className="close-icon" onClick={handleClick}>ⓧ</div>
            
            <h2>Browse and create events!</h2>
            <hr/>

            { viewEvents && 
                <div className="event-list">
                    {events?.map((event) => 
                            <li>
                                <section>
                                    <img src={event.url} alt = "Preview"/>
                                </section>

                                <section>
                                    <h2>{event.eventName}</h2>
                                    <h4>Location: {event.loc}</h4>
                                    <h4>Time: {event.time}</h4>
                                    <h5>Created by: {event.created_by}</h5>
                                </section>

                                <input
                                key = {event.event_id}
                                id = {event.event_id}
                                type = "checkbox" 
                                onChange={() => handleInterest(event.event_id)}
                                checked={user.interested_event_ids.includes(event.event_id)}
                                />
                                <label for={event.event_id}>Add Event</label>
                                <hr/>
                            </li>
                        )}
                </div>
            }


            { addEvent && 
            <form onSubmit={handleAdd}>
                <div className = "multiple-input-container">
                    <label htmlFor="eventName">Event Name</label>
                    <input 
                        id = "eventName"
                        type = "text"
                        name = "eventName"
                        placeholder = "Event Name"
                        required = {true}
                        value = {formData.eventName}
                        onChange = {handleChange}
                    />

                    <label htmlFor="time">Time</label>
                    <input 
                        id = "time"
                        type = "text"
                        name = "time"
                        placeholder = "December 23rd, 2022 at 7 PM"
                        required = {true}
                        value = {formData.time}
                        onChange = {handleChange}
                    />

                    <label htmlFor="loc">Location</label>
                    <input 
                        id = "loc"
                        type = "text"
                        name = "loc"
                        placeholder = "The Metropolitan Museum of Art"
                        required = {true}
                        value = {formData.loc}
                        onChange = {handleChange}
                    />

                    <label htmlFor="url">Picture URL</label>
                    <input 
                        id = "url"
                        type = "text"
                        name = "url"
                        placeholder = "imgur.com/..."
                        required = {true}
                        value = {formData.url}
                        onChange = {handleChange}
                    />

                    <div className = "photo-container">
                        {formData.url && <img src={formData.url} alt = "Preview"/>}
                    </div>
                        
                    <input type = "submit"/>
                </div>

                { showSuccess && <h3>Event Added Successfully!</h3>}
                </form> 
            }
        </div>
    )
}

export default Events