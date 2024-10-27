const loginValidation = (email: string, password: string) => {
    const error = { email: '', password: '' }
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
    return error;
}

export default loginValidation;