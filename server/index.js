import express from 'express'
import logger from 'morgan'
import dotenv from 'dotenv'
import { createClient } from '@libsql/client'

import { Server } from 'socket.io'
import { createServer } from 'node:http' 

dotenv.config()
const port = process.env.PORT ?? 3000

const app = express()
const server = createServer(app)
const io = new Server(server, {
    connectionStateRecovery: {}
})

const db = createClient({
    url: 'libsql://humble-toad-men-jhojan206.turso.io',
    authToken: 'eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE3Mjc3MjQ5NDIsImlkIjoiN2Y1NzMzMzktNmExYy00OThkLTg2OWItMmYwNGRlMmZkN2U0In0.86097ZhQGqeuB_WexRIwagHOhnsyAfVW3p9Ql7_-yfyh3CggJoWE5ZOac5n9cnAH7W225FsLDgcUQnQl18O_DQ'
})
await db.execute(`
    CREATE TABLE IF NOT EXISTS messages (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      content TEXT,
      user TEXT
    )
`)

io.on('connection', async (socket) => {
    console.log('a user has connected!')
  
    socket.on('disconnect', () => {
        console.log('an user has disconnected')
    })
  
    socket.on('chat message', async (msg) => {
        let result
        const username = socket.handshake.auth.username ?? 'anonymous'
        console.log({ username })
        try {
            result = await db.execute({
            sql: 'INSERT INTO messages (content, user) VALUES (:msg, :username)',
            args: { msg, username }
            })
        } catch (e) {
            console.error(e)
            return
        }
    
        io.emit('chat message', msg, result.lastInsertRowid.toString(), username)
    })

    // Cuando se reconecte, enviar los mensajes almacenados
    socket.on('connect', () => {
        if ('serviceWorker' in navigator && 'SyncManager' in window) {
            navigator.serviceWorker.ready.then(registration => {
                return registration.sync.register('sync-messages');
            });
        } else {
            // Si no está disponible el service worker o la sincronización en segundo plano
            const offlineMessages = JSON.parse(localStorage.getItem('offlineMessages')) || [];
            offlineMessages.forEach(({ msg }) => {
                socket.emit('chat message', msg);
            });
            localStorage.removeItem('offlineMessages');
    }
    });

    if (!socket.recovered) { // <- recuperase los mensajes sin conexión
      try {
        const results = await db.execute({
          sql: 'SELECT id, content, user FROM messages WHERE id > ?',
          args: [socket.handshake.auth.serverOffset ?? 0]
        })
  
        results.rows.forEach(row => {
          socket.emit('chat message', row.content, row.id.toString(), row.user)
        })
        } catch (e) {
        console.error(e)
        }
    }
})

app.use(logger('dev'))

//para abrir el index html a ingresar a esta ruta
app.get('/', (req, res)=>{
    res.sendFile('C:/Users/jacom/Documents/Proyectos/Foro De Eventos/client/index.html')
})

server.listen(port, () => {
    console.log('server sunning on port' + port)
})