import { registerSW } from 'virtual:pwa-register'

export const updateServiceWorker = registerSW({
  immediate: true,
  onOfflineReady() {
    window.dispatchEvent(new CustomEvent('viapool:pwa-ready'))
  },
  onNeedRefresh() {
    window.dispatchEvent(new CustomEvent('viapool:pwa-update'))
    updateServiceWorker(true)
  },
})
