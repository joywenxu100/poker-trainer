"""
生成球队统计排行榜图片
需要安装：pip install selenium pillow
"""
import os
import time
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from PIL import Image

def generate_dashboard_image():
    """生成排行榜图片"""
    
    # 获取HTML文件路径
    html_path = os.path.abspath("team_statistics_dashboard.html")
    html_url = f"file:///{html_path}"
    
    # 设置Chrome选项
    chrome_options = Options()
    chrome_options.add_argument('--headless')  # 无头模式
    chrome_options.add_argument('--disable-gpu')
    chrome_options.add_argument('--no-sandbox')
    chrome_options.add_argument('--window-size=1920,1080')
    
    print("正在启动浏览器...")
    driver = webdriver.Chrome(options=chrome_options)
    
    try:
        # 访问页面
        print(f"正在加载页面: {html_url}")
        driver.get(html_url)
        
        # 等待页面加载和动画完成
        time.sleep(3)
        
        # 获取页面总高度
        total_height = driver.execute_script("return document.body.scrollHeight")
        driver.set_window_size(1920, total_height)
        
        # 等待重新渲染
        time.sleep(1)
        
        # 截图保存为PNG
        png_path = "team_statistics_dashboard.png"
        print(f"正在截图保存到: {png_path}")
        driver.save_screenshot(png_path)
        
        # 转换为JPG
        print("正在转换为JPG格式...")
        img = Image.open(png_path)
        
        # 如果是RGBA模式，转换为RGB
        if img.mode == 'RGBA':
            # 创建白色背景
            background = Image.new('RGB', img.size, (255, 255, 255))
            background.paste(img, mask=img.split()[3])  # 使用alpha通道作为mask
            img = background
        
        # 保存为JPG
        jpg_path = "team_statistics_dashboard.jpg"
        img.save(jpg_path, 'JPEG', quality=95, optimize=True)
        
        print(f"✅ 成功生成图片: {jpg_path}")
        print(f"图片尺寸: {img.size}")
        
        # 删除临时PNG文件
        if os.path.exists(png_path):
            os.remove(png_path)
            
        # 打开结果文件夹
        os.startfile(os.path.dirname(os.path.abspath(jpg_path)))
        
    except Exception as e:
        print(f"❌ 生成图片失败: {e}")
        print("\n请确保已安装Chrome浏览器和ChromeDriver")
        print("安装说明：")
        print("1. pip install selenium pillow")
        print("2. 下载ChromeDriver: https://chromedriver.chromium.org/")
        
    finally:
        driver.quit()
        print("浏览器已关闭")

if __name__ == "__main__":
    print("=" * 60)
    print("球队统计排行榜 - 图片生成工具")
    print("=" * 60)
    generate_dashboard_image()
    print("\n按任意键退出...")
    input()

