const mongoose = require('mongoose');
const { toJSON } = require('./plugins');

const languageSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      index: true,
      default:"English"
    },    
    code: {
      type: String,    
      default:"EN"
    },
    flagImage: {
      type: String,    
      default:"https://cdn-icons-png.flaticon.com/128/555/555417.png"
    },
    isAtive: {
      type: Date,
      default: true,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
languageSchema.plugin(toJSON);

/**
 * @typedef Language
 */
const Language = mongoose.model('Language', languageSchema);

module.exports = Language;
