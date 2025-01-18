//servidro web con http - ( manera engorrosa )

import http from 'http'

const server = http.createServer((req, res)=>{
    res.end('<h1>Mi primr hola con http - se ve en html</h1>')
})

server.listen(8080, ()=>{
    console.log('Servidor en 8080 funcionando')
})

// npm run dev     -  dev esta en el json