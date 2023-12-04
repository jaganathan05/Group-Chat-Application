

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

function login(event) {
    event.preventDefault();
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        console.log('login');

        const data = {
            email,password
        };

        console.log(data);
        axios.post(`${Api}/login`,data).then((response)=>{
            alert(response.data.message);
            localStorage.setItem('token',response.data.token)
            window.location.href='/login'
        }).catch((err)=>{
            console.log(err);
        })
    
    }