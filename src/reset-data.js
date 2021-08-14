const fs = require('fs')
const fakeData = require('./fake-data')

fs.writeFile('./db.json', JSON.stringify(fakeData(), null, '\t'), () => {
    console.log('Generate data successfully')
})
