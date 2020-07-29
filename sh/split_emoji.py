#!/usr/bin/python
# -*- coding: utf-8 -*-


# 用python3 sh/split_emoji.py 运行

import os
from PIL import Image

pwd = os.path.split(os.path.realpath(__file__))[0]

srcDirs = [os.path.join(pwd, '../emoji/emoji_part_1'), os.path.join(pwd, '../emoji/emoji_part_2')]
destDirs = [os.path.join(pwd, '../assets/resources/emo1'), os.path.join(pwd, '../assets/resources/emo2')]

emoji_width = 160
emoji_height = 160


def convertEmoji(srcDir, destDir, name):
    currentDir = os.path.join(srcDir, name)

    if not os.path.exists(os.path.join(destDir, name)):
        os.mkdir(os.path.join(destDir, name))

    for filename in os.listdir(currentDir):
        if filename.endswith('.meta'):
            os.remove(os.path.join(currentDir, filename))
            continue

        im = Image.open(os.path.join(currentDir, filename))
        im = im.resize((emoji_width, emoji_height), Image.ANTIALIAS)

        index = filename[len('frame_'):].index('_')
        num = filename[len('frame_'): len('frame_') + index]  # 帧顺序

        index = filename.index('-')
        time = int(float(filename[index+1:-5]) * 1000)
        
        # 压缩保存
        im.save(os.path.join(os.path.join(destDir,  name), num + '-' + str(time) + '.png'), optimize=True)


def main():
    for i in range(0, len(srcDirs)):
        for filename in os.listdir(srcDirs[i]):
            if not filename.endswith('.gif') and not filename.startswith('.'):
                convertEmoji(srcDirs[i], destDirs[i], filename)


if __name__ == "__main__":
    main()





# def convert(name):
#     im = Image.open(os.path.join(srcDir, name + '.gif'))
#     if not os.path.exists(os.path.join(destDir, name)):
#         os.mkdir(os.path.join(destDir, name))

#     try:
#         while True:
#             current = im.tell()
#             frame = im.convert('RGBA')

#             # if prev_frame and im.disposal_method == 1:
#             #     updated = frame.crop(im.dispose_extent)
#             #     prev_frame.paste(updated, im.dispose_extent, updated)
#             #     frame = prev_frame
#             # else:
#             #     prev_frame = frame.copy()

#             # #替换背景为透明
#             # color = pic.getpixel((0,0))
#             # for i in range(pic.size[0]):
#             #     for j in range(pic.size[1]):
#             #         dot = (i,j)
#             #         rgba = pic.getpixel(dot)
#             #         if rgba == color:
#             #             rgba = rgba[:-1] + (0,)
#             #             pic.putpixel(dot, rgba)

#             # 缩放
#             frame = frame.resize((emoji_with, emoji_height), Image.ANTIALIAS)

#             # 凑够三位数
#             num = str(current)
#             if current < 10:
#                 num = '0' + num
#             if current < 100:
#                 num = '0' + num

#             # 压缩保存
#             frame.save(os.path.join(os.path.join(destDir,  name), name +
#                                     '-' + num + '-' + str(im.info['duration']) + '.png'), optimize=True)
#             im.seek(current+1)
#     except EOFError:
#         pass






# import os
# from PIL import Image, ImageFile
# from PIL.GifImagePlugin import GifImageFile, _accept, _save, _save_all

# # # https://tool.lu/zh_CN/wiki/replace-goodcharacters-background.html
# # # workaround initialization code
# # class AnimatedGifImageFile(GifImageFile):

# #     def load_end(self):
# #         ImageFile.ImageFile.load_end(self)

# # Image.register_open(AnimatedGifImageFile.format, AnimatedGifImageFile, _accept)
# # Image.register_save(AnimatedGifImageFile.format, _save)
# # Image.register_save_all(AnimatedGifImageFile.format, _save_all)
# # Image.register_extension(AnimatedGifImageFile.format, ".gif")
# # Image.register_mime(AnimatedGifImageFile.format, "image/gif")
# # # end of workaround initialization code


# pwd = os.path.split(os.path.realpath(__file__))[0]
# srcDir = os.path.join(pwd, '../emoji')
# destDir = os.path.join(pwd, '../assets/resources/emoji')
# # destDir = os.path.join(pwd, '../tmp')

# emoji_with = 160
# emoji_height = 160


# def convert(name):
#     im = Image.open(os.path.join(srcDir, name + '.gif'))
#     if not os.path.exists(os.path.join(destDir, name)):
#         os.mkdir(os.path.join(destDir, name))

#     try:
#         while True:
#             current = im.tell()

#             frame = im.convert('RGBA')

