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
                console.log(response)
            }
        })
        .catch(err => {
            console.log(err);
        });
});

window.addEventListener('DOMContentLoaded', ()=>{
    const token = localStorage.getItem('token'); 
    setInterval(async()=>{
        const response =await axios.get(`${API}/chat/getmessage`,{
            headers:{
                Authorization:token
            }
        
        })
    
        if(response){
            response.data.message.forEach(chat => {
                console.log(response.data.userId)
                show_messages(chat,response.data.userId)
            });
        }
    })
     
},1000)

function show_messages(chat,id){
    const chat_container = document.getElementById('chatBox');
    const showmessage_container = document.createElement('div');
    var name =chat.name;
    showmessage_container.className='rightsidemessages'
    console.log(chat.name)
    if(id === chat.userId){
         name = 'You'
        showmessage_container.className='leftsidemessages'
    }
    
    showmessage_container.innerHTML=`
    <p>${name}: ${chat.message}</p>`

    chat_container.appendChild(showmessage_container)
    chat_container.scrollTop = chat_container.scrollHeight;
}