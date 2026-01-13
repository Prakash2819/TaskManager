const taskcardContainer = document.querySelector(".taskcard-container")
const form = document.querySelector("#form")

document.addEventListener("DOMContentLoaded",()=>{
    showItem();
})

form.addEventListener("submit", (event) => {
    event.preventDefault();
    setItem();
})

let taskid =1;
// Local Storage
function setItem() {
    const taskName = document.querySelector(".task-name").value.trim()
    var taskDescription = document.querySelector("textarea").value.trim()
    const dueDate = document.querySelector(".date").value
    const formattedDate = new Date(dueDate).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric"
    });

    const priority = document.querySelector("select").value
    const status = document.querySelector(".radio:checked")?.value
    if (taskDescription == "") {
        taskDescription = "No Description"
    }
    const task = {
        id:taskid++,
        name: taskName,
        description: taskDescription,
        date: formattedDate,
        priority: priority,
        status: status
    }
    localStorage.setItem(`${taskName}`, JSON.stringify(task))
    createTask(task);
}

function showItem() {
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i)
        const value = JSON.parse(localStorage.getItem(key))
        createTask(value);
    }
}
// Task Card Create
function createTask(value){
        const taskcard = document.createElement("div")
        taskcard.classList.add("task-card", value.priority)
        taskcard.dataset.id=value.id
        taskcard.innerHTML = `<h4>${value.name} <i class='far fa-trash-alt'></i> <i class='far fa-edit'></i></h4><br>
        <p>${value.description}</p>
        <p></p>
        <p><img class="calender-img" src="calender.png"> Due: ${value.date}</p>
        <p><img class="contact-img" src="contact.jpg"> Guest</p><br> 
        <div class="level-container">
            <label class="${value.priority.toLowerCase()}"><span>&#9679</span> ${value.priority}</label>
            <label class="${value.status.toLowerCase()}"><small>&#9679</small> ${value.status}</label>
        </div>`
       taskcardContainer.appendChild(taskcard)
}
//Delete Option
document.addEventListener("click", (event) => {
  if (event.target.classList.contains("fa-trash-alt")) {
    const taskCard = event.target.closest(".task-card")
    const id = taskCard.dataset.id
    removeItem(id)
    taskCard.remove()
    }})

function removeItem(id){
    for(let i=0;i<localStorage.length;i++){
        const key = localStorage.key(i)
        const value = JSON.parse(localStorage.getItem(key))
        if(value.id==id){localStorage.removeItem(key);break}
    }
}

// Edit Box
document.addEventListener("click",(event)=>{
    if(event.target.classList.contains("fa-edit")){
    openPopup() 
    }
})
const close = document.querySelector(".close")
close.addEventListener("click",closePopup)
function closePopup(){
    const popupBox = document.querySelector(".popup-box")
    popupBox.style.visibility="hidden"
}
function openPopup(){
    const popupBox = document.querySelector(".popup-box")
    popupBox.style.visibility="visible"
}