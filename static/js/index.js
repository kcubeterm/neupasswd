function init() {
    let masterpasswd = document.getElementById('mpass').value
    let service = document.getElementById('service').value
    let passlength = document.getElementById('length').value || 12
    let mHash = CryptoJS.SHA256(masterpasswd).toString()
    let sHash = CryptoJS.SHA256(service).toString()
    let salt = CryptoJS.SHA256(mHash + sHash).toString()
    console.log(passlength)
    let saltedpasswd = CryptoJS.SHA256(salt + salt.slice(23, 29)).toString()
    document.getElementById('canvas').style.display= "none"
    document.getElementById('result').style.display = "block"
    document.getElementById('result').innerHTML = passGenerator(saltedpasswd, passlength)
}


function uniqueValue(currentval, index, arr) {
    return arr.indexOf(currentval) === index
}

class tokenGenerator {
    constructor(saltHash) {
        this.saltHash = saltHash
        // convert hash into num
        let hexTable = 'abcdef'
        let numHash = []
        this.saltHash.split('').forEach(element => {
            if ((/[a-z]/).test(element)) {
                numHash.push(hexTable.indexOf(element) + 1)
            } else {
                numHash.push(parseInt(element))
            }
        });
        this.numHash = numHash
    }

    getToken(token) {
        let tokens = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
        if (token == 'number') {
            tokens = '9702653418'
        } else if (token == 'lowercase') {
            tokens = 'tdaoebfcqruksvpwxyzghijlom'
        } else if (token == 'special') {
            tokens = '@)#$!^&%*('
        }
        let output = []
        let lastIndex = 0

        for (let i = 4; i <= this.numHash.length; i = i + 4) {
            let num = this.numHash.slice(lastIndex, i)
            let addNum = num[0] + num[1] + num[2] + num[3]


            let char = tokens.charAt(addNum % tokens.length)
            output.push(char)
            lastIndex = lastIndex + 4
        }

        return output
    }
}
function passGenerator(saltedpasswd, passLength,validation) {
    let getTokenGen = new tokenGenerator(saltedpasswd)
    let upperToken = getTokenGen.getToken()
    let lowercaseToken = getTokenGen.getToken('lowercase')
    let specialToken = getTokenGen.getToken('special')
    let numberToken = getTokenGen.getToken('number')

    let pass = []
    if (validation) {
        if (validation.includes('lowercase_error')) {
            pass.push(lowercaseToken[1])
        }
        if (validation.includes('uppercase_error')) {
            pass.push(upperToken[1])
        }
        if (validation.includes('number_error')) {
            pass.push(numberToken[1])
        }
        if (validation.includes('specialchar_error')) {
            pass.push(specialToken[1])
        }
    }
    for (let i = 0; i < saltedpasswd.length; i++) {
        let string = saltedpasswd.charAt(i)
        switch (true) {
            case /[0-3]/.test(string):
                pass.push(upperToken[i % 26])
                break;
            case /[4-7]/.test(string):
                pass.push(lowercaseToken[i % 26])
                break;
            case /[89ab]/.test(string):
                pass.push(numberToken[i % 10])
                break;
            case /[cdef]/.test(string):
                pass.push(specialToken[i % 10])
                break;
        }
        
    }
    validationArray = passValidation(pass.slice(0,passLength).join(''))
    if (validationArray.length != 0 ) {
       return  passGenerator(saltedpasswd,passLength,validationArray)
        
        
    }
    return pass.slice(0,passLength).join('')
}

function passValidation(pass) {
    let validation = []
    if (pass.length <= 8) {
        validation.push('length_error')
    }

    if ( !(/[a-z]/).test(pass) ) {
        validation.push('lowercase_error')
    }
    if ( !(/[A-Z]/).test(pass) ) {
        validation.push('uppercase_error')
    }

    if ( !(/[0-9]/).test(pass) ) {
        validation.push('number_error')
    }

    if ( !(/[@)#$!^&%*(]/).test(pass) ) {
        validation.push('specialchar_error')
    }
    return validation
    
}