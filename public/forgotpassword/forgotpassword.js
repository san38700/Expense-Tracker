const email = document.getElementById('email')
const form = document.getElementById('form')

form.addEventListener('submit', async function (e) {
    e.preventDefault();

    //const email = document.getElementById('email').value
    const obj = {
        Email: email.value
    };

    try {
        const response = await axios.post('http://localhost:3000/password/forgotpassword', obj);
        console.log(response);

        var messageElement = document.getElementById("message");
        messageElement.innerHTML = "";
        messageElement.innerHTML += `\"${response.data.message}\"`;
        const id = response.data.id;

    } catch (err) {
        console.log(err);
    }
});



