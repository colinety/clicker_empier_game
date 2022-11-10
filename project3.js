// user class



const config = {
    initialForm: document.getElementById("user-form"),
    mainPage: document.getElementById("main-page"),
}

class UserAccount{
    constructor(name){
        this.name = name;
    }
}


function initializeUserAccount(){
    const form = document.getElementById("user-form");
    let userName = new UserAccount(
        form.querySelectorAll(`input[name="user-name"]`).item(0).value,
    );
    console.log(userName);
    config.initialPage.classList.add("d-none");
    config.mainPage.append(main_page(userName));
}

function mainPage(userAccount){
    let burgerInfo = document.createElement("div");
    burgerInfo.classList.add("")
}

