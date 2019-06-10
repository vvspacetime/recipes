class Condition {
    Condition() {
        this._trigger = () => {}
        this._etrigger = () => {}
    }

    wait(timeMs = 0) {
        let tp = new Promise((resolve, reject) => {
            if(timeMs > 0){
                setTimeout(() => {
                    resolve(false)
                }, timeMs)
            }
        });
        
        let wp = new Promise((resolve, reject) => {
            this._trigger = () => {
                resolve(true)
            }
            this._etrigger = (e) => {
                reject(e)
            }
        })

        let rp = new Promise((resolve, reject) => {
            Promise.race([tp, wp]).then((ok) => {
                if(ok){
                    resolve()
                }else{
                    reject(new Error('timeout'))
                }
            })
        })
        return rp
    }

    signal() {
        this._trigger()
    }

    esignal(e) {
        this._etrigger(e)
    }
}

export default Condition