const Dev = require('../models/Dev')

module.exports = {
    async store(request, response){

        const { devId } = request.params
        const { user } = request.headers

        const targetDev = await Dev.findById(devId)

        if(!targetDev){
            return response.status(400).json({ error: 'Dev not exists' })
        }

        const loggedDev = await Dev.findById(user)

        if(!loggedDev){
            return response.status(400).json({ error: 'Logged Dev not exists' })
        }

        loggedDev.dislikes.push(targetDev._id)

        await loggedDev.save();
        
        return response.json(loggedDev)
    }
}