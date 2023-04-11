# compressing images by tinify

# Installation

`npm install --save tinify-compress-images`

# Quick Start
```js
const { compressingImages } = require('tinify-compress-images')
const path = require('path')

const config = {
  key: 'xxxxxxxxx', // tinify key
  projectPath: path.join(__dirname, '../../fe-middleend/src/pages/promo'), // project path
  ignoreDirectorys: ['node_modules', 'dist', '.git', '.site'], // default ['node_modules', '.git']
  cacheMd5Path: './md5.json' // default './md5.json'

}

compressingImages(config)
```
