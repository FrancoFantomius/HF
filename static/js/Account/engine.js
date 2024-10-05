const signup = document.getElementById("signup");
const signin = document.getElementById("signin");

if ('primary' === signup.classList.value){
    signup.onclick = () => {
        form = document.getElementById("form");
        form.submit();
    }

    signin.onclick = () => {
        window.location.href = SignInURL;
    }

}

if ('primary' === signin.classList.value){
    signin.onclick = () => {
        form = document.getElementById("form");
        form.submit();
    }

    signup.onclick = () => {
        window.location.href = SignUpURL;
    }

}