// import * as zrender from 'zrender'
import type { ECharts } from 'echarts'

/* eslint-disable @typescript-eslint/no-explicit-any */
type UniCanvasContext = ReturnType<typeof uni.createCanvasContext> & {
  createRadialGradient?: (x0: number, y0: number, r0: number, x1: number, y1: number, r1: number) => CanvasGradient
}

export default class UniCanvas {
  ctx: UniCanvasContext
  canvasId: string
  chart: ECharts | null
  canvasNode?: HTMLCanvasElement | null
  event: Record<string, (e: any) => void> = {}
  constructor(ctx: UniCanvasContext, canvasId: string) {
    this.ctx = ctx
    this.canvasId = canvasId
    this.chart = null
    this.canvasNode = null

    this._initStyle(ctx)

    // this._initCanvas(zrender, ctx);

    this._initEvent()
  }

  getContext(contextType: string) {
    if (contextType === '2d') {
      return new Proxy(this.ctx, {
        get: (target, prop) => {
          if (prop === 'dpr') {
            return window ? 1 : 1 // uni.getSystemInfoSync().devicePixelRatio || 1
          }
          return Reflect.get(target, prop)
        },
      })
    }
  }

  setChart(chart: any) {
    this.chart = chart
  }

  addEventListener() {
    // noop
  }

  attachEvent() {
    // noop
  }

  detachEvent() {
    // noop
  }

  _initCanvas(zrender: typeof import('zrender'), ctx: UniCanvasContext) {
    // @ts-expect-error
    zrender.util.getContext = function () {
      return ctx
    }

    // @ts-expect-error
    zrender.util.$override('measureText', function (text: string, font: string) {
      ctx.font = font || '12px sans-serif'
      return ctx.measureText(text)
    })
  }

  _initStyle(ctx: UniCanvasContext) {
    ctx.createRadialGradient = (...args) => {
      const [x0, y0, r0, x1, y1, r1] = args
      if (r0 !== 0) {
        throw new Error('UniCanvas does not support inner circle of radial gradient')
      }
      if (x0 !== x1 || y0 !== y1) {
        throw new Error('UniCanvas does not support different centers of radial gradient')
      }
      const gradient = ctx.createCircularGradient(x0, y0, r1)
      return gradient
    }
  }

  _initEvent() {
    this.event = {}
    const eventNames = [
      {
        wxName: 'touchStart',
        ecName: 'mousedown',
      },
      {
        wxName: 'touchMove',
        ecName: 'mousemove',
      },
      {
        wxName: 'touchEnd',
        ecName: 'mouseup',
      },
      {
        wxName: 'tap',
        ecName: 'click',
      },
    ] as const
    eventNames.forEach((name) => {
      this.event[name.wxName] = (e) => {
        const touch = e.touches[0]
        this.chart?.getZr().handler.dispatch(name.ecName, {
          zrX: name.wxName === 'tap' ? touch.clientX : touch.x,
          zrY: name.wxName === 'tap' ? touch.clientY : touch.y,
          preventDefault: () => {},
          stopImmediatePropagation: () => {},
          stopPropagation: () => {},
        })
      }
    })
  }

  set width(w: number) {
    if (this.canvasNode) this.canvasNode.width = w
  }

  set height(h: number) {
    if (this.canvasNode) this.canvasNode.height = h
  }

  get width() {
    if (this.canvasNode)
      return this.canvasNode.width
    return 0
  }

  get height() {
    if (this.canvasNode)
      return this.canvasNode.height
    return 0
  }
}
