'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class RoleSchema extends Schema {
  up () {
    this.create('roles', (table) => {
      table.increments()
      table.string('name')
      table.timestamps()
    });

    this.create('role_user', (table) => {
      table.integer('user_id').unsigned().references('id').inTable('users').index();
      table.integer('role_id').unsigned().references('id').inTable('roles').index();
    });
  }

  down () {
    this.drop('role_user');
    this.drop('roles')
  }
}

module.exports = RoleSchema
