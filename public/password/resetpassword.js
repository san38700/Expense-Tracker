const password = document.getElementById('password')
const form = document.getElementById('form')


form.addEventListener('submit',function (e) {
    e.preventDefault()
    //const email = document.getElementById('email').value
    const obj = {
        password : password.value
    }
    token = localStorage.getItem('jwtToken')
    console.log(token)
    axios.post('http://localhost:3000/password/newpassword', obj, {headers :{'Authorization': token}})
    .then(res => {

        console.log(res.data)
        var messageElement = document.getElementById("message");

        messageElement.innerHTML = ""
        messageElement.innerHTML += `\"${res.data.message}\  <a href="..\\login\\login.html">Click here to login</a>"`;
    })
})