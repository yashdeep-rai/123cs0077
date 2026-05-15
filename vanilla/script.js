// Celsius to Kelvin: K = C + 273.15
// Kelvin to Celsius: C = K - 273.15
// Fahrenheit to Celsius: C = (F-32) (5/9)
// Celsius to Fahrenheit: F = C(9/5) + 32
// Fahrenheit to Kelvin: K = (F-32) (5/9) + 273.15
// Kelvin to Fahrenheit: F = (K-273.15) (9/5) + 32

function handleConversion(){
    let temp = document.getElementById('temp').innerText;
    let source = document.getElementById('source').innerText;
    let dest = document.getElementById('source').innerText;

    let result = 0.00;

    if(source === 'C' && dest === 'K')
            result = source + 273.15;
            document.getElementById('result').innerText = result;
    }else if(source === 'C' && dest === 'F')
            result = (source * (9/5)) + 32;
            document.getElementById('result').innerText = result;
    }else if(source === 'F' && dest === 'C')
            result = source + 273.15;
            document.getElementById('result').innerText = result;
    }else if(source === 'C' && dest === 'K')
            result = source + 273.15;
            document.getElementById('result').innerText = result;
    }else if(source === 'C' && dest === 'K')
            result = source + 273.15;
            document.getElementById('result').innerText = result;
    }else if(source === 'C' && dest === 'K')
            result = source + 273.15;
            document.getElementById('result').innerText = result;
    }else if(source === 'C' && dest === 'K')
            result = source + 273.15;
            document.getElementById('result').innerText = result;
    }else 
}