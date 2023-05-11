const mongoose = require('mongoose');
const { toJSON } = require('./plugins');

const privacyPolicySchema = mongoose.Schema(
  {
    content: {
      type: String,
      required: true,
      index: true,
    },
    language: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'Language'
    },  
    isAtive: {
      type: Date,
      default: true,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    }      
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
privacyPolicySchema.plugin(toJSON);

/**
 * @typedef PrivacyPolicy
 */
const PrivacyPolicy = mongoose.model('PrivacyPolicy', privacyPolicySchema);

module.exports = PrivacyPolicy;
