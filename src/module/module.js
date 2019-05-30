import tpl from './module.html'
// import render from {common}
import './module.stylus'

// 测试一下url-loader, 这里logo被loader转换后 logo变量变成了图片的地址 dist/img/fire-dargon.jpeg
import Logo from '../assets/images/fire-dargon.jpeg' 

export default{
  init(){
    // let res = require("html-loader!./module.html");
    // console.log('res', res)
    this.dom = this.createDom(tpl)
    console.log('this.dom', this.dom)
    return this.dom
  },
  createDom(tpl){
    const div = document.createElement('div')
    div.innerHTML = tpl
    return div
  }
}