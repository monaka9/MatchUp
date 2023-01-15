import TinderCard from "react-tinder-card"
import { useEffect, useState } from "react"
import ChatContainer from "../components/ChatContainer"
import axios from "axios"
import { useCookies } from 'react-cookie'
import SetPreferences from "../components/SetPreferences"
import Events from "../components/Events"

const Dashboard = () => {
    const [user, setUser] = useState(null)
    const [personalityUsers, setPersonalityUsers] = useState(null)
    const [cookies, setCookie, removeCookie] = useCookies(['user'])
    const [lastDirection, setLastDirection] = useState()
    const [showPreferences, setShowPreferences] = useState(false)
    const [showEvents, setShowEvents] = useState(false)

    

    const userId = cookies.UserId

    // console.log('userid: ', userId)

    const getUser = async () => {
        try {
            const response = await axios.get('http://localhost:8000/user', {
                params: { userId }
            })

            setUser(response.data)
        } catch(err) {
            console.log(err)
        }
    }

    const getPersonalityUsers = async () => {
        const personality = user.personality
        const interested_event_ids = user.interested_event_ids
        // console.log("Personality in get: ", personality)
        // console.log("Interested event ids in get:", interested_event_ids)
        try {
            const response = await axios.get('http://localhost:8000/personality-users', {
                params: {
                    personality, 
                    interested_event_ids
                },
                // if user exists, get their gender_interest
            })

            setPersonalityUsers(response.data)
        } catch(err) {
            console.log(err)
        }
    }

    useEffect(() => {
        getUser()
        // getPersonalityUsers()
    }, [])

    useEffect((user) => {
        getPersonalityUsers()
    })

    // console.log('user', user)
    // console.log('personality matched users', personalityUsers)

    // we are sending FROM here
    const updateMatches = async (matchedUserId) => {
        try {
            await axios.put('http://localhost:8000/addmatch', {
                userId, 
                matchedUserId
            })
            getUser()
        } catch(err) {
            console.log(err)
        }
    }

    const swiped = (direction, swipedUserId) => {

        if (direction === 'right') {
            updateMatches(swipedUserId)
        }
        setLastDirection(direction)
    }

    const outOfFrame = (name) => {
        console.log(name + 'left the screen')
    }

    // add own userID so you dont see yourself on the feed
    const matchedUserIds = user?.matches.map(({ user_id }) => user_id).concat(userId)

    const filteredPersonalityUsers = personalityUsers?.filter(
        personalityUser => !matchedUserIds.includes(personalityUser.user_id)
    )

    // console.log("filtered personality users: ", filteredPersonalityUsers)
    // console.log("matchedUserIds", matchedUserIds)

    return (
        <>
            {user &&
            <div className="dashboard">
                <ChatContainer setShowPreferences={setShowPreferences} setShowEvents={setShowEvents} user = {user} />
                <div className="swipe-container">
                    <div className="card-container">
                        {filteredPersonalityUsers?.map((personalityUser) => 
                            <TinderCard
                                className="swipe"
                                key={ personalityUser.user_id }
                                onSwipe={(dir) => swiped(dir, personalityUser.user_id)}
                                onCardLeftScreen={() => outOfFrame(personalityUser.first_name)}
                                preventSwipe={["up", "down"]}
                            >
                                <div
                                style={{ backgroundImage: "url(" + personalityUser.url + ")"}}
                                className="card">
                                <h3>{personalityUser.first_name}</h3>
                                </div>
                            </TinderCard>
                        )}
                        <div className="swipe-info">
                            {lastDirection ? <p>You swiped {lastDirection}</p> : <p/>}
                        </div>
                    </div>
                </div>
            </div>
            }

            {
                showPreferences &&
                <SetPreferences setShowPreferences={setShowPreferences} user={user}/>
            }

            {   showEvents &&
                <Events setShowEvents={setShowEvents} user={user} />
            }
        </>
    );
}
export default Dashboard