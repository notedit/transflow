"use client"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { FloatingTranslator } from "./floating-translator"
import { Facebook, Twitter } from "lucide-react"
import Image from "next/image"
import { useState } from "react"
import { createRoot } from "react-dom/client"

export  function LandingPage() {
  
  const [pipWindow, setPipWindow] = useState<Window | null>(null);
  console.log(pipWindow);

  const handlePiPClick = async () => {
    try {
      
      // @ts-expect-error - Document PiP API is not yet in TypeScript types
      if (!window.documentPictureInPicture) {
        alert("您的浏览器不支持 Picture-in-Picture 功能");
        return;
      }

      // 创建 PiP 窗口
      // @ts-expect-error - Document PiP API is not yet in TypeScript types
      const _pipWindow = await window.documentPictureInPicture.requestWindow({
        width: 600,
        height: 300,
        x: 100,
        y: 100,
        lockAspectRatio: true,
        copyStyleSheets: true,
        title: "TransFloat 翻译窗口"
      });

      // 添加基础样式
      const style = _pipWindow.document.createElement('style');
      style.textContent = `
        body { margin: 0; padding: 0; }
        #pip-root { width: 100%; height: 100%; }
      `;
      _pipWindow.document.head.appendChild(style);

      // 确保在渲染前设置文档类型
      _pipWindow.document.documentElement.innerHTML = '<head></head><body></body>';
      
      // 复制样式表
      document.querySelectorAll('link[rel="stylesheet"]').forEach(styleSheet => {
        const clone = styleSheet.cloneNode(true) as HTMLLinkElement;
        _pipWindow.document.head.appendChild(clone);
      });

      const pipRoot = _pipWindow.document.createElement('div');
      pipRoot.id = 'pip-root';
      _pipWindow.document.body.appendChild(pipRoot);

      const root = createRoot(pipRoot);
      root.render(
        <FloatingTranslator pipWindow={_pipWindow} onClose={() => {
          _pipWindow.close();
          setPipWindow(null);
        }} />
      );

      _pipWindow.document.title = "TransFloat 翻译窗口";

      setPipWindow(_pipWindow);

      // 监听窗口关闭事件
      _pipWindow.addEventListener('pagehide', () => {
        setPipWindow(null);
      });

    } catch (error) {
      console.error('Failed to open PiP window:', error);
      alert("打开浮窗失败，请检查浏览器设置");
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Header */}
      <header className="w-full bg-blue-600 shadow-sm"> {/* Updated header background color */}
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center">
           
            <span className="text-2xl font-bold text-white">TransFloat</span>
          </div>
          <nav>
            <ul className="flex space-x-4">
              <li><a href="#" className="text-white hover:text-blue-100">首页</a></li>
              <li><a href="#" className="text-white hover:text-blue-100">产品</a></li>
              <li><a href="#" className="text-white hover:text-blue-100">关于我们</a></li>
              <li><a href="#" className="text-white hover:text-blue-100">联系我们</a></li>
            </ul>
          </nav>
        </div>
      </header>

      <main className="flex-grow">
        {/* Hero Section */}
        <section className="w-full max-w-6xl mx-auto px-4 py-16 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 text-blue-600">
            TransFloat 实时翻译浮窗
          </h1>
          <h3 className="text-xl text-gray-600 mb-2">Transfloat，让语言不再是障碍，让跨语言交流更轻松！</h3>
          <h3  className="text-xl text-gray-600 mb-8">
          桌面浮窗设计，随开随用, 实时翻译，即时响应, 专业翻译引擎支持, 低资源占用，流畅运行
          </h3>
          <Button 
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-6 text-lg rounded-md"
            onClick={handlePiPClick}
          >
            立即使用
          </Button>
          
          <div className="mt-16">
            <Image 
              src="/images/a-technical-line-art-illustration-of-an-innovative.png" 
              alt="Platform Interface Illustration"
              className="mx-auto"
              width={600}
              height={300}
            />
          </div>
        </section>

        {/* Services Section */}
        <section className="w-full bg-gray-50 py-16">
          <div className="max-w-6xl mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12"> 产品亮点</h2>
            
            <div className="grid md:grid-cols-3 gap-8">
              {/* Audio/Video Subtitles Card */}
              <Card className="border-2 border-blue-600 shadow-lg bg-white"> {/* Updated card background color */}
                <CardContent className="p-6">
                  <div className="h-48 flex items-center justify-center mb-6">
                    <Image
                      src="/images/a-minimalist-line-art-illustration-of-a-floating-d.png" 
                      alt="Audio/Video Subtitles"
                      className="h-36"
                      width={240}
                      height={180}
                    />
                  </div>
                  <h3 className="text-xl font-bold mb-4">智能浮窗，随处可见</h3>
                  <p className="text-gray-600 mb-6">
                    <span style={{ display: 'block' }}>- 创新桌面浮窗设计，灵活调整位置和大小</span>
                    <span style={{ display: 'block' }}>- 始终置顶显示，不影响其他操作</span>
                    <span style={{ display: 'block' }}>- 简约界面，零干扰体验</span>
                  </p>
                  <div className="flex flex-wrap gap-2">
                    
                  </div>
                </CardContent>
              </Card>

              {/* Live Subtitles Card */}
              <Card className="border-2 border-blue-600 shadow-lg bg-white"> {/* Updated card background color */}
                <CardContent className="p-6">
                  <div className="h-48 flex items-center justify-center mb-6">
                    <Image
                      src="/images/a-technical-line-art-illustration-of-a-dual-purpos.png" 
                      alt="Live Subtitles"
                      className="h-36"
                      width={240}
                      height={180}
                    />
                  </div>
                  <h3 className="text-xl font-bold mb-4">多场景实时翻译</h3>
                  <p className="text-gray-600 mb-6">
                    <span style={{ display: 'block' }}>- 视频字幕即时翻译，轻松追剧无语言障碍</span>
                    <span style={{ display: 'block' }}>- 在线会议实时翻译，跨语言沟通无压力</span>
                    <span style={{ display: 'block' }}>- 文档阅读翻译辅助，提升学习工作效率</span>
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {/* <Button variant="link" className="text-blue-600 p-0 h-auto">实时转写翻译</Button>
                    <Button variant="link" className="text-blue-600 p-0 h-auto">接入直播</Button>
                    <Button variant="link" className="text-blue-600 p-0 h-auto">技术咨询</Button>
                    <Button variant="link" className="text-blue-600 p-0 h-auto">精准识别工作台</Button> */}
                  </div>
                </CardContent>
              </Card>

              {/* Human Translation Card */}
              <Card className="border-2 border-blue-600 shadow-lg bg-white"> {/* Updated card background color */}
                <CardContent className="p-6">
                  <div className="h-48 flex items-center justify-center mb-6">
                    <Image
                      src="/images/a-minimalist-line-art-illustration-of-a-floating-d (1).png" 
                      alt="Human Translation"
                      className="h-36"
                      width={240}
                      height={180}
                    />
                  </div>
                  <h3 className="text-xl font-bold mb-4">强大核心功能</h3>
                  <p className="text-gray-600 mb-6">
                    <span style={{ display: 'block' }}>- 支持多语言互译</span>
                    <span style={{ display: 'block' }}>- 毫秒级响应速度</span>
                    <span style={{ display: 'block' }}>- 智能识别多种字幕格式</span>

                  </p>
                  <div className="flex flex-wrap gap-2">
                    {/* <Button variant="link" className="text-blue-600 p-0 h-auto">语种介绍</Button>
                    <Button variant="link" className="text-blue-600 p-0 h-auto">私人定制服务</Button>
                    <Button variant="link" className="text-blue-600 p-0 h-auto">专业咨询</Button>
                    <Button variant="link" className="text-blue-600 p-0 h-auto">高质高效</Button> */}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="w-full bg-gray-800 text-white py-8">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h4 className="text-lg font-semibold mb-4">关于 TransFloat</h4>
              <p className="text-sm">TransFloat 是一个创新的音视频字幕平台，致力于提供高质量、高效率的字幕解决方案。</p>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">快速链接</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-sm hover:text-blue-400">首页</a></li>
                <li><a href="#" className="text-sm hover:text-blue-400">产品</a></li>
                <li><a href="#" className="text-sm hover:text-blue-400">关于我们</a></li>
                <li><a href="#" className="text-sm hover:text-blue-400">联系我们</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">联系我们</h4>
              <p className="text-sm">邮箱：info@transfloat.com</p>
              <p className="text-sm">电话：+86 123 4567 8900</p>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">关注我们</h4>
              <div className="flex space-x-4">
                <a href="#" className="text-white hover:text-blue-400">
                  <span className="sr-only">Facebook</span>
                  <Facebook className="w-6 h-6" />
                </a>
                <a href="https://twitter.com/leeoxiang" className="text-white hover:text-blue-400">
                  <span className="sr-only">X/Twitter</span>
                  <Twitter className="w-6 h-6" />
                </a>
              </div>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-700 text-center">
            <p className="text-sm">&copy; 2024 transfloat. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}