function formatTime(val) {
    if (val < 10) {
        return '0' + val;
    }
    return val;
}

function printFormattedTime(secs) {

    const time = {
        hrs: Math.floor(secs / 60 / 60) % 60,
        mins: Math.floor(secs / 60) % 60,
        secs: Math.floor(secs % 60)
    }

    if (isNaN(time.hrs) && isNaN(time.mins) && isNaN(time.secs)) {
        return '00:00:00';
    }
    return `${formatTime(time.hrs)}:${formatTime(time.mins)}:${formatTime(time.secs)}`
}

export {
    formatTime,
    printFormattedTime
}
