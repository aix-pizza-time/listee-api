const _timestamp = (milliseconds = true, _date = new Date()) => {
    let date = _date.toLocaleDateString('en-GB').replace(/\//g,'-');
    let y, m, d;
    y = _date.getFullYear();
    m = _date.getMonth() < 10 ? "0" + _date.getMonth() : _date.getMonth();
    d = _date.getDate() < 10 ? "0" + _date.getDate() : _date.getDate(); 
    let time = _date.toLocaleTimeString('de-DE').replace(/:/g,'-');
    return `${y}-${m}-${d}-${time}${milliseconds ? "-" + _date.getMilliseconds(): ""}`; 
}

module.exports = _timestamp;