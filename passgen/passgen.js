let passField;
let lengthSlider;
let sliderLabel;
let upperToggle;
let lowerToggle;
let numberToggle;
let symbolToggle;

const UPPERCASE = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
const LOWERCASE = 'abcdefghijklmnopqrstuvwxyz';
const NUMBERS = '0123456789';
const SYMBOLS = '~`!@#$%^&*()_-+={[}]|\:;"\'<,>.?/';

let settings = {
    charset : {
        [UPPERCASE]: true,
        [LOWERCASE]: true,
        [NUMBERS]: true,
        [SYMBOLS]: true,
    },
    length: 40
}

const genPassword = () => {
    let charset = "";
    const charsets = [];

    for (const [chars, use] of Object.entries(settings.charset)) {
        if (use) {
            charset += chars;
            charsets.push(chars)
        }
    }

    password = "";
    for (var i = 0, n = charset.length; i < settings.length - charsets.length; ++i) {
        password += charset.charAt(Math.floor(Math.random() * n));
    }

    for (const cset of charsets) {
        const position = Math.floor(Math.random() * password.length);
        password = password.substring(0, position) + cset.charAt(Math.floor(Math.random() * cset.length)) + password.substring(position);
    }

    passField.value = password;
}

const onCopy = evt => {
    const input = evt.target.parentNode.getElementsByTagName('input')[0];
    input.select();
    input.setSelectionRange(0, 99999); 

    navigator.clipboard.writeText(input.value);
}


const onCheckbox = key => {
    return evt => {
        settings.charset[key] = evt.target.checked;
        genPassword();
    }
}

const onSlider = evt => {
    settings.length = evt.target.value;
    sliderLabel.innerText = `Length (${settings.length})`
    genPassword();
}

const passgen = () => {
    passField = document.getElementById('password');
    sliderLabel = document.getElementById('sliderLabel');
    lengthSlider = document.getElementById('lengthSlider');
    upperToggle = document.getElementById('upperCheck');
    lowerToggle = document.getElementById('lowerCheck');
    numberToggle = document.getElementById('numberCheck');
    symbolToggle = document.getElementById('symbolCheck');

    lengthSlider.addEventListener('input', onSlider);
    upperToggle.addEventListener('change', onCheckbox(UPPERCASE));
    lowerToggle.addEventListener('change', onCheckbox(LOWERCASE));
    numberToggle.addEventListener('change', onCheckbox(NUMBERS));
    symbolToggle.addEventListener('change', onCheckbox(SYMBOLS));

    lengthSlider.dispatchEvent(new Event("input"));
    upperToggle.dispatchEvent(new Event("change"));
    lowerToggle.dispatchEvent(new Event("change"));
    numberToggle.dispatchEvent(new Event("change"));
    symbolToggle.dispatchEvent(new Event("change"));

    [...document.querySelectorAll(".copy-icon"), passField].forEach(elem => {
        elem.addEventListener("click", onCopy);
    });
    
    genPassword();
}

window.addEventListener('load', passgen);