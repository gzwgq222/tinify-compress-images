/*
 * @Description: 获取提供的文件夹下的所有文件路径
 * @Author: GongQiang
 * @Date: 2022-12-04 19:01:41
 * @LastEditors: GongQiang
 * @LastEditTime: 2022-12-04 22:43:24
 */
const fs = require('fs');
const path = require('path');

/**
 * @description: 获取提供路径下的文件
 * @param {string} filePath
 * @return {string}
 * @author: GongQiang
 */
const getFiles = (filePath) => {

  // console.log(111, process.cwd(), filePath);
  // console.log(222, path.resolve(__dirname, filePath));
  return fs.readdirSync(path.resolve(__dirname, filePath))
}

/**
 * @description: 获取提供路径下的所有文件
 * @param {Array} ignoreDirectory 忽略处理的文件夹
 * @param {String} filePath 处理的文件夹入口
 * @return {Object} promise
 * @author: GongQiang
 */
const getFilePath = (ignoreDirectory = ['node_modules', '.git']) => {
  // 处理模块的 config 路径
  let paths = []
  return async function (filePath) {
    const files = getFiles(filePath).filter(file =>
      !ignoreDirectory.find(ignoreFile => ignoreFile === file)
    )

    for (const file of files) {
      const nextLevelFilePath = path.resolve(__dirname, `${filePath}/${file}`)

      if (fs.existsSync(nextLevelFilePath)) {
        const stats = fs.statSync(nextLevelFilePath)
        // 为文件夹则继续查找路径
        stats.isDirectory() ?
          await arguments.callee(nextLevelFilePath) :
          paths.push(nextLevelFilePath)
      }
    }
    return paths
  }
}

module.exports = getFilePath