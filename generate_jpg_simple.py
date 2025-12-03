"""
简单快速生成排行榜图片
安装命令: pip install html2image pillow
"""
from html2image import Html2Image
import os

def generate_jpg():
    """生成JPG图片"""
    print("=" * 60)
    print("🎨 球队统计排行榜 - 图片生成工具")
    print("=" * 60)
    
    # 获取HTML文件路径
    html_file = "team_statistics_dashboard.html"
    
    if not os.path.exists(html_file):
        print(f"❌ 找不到文件: {html_file}")
        return
    
    print(f"\n📄 读取文件: {html_file}")
    
    # 读取HTML内容
    with open(html_file, 'r', encoding='utf-8') as f:
        html_content = f.read()
    
    print("🖼️  正在生成图片...")
    
    # 创建Html2Image对象
    hti = Html2Image(
        output_path='.',
        size=(1920, 3000)  # 宽度x高度
    )
    
    # 生成图片
    output_file = 'team_statistics_dashboard'
    hti.screenshot(
        html_str=html_content,
        save_as=f'{output_file}.png',
        size=(1920, 3000)
    )
    
    print(f"✅ PNG图片已生成: {output_file}.png")
    
    # 转换为JPG
    print("🔄 正在转换为JPG格式...")
    try:
        from PIL import Image
        
        img = Image.open(f'{output_file}.png')
        
        # 转换为RGB模式
        if img.mode in ('RGBA', 'LA', 'P'):
            background = Image.new('RGB', img.size, (255, 255, 255))
            if img.mode == 'P':
                img = img.convert('RGBA')
            background.paste(img, mask=img.split()[-1] if img.mode == 'RGBA' else None)
            img = background
        
        # 保存为JPG
        img.save(f'{output_file}.jpg', 'JPEG', quality=95, optimize=True)
        print(f"✅ JPG图片已生成: {output_file}.jpg")
        
        # 删除PNG文件
        if os.path.exists(f'{output_file}.png'):
            os.remove(f'{output_file}.png')
            print("🗑️  已删除临时PNG文件")
        
        # 打开文件夹
        print(f"\n📂 正在打开结果文件夹...")
        os.startfile(os.path.abspath('.'))
        
        print("\n" + "=" * 60)
        print("✨ 图片生成完成！")
        print("=" * 60)
        
    except ImportError:
        print("⚠️  请先安装Pillow库: pip install pillow")
    except Exception as e:
        print(f"❌ 转换失败: {e}")

if __name__ == "__main__":
    try:
        generate_jpg()
    except ImportError:
        print("❌ 请先安装依赖库:")
        print("   pip install html2image pillow")
    except Exception as e:
        print(f"❌ 生成失败: {e}")
    
    print("\n按回车键退出...")
    input()

