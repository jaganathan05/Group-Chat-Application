const sendbtn = document.getElementById('sendmessage');
const API = 'http://localhost:3000';

sendbtn.addEventListener('click', () => {
    const message = document.getElementById('messageInput').value;
    const token = localStorage.getItem('token');
    const data = {
        message
    };

    axios.post(`${API}/chat/sendmessage`, data, {
        headers: {
            Authorization: token
        }
    })
        .then(response => {
            if (response) {
                alert(response.data.message);
            }
        })
        .catch(err => {
            console.log(err);
        });
});