#             # if prev_frame and im.disposal_method == 1:
#             #     updated = frame.crop(im.dispose_extent)
#             #     prev_frame.paste(updated, im.dispose_extent, updated)
#             #     frame = prev_frame
#             # else:
#             #     prev_frame = frame.copy()


#             # #替换背景为透明
#             # color = pic.getpixel((0,0))
#             # for i in range(pic.size[0]):
#             #     for j in range(pic.size[1]):
#             #         dot = (i,j)
#             #         rgba = pic.getpixel(dot)
#             #         if rgba == color:
#             #             rgba = rgba[:-1] + (0,)
#             #             pic.putpixel(dot, rgba)

#             # 缩放
#             frame = frame.resize((emoji_with, emoji_height), Image.ANTIALIAS)

#             # 凑够三位数
#             num = str(current)
#             if current < 10:
#                 num = '0' + num
#             if current < 100:
#                 num = '0' + num

#             # 压缩保存
#             frame.save(os.path.join(os.path.join(destDir,  name), name +
#                                  '-' + num + '-' + str(im.info['duration']) + '.png'), optimize=True)
#             im.seek(current+1)
#     except EOFError:
#         pass


# def main():
#     for filename in os.listdir(srcDir):
#         convert(filename[:-4])
#     # convert('smill_new')


# if __name__ == "__main__":
#     main()



# import sys
# import os
# from PIL import Image

# '''
# I searched high and low for solutions to the "extract animated GIF frames in Python"
# problem, and after much trial and error came up with the following solution based
# on several partial examples around the web (mostly Stack Overflow).

# There are two pitfalls that aren't often mentioned when dealing with animated GIFs -
# firstly that some files feature per-frame local palettes while some have one global
# palette for all frames, and secondly that some GIFs replace the entire image with
# each new frame ('full' mode in the code below), and some only update a specific
# region ('partial').

# This code deals with both those cases by examining the palette and redraw
# instructions of each frame. In the latter case this requires a preliminary (usually
# partial) iteration of the frames before processing, since the redraw mode needs to
# be consistently applied across all frames. I found a couple of examples of
# partial-mode GIFs containing the occasional full-frame redraw, which would result
# in bad renders of those frames if the mode assessment was only done on a
# single-frame basis.

# Nov 2012
# '''


# def analyseImage(path):
#     '''
#     Pre-process pass over the image to determine the mode (full or additive).
#     Necessary as assessing single frames isn't reliable. Need to know the mode
#     before processing all frames.
#     '''
#     im = Image.open(path)
#     results = {
#         'size': im.size,
#         'mode': 'full',
#     }
#     try:
#         while True:
#             if im.tile:
#                 tile = im.tile[0]
#                 update_region = tile[1]
#                 update_region_dimensions = update_region[2:]
#                 if update_region_dimensions != im.size:
#                     results['mode'] = 'partial'
#                     break
#             im.seek(im.tell() + 1)
#     except EOFError:
#         pass
#     return results


# def processImage(path,dest):
#     '''
#     Iterate the GIF, extracting each frame.
#     '''
#     mode = analyseImage(path)['mode']

#     im = Image.open(path)

#     i = 0
#     p = im.getpalette()
#     last_frame = im.convert('RGBA')

#     try:
#         while True:
#             print("saving %s (%s) frame %d, %s %s" % (path, mode, i, im.size, im.tile))

#             '''
#             If the GIF uses local colour tables, each frame will have its own palette.
#             If not, we need to apply the global palette to the new frame.
#             '''
#             if not im.getpalette():
#                 im.putpalette(p)


#             new_frame = Image.new('RGBA', im.size)

#             '''
#             Is this file a "partial"-mode GIF where frames update a region of a different size to the entire image?
#             If so, we need to construct the new frame by pasting it on top of the preceding frames.
#             '''
#             if mode == 'partial':
#                 new_frame.paste(last_frame)

#             new_frame.paste(im, (0, 0), im.convert('RGBA'))
#             new_frame.save(os.path.join(dest, '%s-%d.png' % (''.join(os.path.basename(path).split('.')[:-1]), i)), 'PNG')

#             i += 1
#             last_frame = new_frame
#             im.seek(im.tell() + 1)
#     except EOFError:
#         pass

# if __name__ == "__main__":
#     # image = os.path.abspath(sys.argv[1])
#     image = '/Users/chriswong/banban/program/minigame-9chat/emoji/smill_new.gif'
#     # dest = os.path.join(os.path.dirname(image), "dest")
#     dest = '/Users/chriswong/banban/program/minigame-9chat/tmp/new'
#     if not os.path.exists(dest):
#         os.mkdir(dest)
#     processImage(image, dest)
