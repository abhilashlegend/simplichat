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