import { EventEmitter } from "events"

// Singleton via globalThis — ກັນ HMR ສ້າງ instance ໃໝ່ໃນ dev mode
const g = globalThis as unknown as { _notifEmitter?: EventEmitter }

if (!g._notifEmitter) {
    g._notifEmitter = new EventEmitter()
    g._notifEmitter.setMaxListeners(200)
}

export const notificationEmitter = g._notifEmitter
