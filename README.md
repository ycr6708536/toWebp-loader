# webp-loader

[WebP](https://developers.google.com/speed/webp/) image loader & converter loader for Webpack.
功能：可以保留源文件，并且使用源文件的hash命名

## Install

```sh
npm install toWebp-loader --save-dev
```

## Usage

Here is the example of using `toWebp-loader` along with common [mime](https://github.com/broofa/node-mime):

```javascript
loaders: [
  {
    test: /\.(jpe?g|png)$/i,
    loaders: [
      'toWebp'
    ]
  }
]
```
Unfortunately, if you wish to pass an options for internal [imagemin-webp](https://github.com/imagemin/imagemin-webp) you should pass a options in JSON form:


```javascript
loaders: [
  {
    test: /\.(jpe?g|png)$/i,
    loaders: [
      'toWebp?{quality: 13}'
    ]
  }
]
```

Normally you don't want to convert all of your images to WebP format, you just want to make alternate versions. You can use [multi-loader](https://github.com/webpack/multi-loader) to achieve it:

```javascript
loaders: [
  {
    test: /\.(jpe?g|png)$/i,
    loader: ['toWebp?{quality: 95}']
  },
]
```

## License

[MIT](http://opensource.org/licenses/MIT)
