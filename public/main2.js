const createRoom= document.getElementById('createRoom');
const selectroom=document.getElementById('room');
createRoom.addEventListener( 'click', ()=>{
    const roomName=document.querySelector('#roomname').value;
    const option=document.createElement('option');
    option.value=roomName;
    option.textContent=`${roomName}`;
    selectroom.appendChild(option);
});