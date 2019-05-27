class ClockNotify {
    private intervalMs: number
    private free: boolean
    private register: Function
    private count: number
    constructor(intervalMs: number) {
        this.intervalMs = intervalMs
        this.free = true
        this.register = null
        this.count = 0
    }

    notify(callback: Function) {
        if (this.free) {
            this.register = null
            this.free = false

            setTimeout(() => {
                this.free = true
                if (this.register) { // when wait timeInterval, some one register
                    this.notify(this.register)
                    this.register = null
                }
            }, this.intervalMs)

            this.count ++
            callback(this.count)
        } else {
            this.register = callback
            // do nothing, need wait interval
        }
    }
}


const Test = () => {
    let c = new ClockNotify(1000)
    notifyAfterTime(c, 0)
    notifyAfterTime(c, 100)
    notifyAfterTime(c, 500)
    notifyAfterTime(c, 500)
    notifyAfterTime(c, 1500)
    notifyAfterTime(c, 1800)
    notifyAfterTime(c, 2000)
    notifyAfterTime(c, 2200)
    notifyAfterTime(c, 3000)
    notifyAfterTime(c, 3200)
    notifyAfterTime(c, 6000)
    notifyAfterTime(c, 6200)
    notifyAfterTime(c, 7000)
}

const notifyAfterTime = (c: ClockNotify,timeMs: number) => {
    setTimeout(() => {
        c.notify((c) => {
            console.log(timeMs, c)   
        })
    }, timeMs) 
}


Test()