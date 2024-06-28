const chatform=document.getElementById('chat-form');
const chatmessages=document.querySelector('.chat-messages');
const roomname=document.getElementById('room-name');
const userlist=document.getElementById('users');
console.log(chatform);
//get username and rooms from url
const {username,room}= Qs.parse(location.search,{
    ignoreQueryPrefix:true

});


const socket=io.connect();

//join chatroom
socket.emit('joinroom',{username,room});

//get room and users

socket.on('roomusers',({room,users})=>{
    outputRoomname(room);
    outputusers(users);
})

//message from server
socket.on('message',message=>{
    console.log(message);
    outputmessage(message);

    //scroll down
    chatmessages.scrollTop=chatmessages.scrollHeight;

})
//message submit
chatform.addEventListener('submit',(e)=>{
    e.preventDefault();
    //get message
    const msg=e.target.elements.msg.value;
    //emit message
    socket.emit('chatmessage',msg);

    //clear input
    e.target.elements.msg.value='';
    e.target.elements.msg.focus();
});

//output message to DOM
function outputmessage(message){
    const div=document.createElement('div');
    div.classList.add('message');
    div.innerHTML=	div.innerHTML = `
    <p class="meta">${message.username}<span>${message.time}</span></p>
    <p class="text">${message.text}</p>
`;

    document.querySelector('.chat-messages').appendChild(div);

}

//add room name to dom
function outputRoomname(room){
    roomname.innerText=room;
}

//add users to dom

function outputusers(users){
    userlist.innerHTML=`
    ${users.map(user=>`<li>${user.username}</li>`).join('')}`
}
// Listen for previousMessages event
socket.on('previousMessages', messages => {
    // Loop through the messages and output each message to the DOM
    messages.forEach(message => {
        outputmessage({
            username: message.username,
            time: message.time, // Adjust this according to your message schema
            text: message.msg // Assuming 'msg' is the property name for the message text
        });
    });

    // Scroll down
    chatmessages.scrollTop = chatmessages.scrollHeight;
});


//file upload
function uploadFile(files) {
    // You can write your upload logic here, for now, let's just log the selected files
    //console.log("Selected files:", files);
    const file = files[0];
        const reader = new FileReader();

        reader.onload = function(e) {
            // Send file data to server
            //console.log(e.target.result);
            socket.emit('fileUpload', { name: file.name, data: e.target.result });
        }

        reader.readAsDataURL(file);
}

// Function to handle received file data
socket.on('fileDownload', (file) => {
    // Process the received file data
    console.log('Received file:', file);
    displayFileInChat(file);
    // You can display the file, save it locally, etc.
});

function displayFileInChat(fileData) {
    const fileElement = document.createElement('div');
    fileElement.classList.add('message');
    fileElement.innerHTML=`<p class="meta">${fileData.username} <span>${fileData.time}</span></p>`;
    if (fileData.data[5]=='i'){
    const image = new Image();
    image.src = fileData.data;
    fileElement.appendChild(image);}
    else
    {
        const iframe = document.createElement('iframe');

        // Set the source of the iframe to the data URI
        iframe.src = fileData.data;

        // Set the attributes to ensure PDF display
        iframe.setAttribute('width', '100%');
        iframe.setAttribute('height', '100%');
        iframe.setAttribute('frameborder', '0');

        // Append the iframe to the document body
        fileElement.appendChild(iframe);

        // Create a download link
        const downloadLink = document.createElement('a');
        downloadLink.textContent = 'Download PDF'; // Text for the download link
        downloadLink.href = fileData.data; // Set the href attribute to the data URI
        downloadLink.download = fileData.name; // Specify the filename for the downloaded file

        // Append the download link to the document body
        fileElement.appendChild(downloadLink);
    }

    // Append the file element to the chat container
    document.querySelector('.chat-messages').appendChild(fileElement);
}
