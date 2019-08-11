const Dev = require('../models/Dev')

module.exports = {
    async store(request, response){
        console.log(request.io, request.connectedUsers)

        const { devId } = request.params
        const { user } = request.headers

        const targetDev = await Dev.findById(devId)

        if(!targetDev){
            return response.status(400).json({ error: 'Dev not exists' })
        }

        const loggedDev = await Dev.findById(user)

        if(targetDev.likes.includes(loggedDev._id)){
            const loggedSocket = request.connectedUsers[loggedDev._id]
            const targetSocket = request.connectedUsers[targetDev._id]

            if(loggedSocket){
                request.io.to(loggedSocket).emit('match', targetDev)
            }

            if(targetSocket){
                request.io.to(targetSocket).emit('match', loggedDev)
            }
        }

        loggedDev.likes.push(targetDev._id)

        await loggedDev.save();
        
        return response.json(loggedDev)
    }
}