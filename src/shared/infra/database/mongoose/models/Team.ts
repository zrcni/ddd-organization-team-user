import { Schema, Connection } from 'mongoose'
const ObjectId = Schema.Types.ObjectId

export default (conn: Connection, callback: (schema: Schema) => void) => {
  const TeamMemberSchema = new Schema(
    {
      userId: {
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

  const TeamSchema = new Schema(
    {
      name: String,
      organizationId: {
        type: ObjectId,
        ref: 'Organization',
        required: true,
      },
      members: [TeamMemberSchema],
      isDeleted: Boolean,
    },
    { timestamps: true },
  )

  // The callback is used to add hooks.
  // Hooks must be added before the model is created.
  if (callback) callback(TeamSchema)

  return conn.model('Team', TeamSchema, 'teams')
}
