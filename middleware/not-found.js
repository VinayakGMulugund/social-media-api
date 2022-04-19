const notFound = (req,res) => {
    res.status(404).json('route not found')
}

module.exports = notFound