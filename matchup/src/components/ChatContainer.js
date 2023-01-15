import ChatHeader from "./ChatHeader"
import MatchesDisplay from "./MatchesDisplay"
import ChatDisplay from "./ChatDisplay"
import { useState } from "react"
import SetPreferences from "./SetPreferences"

const ChatContainer = ({ user, setShowPreferences, setShowEvents }) => {
    const [clickedUser, setClickedUser] = useState(null)

    // console.log('clickedUser', clickedUser)

    const handlePreferenceClick = () => {
        setShowPreferences(true)
    }

    const handleEventClick = () => {
        setShowEvents(true)
    }

    return (
        <div className="chat-container">
            <ChatHeader user = { user }/>

            <div>
                <button className="option" onClick={() => setClickedUser(null)}>Matches</button>
                <button className="option" disabled={!clickedUser}>Chat</button>
                <button className="option" onClick={handlePreferenceClick}>Set Personalities</button>
                <button className="option" onClick={handleEventClick}>Events</button>
            </div>
            
            {!clickedUser && <MatchesDisplay matches={user.matches} setClickedUser={setClickedUser}/>}

            {clickedUser && <ChatDisplay user={user} clickedUser={clickedUser}/>}
        </div>
    )
}

export default ChatContainer