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
        console.log(response.data.id);

        var messageElement = document.getElementById("message");
        messageElement.innerHTML = "";
        messageElement.innerHTML += `\"${response.data.message}\"`;
        const id = response.data.id;

    } catch (err) {
        console.log(err);
    }
});







// form.addEventListener('submit',async function (e) {
//     e.preventDefault()
//     //const email = document.getElementById('email').value
//     const obj = {
//         Email : email.value
//     }

//     axios.post('http://localhost:3000/password/forgotpassword', obj)
//     .then(res => {
        
//         console.log(res.data.id)
//         var messageElement = document.getElementById("message");

//         messageElement.innerHTML = ""
//         messageElement.innerHTML += `\"${res.data.message}\"`;
//         const id = res.data.id
        
//         await axios.get(`http://localhost:3000/password/resetpassword/${id}`)
//         .then((res) => console.log(res))
//         .catch(err => console.log(err))
    
        
//      })
//     .catch(err => console.log(err))
// })

