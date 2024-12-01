"use client"

import * as React from "react"
import { Mic, Pause, Power, Settings } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Toggle } from "@/components/ui/toggle"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import io from "socket.io-client";
import { Socket } from "socket.io-client";

import { AudioRecorder } from "@/lib/audio-recorder";

interface FloatingTranslatorProps {
  pipWindow: Window;
  onClose: () => void;
}

export function FloatingTranslator({pipWindow, onClose }: FloatingTranslatorProps) {

  const pipWindowRef = React.useRef<Window | null>(pipWindow);
  const [isRecording, setIsRecording] = React.useState(false)
  const [isPowered, setIsPowered] = React.useState(true)
  const [isOriginalLanguage, setIsOriginalLanguage] = React.useState(false)
  const [showControls, setShowControls] = React.useState(true)
  const [audioDevice, setAudioDevice] = React.useState("default")
  const timeoutRef = React.useRef<NodeJS.Timeout | null>(null)
  const socketRef = React.useRef<Socket | null>(null);

  const audioRecorderRef = React.useRef<AudioRecorder | null>(null);

  console.log(pipWindowRef.current)
  console.log(onClose)

  React.useEffect(() => {
    // 初始化 Socket.IO 连接
    socketRef.current = io(window.location.origin, {
      path: '/api/socket',
      transports: ['websocket']
    });

    socketRef.current.on('connect', () => {
      console.log('Connected to socket server');
    });

    socketRef.current.on('error', (error) => {
      console.error('Socket error:', error);
      // 处理错误，例如显示错误提示
    });

    // 创建录音实例，并在回调中发送音频数据
    audioRecorderRef.current = new AudioRecorder((audioData) => {
      if (socketRef.current?.connected) {
        socketRef.current.emit('audio-data', audioData);
      }
    });

    return () => {
      // 清理
      if (audioRecorderRef.current?.getIsRecording()) {
        audioRecorderRef.current.stop();
      }
      socketRef.current?.disconnect();
    };
  }, []);

  const handleMouseEnter = () => {
    setShowControls(true)
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
  }

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setShowControls(false)
    }, 1000)
  }

  const handleStartRecording = async () => {
    try {
      await audioRecorderRef.current?.start();
      setIsRecording(true);
    } catch (error) {
      console.error("Error starting recording:", error);
    }
  }

  const handleStopRecording = () => {
    audioRecorderRef.current?.stop();
    setIsRecording(false);
  }

  return (
    <Card 
      className="w-full h-full bg-black/50 text-white border-none shadow-lg backdrop-blur-sm rounded-none"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <CardContent className="p-0 h-full">
        <div className="h-[calc(100%-50px)] p-6">
          <p className="text-lg">
            {isRecording 
              ? isOriginalLanguage 
                ? "正在识别中文..." 
                : "正在识别中文，将翻译成英语字幕..." 
              : "等待开始识别..."}
          </p>
        </div>
        <div 
          className={`
            flex items-center justify-start gap-2 p-3 bg-black/30
            transition-all duration-300 ease-in-out
            ${showControls ? 'opacity-100 max-h-[50px]' : 'opacity-0 max-h-0 overflow-hidden'}
          `}
        >
          <Button
            variant="ghost"
            size="icon"
            onClick={isRecording ? handleStopRecording : handleStartRecording}
            className="hover:bg-white/20"
            aria-label={isRecording ? "停止录音" : "开始录音"}
          >
            {isRecording ? (
              <Pause className="h-4 w-4" />
            ) : (
              <Mic className="h-4 w-4" />
            )}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className={`hover:bg-white/20 ${isPowered ? "text-primary" : "text-neutral-400"}`}
            onClick={() => setIsPowered(!isPowered)}
            aria-label={isPowered ? "关闭电源" : "打开电源"}
          >
            <Power className="h-4 w-4" />
          </Button>
          <Select value={audioDevice} onValueChange={setAudioDevice}>
            <SelectTrigger className="w-[100px] bg-transparent border-gray-600 text-sm rounded-full hover:bg-white/20 text-white">
              <SelectValue placeholder="选择音频设备" />
            </SelectTrigger>
            <SelectContent position="popper" side="top" className="bg-gray-800/70 border-gray-600 rounded-md backdrop-blur-sm">
              <SelectItem value="default" className="text-white hover:bg-gray-700/50">默认设备</SelectItem>
              <SelectItem value="mic1" className="text-white hover:bg-gray-700/50">麦克风 1</SelectItem>
              <SelectItem value="mic2" className="text-white hover:bg-gray-700/50">麦克风 2</SelectItem>
              <SelectItem value="speaker" className="text-white hover:bg-gray-700/50">扬声器</SelectItem>
            </SelectContent>
          </Select>
          <Button
            variant="outline"
            className="bg-transparent border-neutral-600 text-sm rounded-full hover:bg-white/20"
          >
            中 → 英
          </Button>
          <Toggle
            pressed={isOriginalLanguage}
            onPressedChange={setIsOriginalLanguage}
            className="bg-transparent border-neutral-600 text-sm rounded-full hover:bg-white/20 data-[state=on]:bg-transparent data-[state=on]:text-white"
            aria-label={isOriginalLanguage ? "切换到双语" : "切换到原语言"}
          >
            {isOriginalLanguage ? "原语言" : "双语"}
          </Toggle>
          <Button variant="ghost" size="icon" className="ml-auto hover:bg-white/20" aria-label="设置">
            <Settings className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}