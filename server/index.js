const PORT = 8000
const express = require('express')

const { MongoClient } = require('mongodb')

const { v4: uuidv4 } = require('uuid')

const jwt = require('jsonwebtoken')

const cors = require('cors')

const bcrypt = require('bcrypt')
const { restart } = require('nodemon')

// require('.dotenv').config()

// const uri = process.env.URI
// Add your mongodb uri here: mongodb+srv://.......
const uri = '';

const app = express()
app.use(cors())
app.use(express.json())

app.get('/', (req, res) => {
    res.json('Hello to app')
})

app.post('/signup', async (req, res) => {
    const client = new MongoClient(uri)
    const { email, password } = req.body

    const generatedUserId = uuidv4()

    const hashedPassword = await bcrypt.hash(password, 10)

    try {
        await client.connect()
        const database = client.db('app-data')
        const users = database.collection('users')

        const existingUser = await users.findOne({ email })

        if (existingUser) {
            return res.status(409).send('User already exists. Please log in')
        }

        const sanitizedEmail = email.toLowerCase()

        const data = {
            user_id: generatedUserId,
            email: sanitizedEmail,
            hashed_password: hashedPassword
        }

        const insertedUser = await users.insertOne(data)

        const token = jwt.sign(insertedUser, sanitizedEmail, {
            expiresIn: 60 * 24
        })

        res.status(201).json({ token, userId: generatedUserId })
    } catch(err) {
        console.log(err)
    }
})

app.post('/login', async (req, res) => {
    const client = new MongoClient(uri)
    const { email, password } = req.body

    try {
        await client.connect()
        const database = client.db('app-data')
        const users = database.collection('users')

        const user = await users.findOne({ email })

        const correctPassword = await bcrypt.compare(password, user.hashed_password)

        if (user && correctPassword) {
            const token = jwt.sign(user, email, {
                expiresIn: 60 * 24
            })

            res.status(201).json( { token, userId: user.user_id })
        }
        res.status(400).send('Invalid Email or Password')
    } catch(err) {
        console.log(err)
    } 
})

app.get('/personality-users', async (req, res) => {
    const client = new MongoClient(uri)
    
    const personality  = req.query.personality
    let interested_event_ids = req.query.interested_event_ids

    // console.log('personality: ', personality)

    if (!interested_event_ids) {
        // console.log("Null event ids")
        interested_event_ids = []
    }
    // console.log('interested_event_ids: ', interested_event_ids)
    
    try {
        await client.connect()
        const database = client.db('app-data')
        const users = database.collection('users')

        const query = { personality: { $in: personality},
                        interested_event_ids: { $in: interested_event_ids}}

        const foundPersonalityUsers = await users.find(query).toArray()

        // add from user

        res.send(foundPersonalityUsers)
    } finally {
        await client.close()
    }
})

// Get ONE user
app.get('/user', async (req, res) => {
    const client = new MongoClient(uri)
    const userId = req.query.userId

    // console.log('userid: ', userId)
    
    try {
        await client.connect()
        const database = client.db('app-data')
        const users = database.collection('users')

        const query = { user_id: userId }

        const user = await users.findOne(query)
        res.send(user)
    } finally {
        await client.close()
    }
})

// get matched users
app.get('/users', async (req, res) => {
    const client = new MongoClient(uri)
    const userIds = JSON.parse(req.query.userIds)

    // console.log(userIds)

    try {
        await client.connect()
        const database = client.db('app-data')
        const users = database.collection('users')

        const pipeline = 
        [
            {
                '$match' : {
                    'user_id': {
                        '$in': userIds
                    }
                }
            }
        ]
        const foundUsers = await users.aggregate(pipeline).toArray()
        
        // console.log(foundUsers)

        res.send(foundUsers)
    } finally {
        await client.close()
    }
})

// Update user
app.put('/user', async (req, res) => {
    const client = new MongoClient(uri)

    const formData = req.body.formData

    try {
        await client.connect()
        const database = client.db('app-data')
        const users = database.collection('users')

        const query = { user_id: formData.user_id }
        const updateDocument = {
            $set: {
                first_name: formData.first_name,
                about: formData.about,
                url: formData.url,
                matches: formData.matches,
                personality: formData.personality, 
                interested_event_ids: formData.interested_event_ids
            },
        }

        const insertedUser = await users.updateOne(query, updateDocument)

        res.send(insertedUser)
    } finally {
        await client.close()
    }
})

app.get('/messages', async (req, res)=> {
    const client = new MongoClient(uri)
    const { userId, correspondingUserId } = req.query

    // console.log(userId, correspondingUserId)

    try {
        await client.connect()

        const database = client.db('app-data')

        const messages = database.collection('chats')

        const query = {
            from_userId: userId,
            to_userId: correspondingUserId
        }

        const foundMessages = await messages.find(query).toArray()
        res.send(foundMessages)
    } finally {
        await client.close()
    }
})

app.post('/message', async (req, res)=> {
    const client = new MongoClient(uri)
    const data = req.body

    // console.log("reached /message")

    try {
        await client.connect()

        const database = client.db('app-data')

        const messages = database.collection('chats')

        const message = {
            timestamp: new Date().toISOString(),
            from_userId: data.userId,
            to_userId: data.clickedUserId,
            message: data.textArea
        }
        const insertedMessage = await messages.insertOne(message)

        res.send(insertedMessage)
    } finally {
        await client.close()
    }
})

app.put('/addmatch', async (req, res) => {
    const client = new MongoClient(uri)
    const { userId, matchedUserId } = req.body

    // console.log("addmatch called")

    try {
        await client.connect()

        const database = client.db('app-data')
        const users = database.collection('users')

        const query = { user_id: userId }

        // console.log("addmatch called")

        // console.log(users.find( { matches: { user_id: matchedUserId }}))

        // if (!users.find( { matches: { user_id: matchedUserId }})) {

        // console.log("added")
        const updateDocument = {
            $addToSet: {matches: { user_id: matchedUserId }}
        }

        const user = await users.updateOne(query, updateDocument)

        res.send(user)
    } finally {
        await client.close()
    }
})

app.post('/addEvent', async (req, res) => {
    const client = new MongoClient(uri)
    const formData = req.body.formData

    const generatedEventId = uuidv4()

    try {
        await client.connect()
        const database = client.db('app-data')
        const events = database.collection('events')

        const data = {
            event_id: generatedEventId,
            eventName: formData.eventName,
            time: formData.time,
            loc: formData.loc,
            url: formData.url,
            created_by: formData.created_by
        }

        const insertedEvent = await events.insertOne(data)

        res.send(insertedEvent)
    } catch(err) {
        console.log(err)
    }
})

app.get('/getEvent', async (req, res)=> {
    const client = new MongoClient(uri)

    try {
        await client.connect()

        const database = client.db('app-data')

        const events = database.collection('events')

        const returnedEvents = await events.find().toArray()

        // console.log(returnedEvents)

        res.send(returnedEvents)
    } finally {
        await client.close()
    }
})

app.put('/addToEvent', async (req, res) => {
    const client = new MongoClient(uri)

    // pass event id & user id
    const { userId, eventId } = req.body

    console.log("user id: ", userId, "event id: ", eventId)

    try {
        await client.connect()

        const database = client.db('app-data')
        const users = database.collection('users')

        const query = { user_id: userId }
        
        const updateDocument = {
            $addToSet: { interested_event_ids: eventId}
        }

        const user = await users.updateOne(query, updateDocument)

        res.send(user)
    } finally {
        await client.close()
    }
})

app.listen(PORT, () => console.log("Server running on port: " + PORT))