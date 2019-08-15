const Stock = require('../models/stocks')

exports.followStock = async function (req, res) {
    const stock = req.body
    try {
        await Stock.create(stock)
        res.send('Following stock successfully')
    } catch (err) {
        console.log(err)
        res.send(null)
        return
    }
}

exports.fetchStock = async function (req, res) {
    const stock = req.query
    try {
        const result = await Stock.findOne({ name: stock.name, symbol: stock.symbol, userId: stock.userId, region: stock.region })
        if (!result) return res.send(false)
        return res.send(true)
    } catch (err) {
        console.log(err)
        res.send(null)
        return
    }
}

exports.unfollowStock = async function (req, res) {
    const stock = req.body
    try {
        const result = await Stock.deleteOne({ name: stock.name, symbol: stock.symbol, userId: stock.userId, region: stock.region })
        if (!result) return res.send(false)
        return res.send(true)
    } catch (err) {
        console.log(err)
        res.send(null)
        return
    }
}

exports.fetchStocks = async function (req, res) {
    const stock = req.query
    try {
        const result = await Stock.find({ userId: stock.userId })
        if (!result) return res.send(null)
        return res.send(result)
    } catch (err) {
        console.log(err)
        res.send(null)
        return
    }
}

exports.searchPortifolio = async function (req, res) {
    const searchText = req.query.text
    const userId = req.query.userId
    try {
        const result = await Stock.find({
            $or: [
                {
                    name: { $regex: searchText, $options: 'i' },
                    userId: userId
                },
                {
                    symbol: { $regex: searchText, $options: 'i' },
                    userId: userId
                }
            ]
        })
        if (!result) return res.send(null)
        return res.send(result)
    } catch (err) {
        console.log(err)
        res.send(null)
        return
    }
}