import { Schema, Connection } from 'mongoose'

export default (conn: Connection, callback: (schema: Schema) => void) => {
  const UserSchema = new Schema(
    {
      username: String,
      isAdmin: Boolean,
      isDeleted: Boolean,
    },
    { timestamps: true },
  )

  // The callback is used to add hooks.
  // Hooks must be added before the model is created.
  if (callback) callback(UserSchema)

  return conn.model('User', UserSchema, 'users')
}
