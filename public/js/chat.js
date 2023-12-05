
const sendbtn = document.getElementById('sendmessage');
const API = 'http://localhost:3000';

sendbtn.addEventListener('click', (event) => {
    var textarea = document.getElementById('messageInput');
    if (!textarea.checkValidity()) {
        // The form is not valid; prevent submission
        event.preventDefault();

        textarea.checkValidity
        // Optionally, you can provide user feedback about the required field.
        // For example, you can highlight the textarea or display an error message.
    }
    else{
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
                document.getElementById('messageInput').value=''
                console.log(response)
            }
        })
        .catch(err => {
            console.log(err);
        });
    }

    
});

window.addEventListener('DOMContentLoaded', async()=>{
    const token = localStorage.getItem('token'); 
    let params = 0;
    console.log(params)
        const response =await axios.get(`${API}/chat/getmessage`,{
            headers:{
                Authorization:token
            }
        
        })
        console.log('settimeout',params);
    
        if(response){
            localStorage.setItem('chats', JSON.stringify(response.data.message))

            const chats = JSON.parse(localStorage.getItem('chats'))
            chats.forEach(chat => {
                console.log(response.data.userId)
                show_messages(chat,response.data.userId)
            });
            params = chats[9].id;
            }
        
        setInterval(async()=>{
            const response =await axios.get(`${API}/chat/getNewmessage?lastmessageid=${params}`,{
                headers:{
                    Authorization:token
                }
            
            })

            if(response){
                
                response.data.message.forEach(chat => {
                    console.log(response.data.userId)
                    show_messages(chat,response.data.userId)
                });

                params = response.data.message[response.data.message.length - 1].id;
                }
        },1000)
       })
     

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