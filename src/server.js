require('dotenv').config()
const jsonServer = require('json-server')
const auth = require('json-server-auth')
const queryString = require('query-string')
const fakeData = require('./fake-data')
const app = jsonServer.create()
const router = jsonServer.router('db.json')
const middlewares = jsonServer.defaults()
const PORT = process.env.PORT || 3333

// Set default middlewares (logger, static, cors and no-cache)
app.use(middlewares)
app.use(auth)
app.use(jsonServer.bodyParser)
app.db = router.db

app.use((req, res, next) => {
    if (req.method === 'POST') {
        req.body.createdAt = Date.now()
        req.body.updatedAt = Date.now()
    } else if (req.method === 'PATCH') {
        req.body.updatedAt = Date.now()
    }
    next()
})

//Custom output for pagination
router.render = (req, res) => {
    const headers = res.getHeaders()
    const totalCountHeader = headers['x-total-count']
    if (req.method === 'GET' && totalCountHeader) {
        const queryParams = queryString.parse(req._parsedUrl.query)
        const result = {
            data: res.locals.data,
            pagination: {
                _page: Number.parseInt(queryParams._page) || 1,
                _limit: Number.parseInt(queryParams._limit) || 10,
                _totalRows: Number.parseInt(totalCountHeader),
            },
        }
        return res.jsonp(result)
    }
    res.jsonp({data: res.locals.data})
}

// List Router
app.get('/echo', (req, res) => {
    res.jsonp(req.query)
})
app.get('/refresh', (req, res) => {
    const content = fakeData()
    router.db.assign(content).write()
    res.jsonp(content)
})

app.use('/api', router)

app.listen(PORT, () => {
    console.log(`Server listening at: http://localhost:${PORT}`)
})
