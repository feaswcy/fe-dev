import module1 from './module/module'

/**
 * 测试dynamic import
 */
import(/* webpackChunkName: "my-chunk-name" */'./async').then(res => {
  console.log('res', res)
})

console.log('module1', module1)
const module = module1.init()

document.body.appendChild(module)



