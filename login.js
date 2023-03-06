function login() {
    const nameElement = document.querySelector("#name");
    localStorage.setItem("username", nameElement.value);
    window.location.href = "play.html";
}