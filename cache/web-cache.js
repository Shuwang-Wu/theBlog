/**
 * @Description  :
 * @Author       : YH000052
 * @LastEditors  : YH000052
 * @Date         : 2020-07-09 14:37:23
 * @LastEditTime : 2020-07-09 14:51:58
 * @FilePath     : \cache\web-cache.js
 */

import Koa from 'koa'
import path from 'path'
//静态资源中间件
import resource from 'koa-static'
import conditional from 'koa-conditional-get'
import etag from 'koa-etag'
const app = new Koa()
const host = 'localhost'
const port = 4396

app.use(conditional())
app.use(etag())
app.use(async (ctx, next) => {
  // 设置响应头Cache-Control 设置资源有效期为300秒
  ctx.set({
    'Cache-Control': 'max-age=300'
  })
  await next()
})

app.use(resource(path.join(__dirname, './static')))

app.listen(port, () => {
  console.log(`server is listen in ${host}:${port}`)
})
