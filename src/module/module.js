import tpl from './module.html'
import render from {common}
import './module.stylus'

export default{
  init(){
    this.dom  = render(tpl)

    return this.dom
  }
}