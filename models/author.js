'use strict'
module.exports = (sequelize, DataTypes) => {
  const author = sequelize.define('author', {
    firstName: DataTypes.STRING,
    lastName: DataTypes.STRING,
    bio: DataTypes.TEXT
  }, {})

  author.associate = function(models) {
    // associations can be defined here
    models.author.hasMany(models.article)
  }

  //prototype inherited by all js objects in author table
  author.prototype.getFullName = function(){
    return this.firstName + ' ' + this.lastName
  }
  return author
}
