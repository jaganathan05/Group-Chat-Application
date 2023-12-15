const chatBox = document.getElementById('chatBoxcontainer');
const sendbtn = document.getElementById('sendmessage');
const API = 'http://localhost:3000';
let currentUserId ;

const socket = io('http://localhost:5000');
socket.on('connect', () => {
    console.log('Connected with ID:', socket.id);
});
socket.on('receivemessage',({savemessage, groupId})=>{

    const selectedGroup = document.querySelector('.group-name.active');
    const selectedGroupId =selectedGroup.dataset.groupId;
    
    if(selectedGroupId===groupId){
        show_messages(savemessage , currentUserId)
    }
    
}) 



sendbtn.addEventListener('click', (event) => {
    var textarea = document.getElementById('messageInput');
    if (!textarea.checkValidity()) {
        event.preventDefault();
        textarea.checkValidity();
        
    }
    else{
    const message = document.getElementById('messageInput').value;
    const token = localStorage.getItem('token');
    const selectedGroup = document.querySelector('.group-name.active');
        const groupId = selectedGroup ? selectedGroup.dataset.groupId : null;

        if (!groupId) {
            console.error('No group selected');
            return;
        }
    const data = {
        message,groupId
    };
    
    axios.post(`${API}/chat/sendmessage`, data, {
        headers: {
            Authorization: token
        }
    })
        .then(response => {
            if (response) {
                document.getElementById('messageInput').value=''
            }
        })
        .catch(err => {
            console.log(err);
        });
    }

    
});




window.addEventListener('DOMContentLoaded', async()=>{
    const token = localStorage.getItem('token'); 
    const groupSettingsIcon = document.getElementById('groupsettings');
    const response1 = await axios.get(`${API}/getgroups`,
    {
        headers: {
            Authorization: token
        }
    })

    if(response1){
        response1.data.Groups.forEach((group)=>{
            show_groups(group);
        })
    }

    const groupElements = document.querySelectorAll('.group-name');
    groupElements.forEach((groupElement) => {
        groupElement.addEventListener('click', async () => {
            groupElements.forEach((otherGroup) => {
                otherGroup.classList.remove('active');
            });
    
            groupElement.classList.add('active');
            
    
            const chat_container = document.getElementById('chatBox');
            if (chatBox.style.display === 'none') {
                chatBox.style.display = 'block';
                showmembercontainer.style.display='none'
                addgroupform.style.display='none';
                addnewmembercontainer.style.display='none';
            } else {
                chatBox.style.display = 'block';
            }

            if (addgroupform.style.display === 'block') {
                addgroupcancel.style.display = 'block';
    
                // Trigger the click event on addgroupcancel
                addgroupcancel.click();
            } else {
                addgroupbtn.style.display='block';
            }
    
            const groupId = groupElement.dataset.groupId;
            chat_container.innerHTML = '';
            chat_container.innerHTML=`<div class="centered-container">
            <button onclick="getoldmessages(event)" class=" form-control btn-dark">Old Archived Messages</button>
            <h3>Today messages</h3>
        </div>`
            await loadGroupMessages(groupId);

            if (groupElement.classList.contains('active')) {
                groupSettingsIcon.style.display = 'block';
            } else {
                groupSettingsIcon.style.display = 'none';
            }
        });
    });
    
    
    

    async function loadGroupMessages(id){
        try{

            
            const response =await axios.get(`${API}/chat/getmessage?groupid=${id}`,{
                headers:{
                    Authorization:token
                }
            
            })
    
        
            if(response){
                currentUserId = response.data.userId
                response.data.message.forEach(chat => {

                    show_messages(chat,currentUserId)
                });
                
                }  
                
        }
        catch(err){
                console.log(err);
        }
              
    }


});
     

function show_messages(chat,id){
    const chat_container = document.getElementById('chatBox');
    const showmessage_container = document.createElement('div');
    var name =chat.name;
    showmessage_container.className='rightsidemessages'
    if(id === chat.userId){
         name = 'You'
        showmessage_container.className='leftsidemessages'
    }
    
    showmessage_container.innerHTML=`
    <p>${name}: ${chat.message}</p>`

    chat_container.appendChild(showmessage_container)
    chat_container.scrollTop = chat_container.scrollHeight;

    
}




function show_groups(group) {
    const group_container = document.getElementById('groupBox');
    const showgroup_container = document.createElement('div');
  
    showgroup_container.setAttribute('data-group-id', group.id);
    showgroup_container.className = 'group-name'; 
  
    showgroup_container.innerHTML = `<p>${group.name}</p>`;
    group_container.appendChild(showgroup_container);
  }
  
  

const addgroupbtn = document.getElementById('addgroup');
const addgroupform = document.getElementById('addgroupform')

addgroupbtn.addEventListener('click',()=>{
    if(addgroupform.style.display==='none'){
        addgroupform.style.display='block';
        addgroupbtn.style.display='none';
        addnewmembercontainer.style.display='none';
        chatBox.style.display='none';
        groupSettingsIcon.style.display='none' ;
        showmembercontainer.style.display='none'      
    }
    else{
        addgroupform.style.display='none';
        chatBox.style.display='block'
        groupSettingsIcon.style.display='block';
        
    }
})

const addgroupcancel = document.getElementById('addgroupcancel');

addgroupcancel.onclick=()=>{
    if(addgroupform.style.display==='block'){
        addgroupform.style.display='none';
        addgroupbtn.style.display='block'
        chatBox.style.display='block'
    }
    else{
        addgroupform.style.display='block';
        addgroupbtn.style.display='none';
        chatBox.style.display='none' 
    }
}

function creategroup(event){
    event.preventDefault();
    const Groupname = document.getElementById('groupname').value;

    const Members = document.getElementById('groupemails').value;

    const token = localStorage.getItem('token');


    const MembersArray = Members.split(',')

    const data={
        Groupname, MembersArray
    }

    axios.post(`${API}/creategroup`,data,{
        headers: {
            Authorization: token
        }
    }).then((response)=>{
        alert('New Group Created')
        window.location.href='/chat'
    })
}

const groupSettingsIcon = document.getElementById('groupsettings');
groupSettingsIcon.addEventListener('click',()=>{
    
})


async function getoldmessages(event){
    event.preventDefault();
    console.log('btn')
    try {
        const chat_container = document.getElementById('chatBox');
        const token = localStorage.getItem('token');
        const selectedGroup = document.querySelector('.group-name.active');
        const groupId = selectedGroup.dataset.groupId;

        const response = await axios.get(`${API}/chat/getoldmessages?groupid=${groupId}`, {
            headers: {
                Authorization: token
            }
        });

        if (response) {
            currentUserId = response.data.userId;
            chat_container.innerHTML = ''; // Clear previous content
            chat_container.innerHTML = `
                <div class="centered-container">
                    <h3>All messages</h3>
                </div>`;

            response.data.message.forEach(chat => {
                show_messages(chat, currentUserId);
            });
        }
    } catch (err) {
        console.log(err);
    }
};
