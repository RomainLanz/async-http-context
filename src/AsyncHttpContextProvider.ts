import { ApplicationContract } from '@ioc:Adonis/Core/Application'
import AsyncHttpContext from './AsyncHttpContext'
import AsyncHttpContextMiddleware from './AsyncHttpContextMiddleware'

export default class AppProvider {
  constructor (protected $app: ApplicationContract) {
  }

  public register () {
    this.$app.container.singleton('Adonis/Core/AsyncHttpContext', () => {
      return new AsyncHttpContext()
    })

    this.$app.container.bind('Adonis/Core/AsyncHttpContextMiddleware', () => {
      const asyncContext = this.$app.container.use('Adonis/Core/AsyncHttpContext')

      return new AsyncHttpContextMiddleware(asyncContext)
    })
  }
}
