let eyeicon = document.getElementById('eyeicon')
let password = document.getElementById('password')

eyeicon.onclick = function(){
    if (password.type == 'password'){
        password.type = 'text'
        eyeicon.src = 'eye-open.png'
    }else{
        password.type = 'password'
        eyeicon.src = 'eye-close.png'
    }
}

document.addEventListener('DOMContentLoaded', function () {
    // Wait for the DOM content to be loaded

    const form = document.getElementById('form');
    const errorContainer = document.getElementById('error-container');

    

    form.addEventListener('submit', function (event) {
        event.preventDefault(); // Prevent the default form submission

        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        // Create an object with the user's email and password
        const userObj = {
            email: email,
            password: password
        };

        console.log(userObj)
        // Send a POST request using Axios
        axios.post('http://localhost:3000/user/login', userObj)
            .then(response => {
                errorContainer.innerHTML = ""
                alert('User logged in successfully')
                console.log(response.data.user);
                localStorage.setItem('jwtToken', response.data.jwtToken)
                window.location.href = '..\\expensetracker\\expense.html';
            })
            
            .catch(error => {
                console.error(error); 
                // const errorContainer = document.getElementById('error-container');
    
                if (errorContainer) {
                    errorContainer.innerHTML = ""
                    const div = document.createElement('div');
                    div.textContent = error.response.data.message
                    div.style.color = 'red'
                    errorContainer.appendChild(div);
                    setTimeout(function() {
                        div.remove(); // Remove the div from the DOM
                        form.reset()
                    }, 3000);
                    
            }
            });
    });
});
