const Group_members = document.getElementById('groupmembers');
const membersBox = document.getElementById('membersBox');
const showmembercontainer = document.getElementById('showmembercontainer');

Group_members.addEventListener('click',async ()=>{
    try{
        if(showmembercontainer.style.display='none'){
            chatBox.style.display='none';
            showmembercontainer.style.display='block';
            addnewmembercontainer.style.display='none';
        }
        else{
            chatBox.style.display='block';
            showmembercontainer.style.display='none';
        }
    
        show_groups_members()
            
        }
    catch(err){
        console.log(err)
    }
})

async function show_groups_members(){
    try{
        const selectedGroup = document.querySelector('.group-name.active');
        if(selectedGroup){
            const group_id = selectedGroup.dataset.groupId;
            const token = localStorage.getItem('token');
            console.log(group_id)
            const response = await axios.get(`${API}/getgroupmembers?groupId=${group_id}`,{
                headers: {
                    Authorization: token
                }
            })
            if(response){
                const groupmember_container = document.getElementById('membersBox');
                groupmember_container.innerHTML=''
                response.data.Members.forEach(member => {
                    show_members(member, response.data.admindetails, response.data.userid);
                });
                
            }
        }
    }
    
    catch(err){
        console.log(err)
    }
}

function show_members(member,admins,userid){
    const groupmember_container = document.getElementById('membersBox');
    const memberdetails = document.createElement('div');
    if(admins[member.id]==='true' && member.id===userid){
        memberdetails.innerHTML = `<p class='member-details' style="display: inline-block; margin: 0;">
        <i class="fas fa-crown" style="color: gold;"></i>
        <h6 style="display: inline; margin: 0;">${member.name}</h6>
        ${member.email}
      </p>
      `
    }
    else if(admins[member.id]==='true' && member.id!==userid){
        memberdetails.innerHTML = `<p class='member-details' style="display: inline-block; margin: 0;">
        <i class="fas fa-crown" style="color: gold;"></i>
        <h6 style="display: inline; margin: 0;">${member.name}</h6>
        ${member.email}
        <button class='btn btn-danger ' onclick="removeadmin('${member.id}')">Remove Admin</button>
        <button class='btn btn-dark ' onclick="removemember('${member.id}')">Remove Member</button>
      </p>
      `

    }
    else if(admins[member.id]==='false' && member.id===userid){
        memberdetails.innerHTML = `<p class='member-details' style="display: inline-block; margin: 0;">
        <i class="fas fa-user-shield" style="margin-right: 5px;"></i>
        <h6 style="display: inline; margin: 0;">${member.name}</h6>
        ${member.email}
        </p>
        `
    }
    else{
        memberdetails.innerHTML = `<p class='member-details' style="display: inline-block; margin: 0;">
        <i class="fas fa-user-shield" style="margin-right: 5px;"></i>
        <h6 style="display: inline; margin: 0;">${member.name}</h6>
        ${member.email}
        <button class='btn btn-danger btn-group-sm' onclick="makeAdmin('${member.id}')">Make Admin</button>
        <button class='btn btn-dark' onclick="removemember('${member.id}')">Remove Member</button></p>
        `
    }
    

    groupmember_container.appendChild(memberdetails);

}

const addnewmemberbtn = document.getElementById('addnewmember');
const addnewmembercontainer = document.getElementById('addnewmembercontainer');

addnewmemberbtn.addEventListener('click',()=>{
    if(addnewmembercontainer.style.display==='none'){
        addnewmembercontainer.style.display='block';
        addgroupform.style.display='none';
        chatBox.style.display='none'
        showmembercontainer.style.display='none';
    }
    else{
        addnewmembercontainer.style.display='none';
    }

    
})

function addnewmember(event){
        event.preventDefault();
        const selectedGroup = document.querySelector('.group-name.active');
        const groupId = selectedGroup.dataset.groupId;
        const emails = document.getElementById('newmembersemails').value ;
        const token = localStorage.getItem('token');
        const emailarray = emails.split(',')

        const data = {
            emailarray
        }
        console.log(data,groupId)
        axios.post(`${API}/addnewmember?groupid=${groupId}`,data,{
            headers: {
                Authorization: token
            }
        })
        .then((response)=>{
            
            if(response.data.message==='You are not admin for this Group'){
                alert(response.data.message);
            }
            else{
                alert(response.data.message)
                addnewmembercontainer.style.display='none';
                showmembercontainer.style.display='block';
                show_groups_members();
            }
        })
}

async function makeAdmin(id){
        const selectedGroup = document.querySelector('.group-name.active');
        const groupId = selectedGroup.dataset.groupId;
        const token = localStorage.getItem('token');
        const data = {
            userid: id,
            groupId
        }
        const response =await  axios.post(`${API}/makegroupadmin`,data,{
            headers: {
                Authorization: token
            }
        })
        if(response){
            if(response.data.message==='You are not admin for this Group'){
                alert(response.data.message);
            }
            else{
                alert(response.data.message)
                show_groups_members();
            }
        }
}
async function removemember(id){
    const selectedGroup = document.querySelector('.group-name.active');
        const groupId = selectedGroup.dataset.groupId;
        const token = localStorage.getItem('token');
        const data = {
            userid: id,
            groupId
        }
        const response =await  axios.post(`${API}/removegroupmember`,data,{
            headers: {
                Authorization: token
            }
        })
        if(response){
            if(response.data.message==='You are not admin for this Group'){
                alert(response.data.message);
            }
            else{
                alert(response.data.message)
                show_groups_members();
            }
        }
    
}

async function removeadmin(id){
    try{
    const selectedGroup = document.querySelector('.group-name.active');
        const groupId = selectedGroup.dataset.groupId;
        const token = localStorage.getItem('token');
        const data = {
            userid: id,
            groupId
        }
        const response =await  axios.post(`${API}/removeadmin`,data,{
            headers: {
                Authorization: token
            }
        })
        if(response){
            if(response.data.message==='You are not admin for this Group'){
                alert(response.data.message);
            }
            else{
                alert(response.data.message)
                show_groups_members();
            }
        }
    }
    catch(err){
        console.log(err)
    }
}