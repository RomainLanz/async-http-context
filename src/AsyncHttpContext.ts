import { AsyncLocalStorage } from 'async_hooks'

const proxyHandler: ProxyHandler<AsyncHttpContext> = {
  get (target, name, receiver) {
    /**
     * prevent imports generated by TypeScript from triggering an exception within the context check
     */
    if (name === '__esModule') {
      return false
    }

    /**
     * if value exists on target, return that
     */
    if (target[name] !== undefined) {
      return Reflect.get(target, name, receiver)
    }

    return Reflect.get(target.ctx, name, receiver)
  },

  set (target, name, value, receiver) {
    return Reflect.set(target.ctx, name, value, receiver)
  },
}

export default class AsyncHttpContext {
  protected $context: AsyncLocalStorage<any>

  constructor () {
    this.$context = new AsyncLocalStorage()

    return new Proxy(this, proxyHandler)
  }

  // Internal
  public $run (context, next) {
    return this.$context.run(context, next)
  }

  public getStore() {
    return this.$context.getStore()
  }

  public enterWith(store) {
    return this.$context.enterWith(store)
  }

  public get ctx () {
    const store = this.$context.getStore()
    if (store === undefined) {
      throw new Error('AsyncHttpContext cannot be used outside of a request context')
    }
    return store;
  }
}
