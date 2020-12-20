const fs = require('fs')
const http = require('http')
const url = require('url')

// fs.readFile('./txt/input.txt', 'utf-8', (err, res) => {
//     console.log(res)
// })

// console.log('file readed.')

const replaceCard =  (temp, product) => {
    let output = temp.replace(/{%PRODUCTNAME%}/g, product.productName)
    output = output.replace(/{%IMAGE%}/g, product.image)
    output = output.replace(/{%FROM%}/g, product.from)
    output = output.replace(/{%NUITRENTS%}/g, product.nutrients)
    output = output.replace(/{%PRICE%}/g, product.price)
    output = output.replace(/{%DESCRIPTION%}/g, product.description)
    output = output.replace(/{%ID%}/g, product.id)
    output = output.replace(/{%QUANTITY%}/g, product.quantity)

    if(!product.organic) output = output.replace(/{%NOTORGANIC%}/g, 'not-organic')

    return output;
}

const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, 'utf-8',)
const dataProfile = JSON.parse(data);
const overview = fs.readFileSync(`${__dirname}/templates/overview.html`, 'utf-8',)
const product = fs.readFileSync(`${__dirname}/templates/template-product.html`, 'utf-8',)
const card = fs.readFileSync(`${__dirname}/templates/template-card.html`, 'utf-8',)

const server = http.createServer((req, res) => {
    // const pathName = req.url;

    const {query, pathname} = url.parse(req.url, true);
    if(pathname === '/' || pathname === '/overview'){
        res.writeHead(200, {'Content-type': 'text/html'})
        const cardData = dataProfile.map(el => replaceCard(card, el)).join('')
        const tempOverview = overview.replace(/{%PRODUCTCARD%}/g, cardData)
        res.end(tempOverview)

    }else if(pathname === '/product'){
        //do something
        const pathId = dataProfile[query.id]
        const output = replaceCard(product, pathId)
        res.end(output)

    }else if(pathname === '/api'){
        // do something
    }else{
        res.writeHead(404, {'Content-type': 'text/html'})
        res.end('<h1>Sorry page not found</h1>')
    }
    
})

server.listen(3000, '127.0.0.1', () => {
    console.log('listening to server on port 3000')
})
