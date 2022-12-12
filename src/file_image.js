/*
 * @Description: 根据路径获取图片
 * @Author: GongQiang
 * @Date: 2022-12-04 19:19:11
 * @LastEditors: GongQiang
 * @LastEditTime: 2022-12-04 22:44:06
 */
const fs = require('fs');
const path = require('path');
const imageExtname = ['.jpg', '.png']

/**
 * @description: 根据路径获取图片信息
 * @param {Array} allPaths 路径数组
 * @return {Array{path: string, size: string}} 图片 path、size
 * @author: GongQiang
 */
const getFileImage = (allPaths) => {
  const allImages = allPaths.reduce((pre, cur) => {
    const isImage = imageExtname.find(el => el === path.extname(cur))

    if (isImage) {
      const state = fs.statSync(cur)
      pre.push({
        path: cur,
        size: (state.size / 1024).toFixed(2)
      })

      return pre
    }

    return pre
  }, [])

  return allImages
}

module.exports = getFileImage