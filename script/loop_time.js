function startGetLoopTime() {
    let last200MS = Date.now()
    setInterval(() => {
        const now = Date.now()
        /*check timer interval*/
        const interval = now - last200MS
        last200MS = now
        if (interval > 300) { // time interval bigger then 300ms
            console.error('big interval time:', interval)
        }
        console.log(`normal interval time:`, interval)

        
        const last = now
        setImmediate(() => {
            let now = Date.now()
            /*check setImmediate consume time*/
            let delay = now - last
            if (delay > 100) {
                console.error('big tick time:', delay)
            }
            console.log(`normal delay time:`, delay)
        })
    }, 200)
}

// usage 
startGetLoopTime()

// calculate cpu condensy task