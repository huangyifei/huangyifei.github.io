import os

old_url = '''"https://github.com/iissnan/hexo-theme-next"'''
new_url = '''"https://beian.miit.gov.cn/"'''

old_text ='NexT.Muse'
new_text ='主体备案号：京ICP备16052131号'
old_text1 ='技术大杂烩'
new_text1 ='个人技术经验点滴积累'
old_text2 ='黄怡菲的博客'
new_text2 ='互联网技术大杂烩'
old_text3 ='主题 -'
new_text3 =''

for (dirpath, dirnames, filenames) in os.walk('.'):
    for filename in filenames:
        if filename.endswith('.html'):
            f=open(os.path.join(dirpath,filename), 'r');
            content=f.read()
            newcontent=content.replace(old_url,new_url)
            newcontent=newcontent.replace(old_text,new_text)
            newcontent=newcontent.replace(old_text1,new_text1)
            newcontent=newcontent.replace(old_text2,new_text2)
            newcontent=newcontent.replace(old_text3,new_text3)
            f.close()
            f=open(os.path.join(dirpath,filename), 'w');
            f.write(newcontent)
            f.close()
