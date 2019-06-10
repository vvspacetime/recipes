/** Need webrtc adapter */
const updateBandwidthRestriction = (sdp, bandwidth, media) => {
    sdp = removeBandwidthRestriction(sdp) // clear
    let sdpLines = sdp.split('\r\n')

    let modifier = 'AS';
    if (adapter.browserDetails.browser === 'firefox') {
        bandwidth = (bandwidth >>> 0) * 1000;
        modifier = 'TIAS';
    }
    
    let insertIndex = 0;
    for (let i in sdpLines) {
        let line = sdpLines[i]
        if (line.includes(`m=${media}`)) {
            insertIndex = Number(i) + 1;
            break
        }
    }
    sdpLines.splice(insertIndex, 0, `b=${modifier}:${bandwidth}`)

    return sdpLines.join('\r\n');
}

const removeBandwidthRestriction = (sdp) => {
    return sdp.replace(/b=AS:.*\r\n/, '').replace(/b=TIAS:.*\r\n/, '');
}