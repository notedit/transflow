

export class AudioRecorder {
    private audioContext: AudioContext | null = null;
    private mediaStream: MediaStream | null = null;
    private processor: ScriptProcessorNode | null = null;
    private source: MediaStreamAudioSourceNode | null = null;
    private isRecording: boolean = false;
  
    // 可选的音频处理回调
    private onAudioProcess?: (data: Float32Array) => void;
  
    constructor(onAudioProcess?: (data: Float32Array) => void) {
      this.onAudioProcess = onAudioProcess;
    }
  
    async start(): Promise<void> {
      if (this.isRecording) {
        return;
      }
  
      try {
        // 初始化音频上下文
        this.audioContext = new AudioContext({ sampleRate: 16000 });
        
        // 获取音频流
        this.mediaStream = await navigator.mediaDevices.getUserMedia({
          audio: {
            channelCount: 1,
            sampleRate: 16000,
            echoCancellation: true,
            noiseSuppression: true,
          }
        });
  
        // 设置音频处理管道
        this.source = this.audioContext.createMediaStreamSource(this.mediaStream);
        this.processor = this.audioContext.createScriptProcessor(1024, 1, 1);
  
        this.source.connect(this.processor);
        this.processor.connect(this.audioContext.destination);
  
        // 处理音频数据
        this.processor.onaudioprocess = (e) => {
          const inputData = e.inputBuffer.getChannelData(0);
          this.onAudioProcess?.(inputData);
        };
  
        this.isRecording = true;
      } catch (error) {
        this.cleanup();
        throw error;
      }
    }
  
    stop(): void {
      this.cleanup();
    }
  
    private cleanup(): void {
      if (this.mediaStream) {
        this.mediaStream.getTracks().forEach(track => track.stop());
        this.mediaStream = null;
      }
  
      if (this.source) {
        this.source.disconnect();
        this.source = null;
      }
  
      if (this.processor) {
        this.processor.disconnect();
        this.processor = null;
      }
  
      if (this.audioContext) {
        this.audioContext.close();
        this.audioContext = null;
      }
  
      this.isRecording = false;
    }
  
    getIsRecording(): boolean {
      return this.isRecording;
    }
  }