function logOut() {
    deleteCookie('login');
    deleteCookie('role');
    deleteCookie('name');
}

async function submitLogin(form) {
    let login = form.login.value;
    let password = form.password.value;
    let role = form.type.value;
    document.getElementById('login_loader').style.display = 'block';
    document.getElementById('login_button').value = '';
    let responceJSON = await getJSON(
        'http://robotbar.azurewebsites.net/api/LoginningUser?login=' +
        login +
        '&password=' +
        password
    );
    if (responceJSON == 500) {
        document.getElementById('login_loader').style.display = 'none';
        document.getElementById('login_button').value = 'Log in';
    } else if (responceJSON == null) {
        document.getElementById('login_loader').style.display = 'none';
        document.getElementById('login_button').value = 'Log in';
        setTimeout(() => alert('Wrong input data'), 50);
    } else {
        if (responceJSON['role'] != role) {
            document.getElementById('login_loader').style.display = 'none';
            document.getElementById('login_button').value = 'Log in';
            setTimeout(() => alert('Wrong input data'), 50);
        } else {
            setCookie('login', login);
            setCookie('role', responceJSON['role']);
            let fName = responceJSON['firstName'];
            if (fName.length != 0) {
                let names = fName.split(' ');
                fName = '';
                names.forEach(
                    name =>
                        (fName += name[0].toUpperCase() + name.slice(1).toLowerCase() + ' ')
                );
            }
            let sName = responceJSON['secondName'];
            if (sName.length != 0) {
                let names = sName.split(' ');
                sName = '';
                names.forEach(
                    name =>
                        (sName += name[0].toUpperCase() + name.slice(1).toLowerCase() + ' ')
                );
            }
            setCookie('name', fName + sName);
            window.location.href = 'catalog.html';
        }
    }
}

function submitSignup(form) {
    let fname = form.fname.value;
    let sname = form.sname.value;
    let login = form.login.value;
    let password = form.password.value;
    let password_rep = form.password_rep.value;
    let role = form.type.value;
    if (password != password_rep) {
        alert('Passwords are different');
    } else {
        alert('Registration is not available yet');
        //posting user signup data to server and redirect
    }
}
