

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

 function signup(event) {
    console.log('Form submitted!');
    event.preventDefault();
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const phoneno = document.getElementById('phoneno').value;
        const password = document.getElementById('password').value;

        console.log('signup');

        const data = {
            name,email,phoneno,password
        };

        console.log(data);
        axios.post(`${Api}/signup`,data).then((response)=>{
            alert(response.data.message);
            window.location.href='/login'
        }).catch((err)=>{
            console.log(err);
        })
    
    }
    