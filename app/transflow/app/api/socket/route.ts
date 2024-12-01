import { Server as SocketIOServer } from 'socket.io'
import { NextResponse } from 'next/server'

// 保存 socket 实例
let io: SocketIOServer

// 初始化 Socket.IO
function initSocket(res) {
  if (!io) {
    
    const httpServer = res.socket?.server
    
    io = new SocketIOServer(httpServer, {
      path: '/api/socket',
      addTrailingSlash: false,
      cors: {
        origin: "*",
        methods: ["GET", "POST"]
      }
    })

    res.socket.server.io = io

    io.on('connection', (socket) => {
      console.log('Client connected:', socket.id)

      socket.on('audio-data', (data) => {
        console.log('Received audio data from:', socket.id)
        // 处理音频数据
        handleAudioData(socket, data)
      })

      socket.on('error', (error) => {
        console.error('Socket error:', error)
      })

      socket.on('disconnect', () => {
        console.log('Client disconnected:', socket.id)
      })
    })
  }
}

function handleAudioData(socket: any, data: Float32Array) { // eslint-disable-line @typescript-eslint/no-explicit-any
  try {
    // 处理音频数据
    socket.broadcast.emit('audio-processed', {
      userId: socket.id,
      data: data
    })
  } catch (error) {
    console.error('Error processing audio:', error)
    socket.emit('error', 'Failed to process audio data')
  }
}


export async function GET(req: Request, res:any) { // eslint-disable-line @typescript-eslint/no-explicit-any
  try {
    if (res.socket?.server?.io) {
      // Socket.IO 服务已存在
      return NextResponse.json({ success: true, message: 'Socket is already running' })
    }

    // 初始化 Socket.IO
    initSocket(res)
    return NextResponse.json({ success: true, message: 'Socket is initialized' })
  } catch (error) {
    console.error('Socket initialization error:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to start socket' },
      { status: 500 }
    )
  }
}
