

const showpasswordbox = document.getElementById('showpassword');
const password = document.getElementById('password');
const Api ='http://localhost:3000';

showpasswordbox.onclick = () => {
    if (showpasswordbox.checked) {
        password.type = "text";
    } else {
        password.type = "password";
    }
};