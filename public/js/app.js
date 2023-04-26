const chatbox = document.getElementById("chatbox");
document.addEventListener('DOMContentLoaded',() => {
    const userItems = document.getElementsByClassName('user-item');
    for(let i = 0; i < userItems.length; i++){
        userItems[i].addEventListener('click',() => {
            const user = userItems[i].getElementsByClassName('name')[0].innerHTML;
            chatbox.style.display = "block";
            const chatUser = document.getElementById('selected-chat');
            chatUser.innerHTML = '';
            chatUser.innerHTML = 'Chat with ' + user;
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
    


