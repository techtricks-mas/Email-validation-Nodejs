const mongoose = require('mongoose')

const {Schema} = mongoose

const userModel = new Schema({
    email: {
        type: String,
        validate: {
            validator: async function(email) {
              const user = await this.constructor.findOne({ email });
              if(user) {
                return false;
              }
              return true;
            },
            message: props => 'The specified email address is already in use.'
          },
        required: true
    },
    varify: {
        type: Boolean,
        default: false
    }
})

module.exports = mongoose.model('user', userModel);