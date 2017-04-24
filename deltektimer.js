function resetButtons()
{
    preview()
    frame = document.getElementById('unitFrame').contentWindow.document;
    buttons = frame.getElementsByClassName("buttons");
    Array.prototype.slice.call(buttons).forEach(function (button) 
    {
        button.parentNode.removeChild(button);
    });
    
    cells = frame.getElementsByClassName("d");
    Array.prototype.slice.call(cells).forEach(function (cell) 
    {
        var b = document.createElement('span');
        b.innerHTML = '\u27a4'
        b.classList.add('buttons');
        b.onclick = function() { updateTimer(cell) }
        cell.appendChild(b)
        cell.onclick = null;
    });
    
    var cellid = window.localStorage.getItem("cell");
    if (cellid != null)
    {
        cell = frame.getElementById(cellid)
        changeButton(cell)
    } 
}

function init() {
    frame = document.getElementById('unitFrame').contentWindow.document;
    appmenu = frame.getElementById("applicationOptionsUl")
    var b = document.createElement('button');
        b.innerHTML = 'Cancel/Reset Timers'
        b.onclick = function() { 
            cancelTimers()
            resetButtons()
        }
    appmenu.appendChild(b)
    
    resetButtons()
}

function updateTimer(cell)
{
    stopCurrentTimer()
    startTimer(cell)
    resetButtons()
    changeButton(cell)
}

function stopCurrentTimer()
{
    var d = new Date();
    var cell = window.localStorage.getItem("cell");
    if (cell == null)
    {
        return
    }
    var startTime = window.localStorage.getItem("startTime")
    var timeDiff = d.getTime()-startTime;
    var hours = roundDecimal(timeDiff / (60 * 60 * 1000));
    
    var initialTime = window.localStorage.getItem("initialTime")
    var totalTime = roundDecimal(initialTime*1+hours);
    
    frame = document.getElementById('unitFrame').contentWindow.document;
    
    // This is part of delteks javascript.
    submitActive = document.getElementById('unitFrame').contentWindow.submitActive;
    document.getElementById('unitFrame').contentWindow.hideEditor = function () {};
    editor = frame.getElementById('editor')
    editor.currentCell = frame.getElementById(cell);
    editor.value = totalTime
    submitActive()
    cancelTimers()
}

function roundDecimal(val)
{
    return Math.ceil(val * 10) / 10;
}
    
function cancelTimers()
{
    window.localStorage.removeItem("cell")
    window.localStorage.removeItem("startTime")
    window.localStorage.removeItem("initialTime")
}

function startTimer(cell)
{
    var d = new Date();
    window.localStorage.setItem("cell", cell.id);
    window.localStorage.setItem("startTime", d.getTime())
    window.localStorage.setItem("initialTime", cell.innerText.replace(/[^\d.-]/g, ''))
}

function changeButton(cell)
{
    var button = cell.getElementsByClassName("buttons")[0];
    button.parentNode.removeChild(button);
    var b = document.createElement('span');
    b.innerHTML = '\u23F9'
    b.classList.add('buttons');
    b.onclick = function() { 
        stopCurrentTimer(cell);
        resetButtons();
    }
    cell.appendChild(b)
}

function preview()
{
    var d = new Date();
    var cell = window.localStorage.getItem("cell");
    if (cell == null)
    {
        return
    }
    var startTime = window.localStorage.getItem("startTime")
    var timeDiff = d.getTime()-startTime;
    var hours = roundDecimal(timeDiff / (60 * 60 * 1000));
    
    var initialTime = window.localStorage.getItem("initialTime")
    var previewTime = initialTime+"+"+roundDecimal(hours);
    
    frame = document.getElementById('unitFrame').contentWindow.document;
    frame.getElementById(cell).innerHTML = previewTime;
}


window.setInterval(function() {
        resetButtons()
    }, 60*1000);

init()
