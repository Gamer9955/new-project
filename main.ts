let temp2 = 0
let temp = 0
let playerscore = 0
let noalien = 0
let hi = 0
let gamestart = 0
let destroyedpos: number[] = []
let aliens: number[][] = []
let shots: number[][] = []
let pos = 2
let toprow = [0, 0, 0, 0, 0]
function unrendership() {
    led.unplot(pos, 4)
    led.unplot(pos, 3)
    if (pos > 0) {
        led.unplot(pos - 1, 4)
    }
    if (pos < 4) {
        led.unplot(pos + 1, 4)
    }
}
function rendership() {
    led.plot(pos, 4)
    led.plot(pos, 3)
    if (pos > 0) {
        led.plot(pos - 1, 4)
    }
    if (pos < 4) {
        led.plot(pos + 1, 4)
    }
}
function unrendershots() {
    for (let i = 0; i <= shots.length - 1; i++) {
        if (shots[i][1] > -1) {
            led.unplot(shots[i][0], shots[i][1])
        }
    }
}
function rendershots() {
    for (let j = 0; j <= shots.length - 1; j++) {
        if (shots[j][1] > -1) {
            led.plot(shots[j][0], shots[j][1])
        }
    }
}
function checkcollision() {
    for (let k = 0; k <= aliens.length - 1; k++) {
        if ((aliens[k][0] == pos && (aliens[k][1] == 4 || aliens[k][1] == 3)) ||
            (aliens[k][1] == 4 && (aliens[k][0] == pos - 1 || aliens[k][0] == pos + 1))) {
            destroyedpos = aliens[k]
            gamestart = 2
        }
        for (let l = 0; l <= shots.length - 1; l++) {
            if (aliens[k][0] == shots[l][0] && aliens[k][1] == shots[l][1]) {
                led.unplot(aliens[k][0], aliens[k][1])
                if (aliens[k][1] == 0) {
                    toprow[aliens[k][0]] = 0
                }
                shots[l][1] = -1
                aliens[k][1] = 5
                playerscore += 1
            }
        }
    }
}
basic.forever(() => {
    if (gamestart == 0) {
        basic.showNumber(hi)
    }
    if (gamestart == 2) {
        aliens = []
        shots = []
        for (let i = 0; i < 3; i++) {
            led.unplot(destroyedpos[0], destroyedpos[1])
            basic.pause(500)
            led.plot(destroyedpos[0], destroyedpos[1])
            basic.pause(500)
        }
        if (hi < playerscore) {
            basic.showIcon(IconNames.Happy)
            basic.pause(1000)
            basic.showString("NEW HISCORE")
            basic.showNumber(playerscore)
            hi = playerscore
            basic.pause(2000)
            gamestart = 0
        } else {
            basic.showIcon(IconNames.Sad)
            basic.pause(2000)
            basic.showNumber(playerscore)
            basic.pause(2000)
            gamestart = 0
        }
    }
    if (tinkercademy.ADKeyboard(ADKeys.A, AnalogPin.P1) && gamestart == 0) {
        gamestart = 1
        pos = 2
        playerscore = 0
        basic.clearScreen()
        rendership()
    }
    if (gamestart == 1) {
        unrendershots()
        noalien = 0
        if (Math.randomRange(0, 15) == 0) {
            temp = Math.randomRange(0, 5)
            if (toprow[temp] == 0) {
                aliens.push([temp, -1, 4])
            }
        }
        for (let n = 0; n <= aliens.length - 1; n++) {
            aliens[n][2]++
            if (aliens[n][1] < 5) {
                noalien = 1
            }
            if (aliens[n][2] > 4 && aliens[n][1] < 5) {
                led.unplot(aliens[n][0], aliens[n][1])
                aliens[n][1]++
                if (aliens[n][1] == 1) {
                    toprow[aliens[n][0]] = 0
                }
                aliens[n][2] = 0
                led.plot(aliens[n][0], aliens[n][1])
            }
            if (aliens[n][1] == 0) {
                toprow[aliens[n][0]] = 1
            }
        }
        for (let o = aliens.length - 1; o >= 0; o--) {
            if (aliens[o][1] >= 5) {
                aliens.removeAt(o)
            }
        }
        if (noalien == 0) {
            temp2 = Math.randomRange(0, 5)
            if (toprow[temp2] == 0) {
                aliens.push([temp2, -1, 4])
            }
        }
        checkcollision()
        for (let p = 0; p <= shots.length - 1; p++) {
            shots[p][1]--
        }
        if (tinkercademy.ADKeyboard(ADKeys.D, AnalogPin.P1)) {
            shots.push([pos, 2])
        }
        checkcollision()
        for (let q = shots.length - 1; q > 0; q--) {
            if (shots[q][1] < 0) {
                shots.removeAt(q)
            }
        }
        if (gamestart == 1) {
            if (tinkercademy.ADKeyboard(ADKeys.C, AnalogPin.P1)) {
                if (pos > 0) {
                    unrendership()
                    pos += -1
                    rendership()
                }
            }
            if (tinkercademy.ADKeyboard(ADKeys.E, AnalogPin.P1)) {
                if (pos < 4) {
                    unrendership()
                    pos += 1
                    rendership()
                }
            }
        }
        rendershots()
        basic.pause(80)
    }
})


