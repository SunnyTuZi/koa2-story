import  mongoose from 'mongoose'

const Schema = mongoose.Schema

const userSchema = new Schema({
    account: String,
    sex: Number,
    age: Number,
    username: String,
    psw: String,
    status: { type: Number,default: 1},
    createDate: { type: Date,default: Date.now }
})
const User = mongoose.model('User',userSchema)
export {
    User
}
