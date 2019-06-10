class ClockNotify {
    constructor(intervalMs) {
        this.intervalMs = intervalMs
        this.free = true
        this.register = null
        this.count = 0
    }

    notify(callback) {
        if (this.free) {
            this.register = null
            this.free = false

            setTimeout(() => {
                this.free = true
                if (this.register) { // when wait timeInterval, notify register
                    this.notify(this.register)
                    this.register = null
                }
            }, this.intervalMs)

            this.count ++
            callback(this.count)
        } else {
            this.register = callback // if this.register != null, drop it
            // do nothing, need wait interval
        }
    }
}


const test = () => {
    let c = new ClockNotify(1000)
    notifyAfterTime(c, 0)
    notifyAfterTime(c, 100)
    notifyAfterTime(c, 500) // drop 100
    notifyAfterTime(c, 500) // drop last 500, call on 1000
    notifyAfterTime(c, 1500)
    notifyAfterTime(c, 1800) // drop 1500
    notifyAfterTime(c, 2000)
    notifyAfterTime(c, 2200)
    notifyAfterTime(c, 3000)
    notifyAfterTime(c, 3200)
    notifyAfterTime(c, 6000)
    notifyAfterTime(c, 6200)
    notifyAfterTime(c, 7000)
}

const notifyAfterTime = (c, timeMs) => {
    setTimeout(() => {
        c.notify((c) => {
            console.log(timeMs, c)   
        })
    }, timeMs) 
}


test()