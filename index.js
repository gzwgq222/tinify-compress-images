/*
 * @Description: 借助 tinify 图片压缩脚本
 * @Author: GongQiang
 * @Date: 2022-12-01 09:34:51
 * @LastEditors: GongQiang
 * @LastEditTime: 2022-12-12 18:39:29
 */
const fs = require('fs');
const path = require('path');
const tinify = require("tinify");
const crypto = require("crypto");
const prettier = require('prettier')
const log = require('fancy-log');
const chalk = require('ansi-colors');
const getFilePath = require('./src/file_path')
const getFileImage = require('./src/file_image')

const getMd5 = (contents) => crypto.createHash('md5').update(contents).digest('hex')

// prettier 格式化 code
const prettierCode = (sources) => prettier.format(
  typeof sources === 'object' ? JSON.stringify(sources) : sources,
  {
    parser: 'json',
    singleQuote: true,
    trailingComma: 'all',
    quoteProps: 'consistent',
    printWidth: 120
  }
)

const writeFileSync = (path, data) => fs.writeFileSync(path, data)
const getFileSync = (path) => fs.existsSync(path) ? fs.readFileSync(path)?.toString() : ''

const compressingImages = async (config = {}) => {
  const {
    key,
    projectPath,
    ignoreDirectorys = ['node_modules', '.git'],
    cacheMd5Path = './md5.json'
  } = config

  // qNjljFK4DYKNJw8zMwJFGDvG2HM5CFjy | 069xk8Kh1QN6FbQCfD5YTwTBLQMP4F8K
  tinify.key = key || 'qNjljFK4DYKNJw8zMwJFGDvG2HM5CFjy'

  const allPaths = await getFilePath(ignoreDirectorys)(projectPath)

  const allImages = getFileImage(allPaths)
  const { length } = allImages
  const size = (allImages.reduce((pre, cur) => pre += +(cur.size), 0) / 1024).toFixed(2)

  log(chalk.cyan(`all images: ${length}张图片, 总计：${size}M`))

  const cacheMd5String = getFileSync(cacheMd5Path)
  const cacheMd5Map = cacheMd5String ? JSON.parse(cacheMd5String) : {}

  for (const image of allImages) {
    const imagePath = image.path.replace(process.cwd(), '')
    const contents = fs.readFileSync(image.path)
    const md5Key = getMd5(contents)
    if (cacheMd5Map[imagePath] !== md5Key) {
      cacheMd5Map[imagePath] = md5Key
      await new Promise((resolve) => {
        tinify.fromFile(image.path).toFile(image.path, () => {
          const compressImagesMD5 = getMd5(fs.readFileSync(image.path))

          cacheMd5Map[imagePath] = compressImagesMD5
          log(chalk.red(`compress success： ${imagePath}`))
          resolve()
        });
      })
    } else {
      log(chalk.green(`存在：${md5Key} - ${imagePath}`))
    }
  }

  if (Object.keys(cacheMd5Map).length) {

    writeFileSync(cacheMd5Path, prettierCode(cacheMd5Map))
    log(chalk.cyan(`图片md5写入${cacheMd5Path} 成功！`))
  }
}

module.exports = {
  compressingImages,
}
