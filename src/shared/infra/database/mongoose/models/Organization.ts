import { Schema, Connection } from 'mongoose'
const ObjectId = Schema.Types.ObjectId

export default (conn: Connection, callback: (schema: Schema) => void) => {
  const OrganizationMemberSchema = new Schema(
    {
      user: {
        type: ObjectId,
        required: true,
        ref: 'User',
      },
      roles: [
        {
          type: String,
          required: true,
        },
      ],
    },
    { _id: false, usePushEach: true },
  )

  const OrganizationSchema = new Schema(
    {
      name: String,
      maxTeams: Number,
      maxTeamMembers: Number,
      members: [OrganizationMemberSchema],
      isDeleted: Boolean,
    },
    { timestamps: true },
  )

  // The callback is used to add hooks.
  // Hooks must be added before the model is created.
  if (callback) callback(OrganizationSchema)

  return conn.model('Organization', OrganizationSchema, 'organizations')
}
