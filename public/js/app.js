const chatbox = document.getElementById("chatbox");
document.addEventListener('DOMContentLoaded',() => {
    const userItems = document.getElementsByClassName('user-item');
    for(let i = 0; i < userItems.length; i++){
        userItems[i].addEventListener('click',function() {
            const user = userItems[i].getElementsByClassName('name')[0].innerHTML;
            chatbox.style.display = "block";
            const chatUser = document.getElementById('selected-chat');
            chatUser.innerHTML = '';
            chatUser.innerHTML = 'Chat with ' + user;
             let userId = this.getAttribute('data-id');
             receiver_id = userId;
            socket.emit('existsChat', {sender_id: sender_id, receiver_id: receiver_id});
            
        })
    }
})

// Update user status

socket.on('getOnlineUser', data => {
    const online = document.getElementById(data.user_id + '-status');
    online.classList.remove('offline');
    online.classList.add('online');
});

socket.on('getOfflineUser', data => {
    const offline = document.getElementById(data.user_id + '-status');
    offline.classList.remove('online');
    offline.classList.add('offline');
})
    

const chatForm = document.getElementById("chat-form");

chatForm.addEventListener('submit', function(e) {
    e.preventDefault();
    const message = document.getElementById('message').value;
    const url = '/save-chat';
    const data = {
        sender_id: sender_id,
        receiver_id: receiver_id,
        message: message
    };

    const params = {
        method: 'POST',
        headers: {
            'Content-type': 'application/json'
        },
        body: JSON.stringify(data)
    };

    fetch(url, params).then(response => response.json()).then(data => { 
        document.getElementById('message').value = '';
        let chat = data.data.message;
        let addDel = '';
        if(sender_id == data.data.sender_id) {
            addDel = `<i class="bi bi-trash chat-delete-icon" data-id="${data.data._id}" data-bs-toggle="modal" data-bs-target="#staticBackdrop"></i>`;
        }
        const now = new Date();
        const time = now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
        let html = `
        <li class="clearfix" id="${data.data._id}">
            <div class="message-data text-right"> 
                <span class="message-data-time">${time}, Today</span> 
            </div>
            ${addDel}
            <div class="message other-message float-right"> 
                ${chat}
            </div>
        </li>
        `;
        const chatContainer = document.getElementById("chat-container");
        chatContainer.innerHTML += html;
        scrollChatsToBottom();
        socket.emit('newChat', data)

    }).catch(error => console.error('Error :', error));
})


socket.on('loadNewChat', function(data){
    if(sender_id == data.data.receiver_id && receiver_id == data.data.sender_id){
        const now = new Date();
        const time = now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
        let html = `
        <li class="clearfix" id="${data.data._id}">
            <div class="message-data"> 
                <span class="message-data-time">${time}, Today</span>
            </div>
            <div class="message my-message">
                ${data.data.message}
            </div>
        </li>
        `;
        const chatContainer = document.getElementById("chat-container");
        chatContainer.innerHTML += html;
        scrollChatsToBottom();
    }
    
})

socket.on('loadChats', function(data){
    const chatContainer = document.getElementById("chat-container");
    chatContainer.innerHTML = '';

    const chats = data.chats;

    var options = {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
    };

    let html = '';

    for(let x = 0; x < chats.length; x++){
        let addClass = '';
        let timeClass = '';
        if(chats[x]['sender_id'] == sender_id){
            addClass = 'message other-message float-right';
            timeClass = 'message-data text-right';
        } else {
            addClass = 'message my-message';
            timeClass = 'message-data';
        }

        const date = new Date(chats[x]['updatedAt']);
        const formattedDate = date.toLocaleDateString("en-GB", options);
        let addDel = '';
        if(chats[x]['sender_id'] == sender_id) {
            addDel = `<i class="bi bi-trash chat-delete-icon" data-id="${chats[x]['_id']}" data-bs-toggle="modal" data-bs-target="#staticBackdrop"></i>`;
        }

        html += `
        <li class="clearfix" id="${chats[x]['_id']}">
            <div class="${timeClass}"> 
                <span class="message-data-time">${formattedDate}</span> 
            </div>
            ${addDel}
            <div class="${addClass}"> 
                ${chats[x]['message']}
            </div>
            
        </li>
        `;
    }
    chatContainer.innerHTML += html;

    scrollChatsToBottom();
});



function scrollChatsToBottom(){
    const chatContainer = document.getElementById("chat-container");
    chatContainer.lastElementChild.scrollIntoView();
}



var myModalEl = document.getElementById('staticBackdrop')
myModalEl.addEventListener('show.bs.modal', function (event) {
    let msg = event.relatedTarget.nextElementSibling.innerText;
    document.getElementById("delete-message").innerText = msg;
    document.getElementById("delete-message-id").value = event.relatedTarget.getAttribute("data-id");
})

const delConfirmForm = document.getElementById("deleteConfirmForm");

delConfirmForm.addEventListener('submit', event => {
    event.preventDefault();

    const id = document.getElementById("delete-message-id").value;

    const url = '/delete-chat';

    const data = {
        id: id
    };

    const params = {
        method: 'POST',
        headers: {
            'Content-type': 'application/json'
        },
        body: JSON.stringify(data)
    };

    fetch(url, params).then(response => response.json()).then(data => {
        document.getElementById(id).remove();  
        const DelModal = document.getElementById('staticBackdrop');
        const modal = bootstrap.Modal.getInstance(DelModal);
        modal.hide();
        socket.emit('chatDeleted', id);
    }).catch(error => console.log(error));
});

socket.on('chatMessageDeleted', function(id){
    document.getElementById(id).remove();
});