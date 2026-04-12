package schema

import (
	"time"

	"entgo.io/ent"
	"entgo.io/ent/schema/edge"
	"entgo.io/ent/schema/field"
)

// Message stores direct messages.
type Message struct {
	ent.Schema
}

// Fields of Message.
func (Message) Fields() []ent.Field {
	return []ent.Field{
		field.String("id").NotEmpty().Immutable(),
		field.String("sender_id").NotEmpty(),
		field.String("receiver_id").NotEmpty(),
		field.Text("content").NotEmpty(),
		field.Time("created_at").Default(time.Now).Immutable(),
	}
}

// Edges of Message.
func (Message) Edges() []ent.Edge {
	return []ent.Edge{
		edge.From("sender", User.Type).Ref("sent_messages").Field("sender_id").Unique().Required(),
		edge.From("receiver", User.Type).Ref("received_messages").Field("receiver_id").Unique().Required(),
	}
}
