const keys = new Set()
const checkInterval = 50
const timeoutDefault = 5000

const lock = async (key, timeoutMs = timeoutDefault) => {
    if (keys.has(key)) {
        await waitKeyEmpty(key, timeoutMs) // 
    } else {
        keys.add(key)
    }
    
    const done = () => {
        keys.delete(key)
    }

    return done
}

const waitKeyEmpty = async (key, timeoutMs) => {
    let hasWaitTime = 0
    while(keys.has(key) && hasWaitTime < timeoutMs) {
        await waitTime(checkInterval)
        hasWaitTime += checkInterval
    }
    if (hasWaitTime < timeoutMs) {
        keys.add(key)
    } else {
        throw(new Error('timeout'))
    }
}

const waitTime = (waitMs) => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve()
        }, waitMs)
    })
}


/** usage */
const test = async() => {
    let done = await lock("12321")
    console.log("locking")
    done()
}

const test1 = () => {
    const keyNumber = 10
    const tryNumber = 100
    let arr = new Array(keyNumber)
    for (let i = 0; i < keyNumber; i ++) {
        arr[i] = 0
    }

    const change = async (key) => {
        let done = await lock(key + '')
        console.log(key, 'run')
        if (!arr[key]) {
            await waitTime(50) // 模拟中间打断的情况
            arr[key] ++;
        }
        done()
        console.log(key, 'done')
    }

    for(let i = 0; i < keyNumber; i ++) {
        for (let j = 0; j < tryNumber; j ++) {
            change(i)
        }
    }

    setTimeout(() => {
        let sum = 0;
        for (let i = 0; i < keyNumber; i ++) {
            // console.log(arr[i])
            sum += arr[i]
        }
        console.log('sum', sum) // 结果应该和keyNumber相同
    }, 10000)
}

const test2 = () => {
    const keyNumber = 2
    const tryNumber = 10
    let arr = new Array(keyNumber)
    for (let i = 0; i < keyNumber; i ++) {
        arr[i] = 0
    }

    const change = async (key) => {
        let done = await lock(key + '', timeoutDefault)

        let count = arr[key]
        console.log(key, 'run', count)

        await waitTime(50) // 模拟中间打断的情况
        count ++;
        arr[key] = count

        done()
        console.log(key, 'done')
    }

    for(let i = 0; i < keyNumber; i ++) {
        for (let j = 0; j < tryNumber; j ++) {
            change(i)
        }
    }

    setTimeout(() => {
        let sum = 0;
        for (let i = 0; i < keyNumber; i ++) {
            sum += arr[i]
        }
        console.log('sum', sum) // 结果应该和keyNumber * tryNumber相同
    }, 10000)
}

const test3 = async () => {
    const fun1 = async () => {
        let done = await lock("123")
        await waitTime(5100)
        console.log('fun1 will done')
        done()
    }

    const fun2 = async () => {
        try {
            let done = await lock("123")
            console.log('get lock')
            done()
        } catch (e) {
            console.log(e)
        }
        
    }

    fun1()
    fun2()
        
}

test3()