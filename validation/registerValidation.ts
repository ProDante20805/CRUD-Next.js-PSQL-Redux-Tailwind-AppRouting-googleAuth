const registerValidation = (email: string, password: string, password2: string) => {
    const error = { email: '', password: '', password2: '' }
    if(!email) {
        error.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
        error.email = "Email is not valid";
    }
    
    if(!password) {
        error.password = "Password is required";
    } else if ( password.length <= 6 ) {
        error.password = "Password must be longer than 6 characters."
    }

    if(!password2) {
        error.password2 = "Confirm Password is required";
    } else if ( password !== password2 ) {
        error.password2 = "Passwords must be matched."
    }

    return error;
}

export default registerValidation;