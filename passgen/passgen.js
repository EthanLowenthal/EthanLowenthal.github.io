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

const appendAlert = (message, type) => {
    const wrapper = document.createElement('div')
    const parent = document.getElementById('toasts');
    wrapper.innerHTML = `
    <div class="toast align-items-center text-bg-${type} border-0 show" role="alert">
    <div class="d-flex">
        <div class="toast-body">
        ${message}
        </div>
        <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
    </div>
    </div>`
    wrapper.style.transition = 'opacity 1s';
  
    parent.append(wrapper)
    wrapper.addEventListener('transitionend', () => wrapper.remove());

    setTimeout(() => {
        wrapper.style.opacity = '0';
    }, 2000);
}
  
const onCopy = evt => {
    const input = evt.target.parentNode.getElementsByTagName('input')[0];
    input.select();
    input.setSelectionRange(0, 99999); 

    navigator.clipboard.writeText(input.value);
    appendAlert('Copied!', 'success')
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