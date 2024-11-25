import mongoose from "mongoose";
import  validator from 'validator';
import bcrypt from 'bcryptjs';

const Schema = mongoose.Schema;

const userSchema = new Schema({
    first_name: {
        type: String,
        required: true
    },
    last_name: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true,
        unique: true
    },
    age: {
        type: Number,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
    },
});


userSchema.statics.signup = async function (first_name, last_name, username, age, email, password) {
    try {
        // Check if all fields are filled
        if (!first_name || !last_name || !username || !age || !email || !password) {
            throw Error("All fields must be filled");
        }
        // Check if email is valid and not already in use
        const exists = await this.findOne({ email });
        if (!validator.isEmail(email)) {
            throw Error("Email is not valid");
        }
        if (exists) {
            throw Error("Email already in use");
        }

        // Check if username is not already in use
        const usernameExists = await this.findOne({ username });
        if (usernameExists) {
            throw Error("Username already in use");
        }
        // Check if password is strong enough
        if (!validator.isStrongPassword(password)) {
            throw Error("Password is not strong enough, must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number and one special character");
        }

        // hash and salt password

        const salt =  bcrypt.genSaltSync(10);
        const hash =  bcrypt.hashSync(password, salt);

        const user = await this.create({ first_name, last_name, username, age, email: email.toLowerCase(), password: hash });
        return user;
    } catch (error) {
        console.log(error)
        throw error;
    }

}

userSchema.statics.login = async function (email, password) {
    try {
        // Check if all fields are filled
        if (!email || !password) {
            throw Error("All fields must be filled");
        }
        // Check if email is valid and not already in use
        const user = await this.findOne({ email });
        if (!user) {
            throw Error("Incorrect email");
        }
        // Check if password is correct
        const match = await bcrypt.compare(password, user.password);
        if (!match) {
            throw Error("Incorrect password");
        }
        return user;
    } catch (error) {
        console.log(error)
        throw error;
    }
}

const User = mongoose.model("User", userSchema);

export default User;