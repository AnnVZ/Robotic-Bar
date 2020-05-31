function changeAuthorizationFormDisplay(form, state) {
    document.getElementById('dark').style.display = state;
    document.getElementById(form).style.display = state;
    document
      .querySelectorAll('input.text_input, textarea')
      .forEach(el => (el.value = ''));
    document.getElementById('user_type_customer').checked = true;
    document.getElementById('user_type_customer_signup').checked = true;
  }
  
  function switchForms(form1, form2) {
    changeAuthorizationFormDisplay(form1, 'none');
    changeAuthorizationFormDisplay(form2, 'block');
    if (form1 == 'login_form') {
      alert('Registration is not available yet');
    }
  }