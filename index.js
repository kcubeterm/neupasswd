
function init() {
    let masterpasswd = document.getElementById('mpass').value
    let service = document.getElementById('service').value
    let passlength = document.getElementById('length').value || 12
    let mHash = CryptoJS.SHA256(masterpasswd).toString()
    let sHash = CryptoJS.SHA256(service).toString()
    let salt = CryptoJS.SHA256(mHash+sHash).toString()
    console.log(passlength)
    let saltedpasswd = CryptoJS.SHA256(salt+salt.slice(23,29)).toString()
    document.getElementById('result').innerHTML = passGenerator(saltedpasswd,passlength)
}


function uniqueValue(currentval,index,arr) {
    return arr.indexOf(currentval) === index
}

class tokenGenerator {
    constructor(saltHash) {
        this.saltHash = saltHash
        // convert hash into num
        let hexTable = 'abcdef'
        let numHash = []
        this.saltHash.split('').forEach(element => { 
            if ( (/[a-z]/).test(element) ) {
                numHash.push(hexTable.indexOf(element)+1)
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
        } else if ( token == 'special') {
            tokens = '@)#$!^&%*('
        }
        let output = []
        let lastIndex = 0
        
        for (let i=4;i <= this.numHash.length; i = i+4) {
            let num = this.numHash.slice(lastIndex,i)
            let addNum = num[0]+num[1]+num[2]+num[3]
            
            if (addNum >= tokens.length) {
                let char = tokens.charAt(addNum%tokens.length)
                output.push(char)
            } else {
                output.push(tokens.charAt(addNum))
            }
            lastIndex = lastIndex+4
        }
        
        return output
    }
}
function passGenerator(saltedpasswd,passLength) {
    let getTokenGen = new tokenGenerator(saltedpasswd)
    let upperToken = getTokenGen.getToken()
    let lowercaseToken = getTokenGen.getToken('lowercase')
    let specialToken = getTokenGen.getToken('special')
    let numberToken = getTokenGen.getToken('number')
    let pass = []
    for (let i = 0; i < saltedpasswd.length; i++) {
        pass.push(upperToken[i])
        pass.push(lowercaseToken[i])
        pass.push(numberToken[i])
        pass.push(specialToken[i])
    }
    return pass.slice(0,passLength).join('')
}