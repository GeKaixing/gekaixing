package schema

import (
	"entgo.io/ent"
	"entgo.io/ent/schema/edge"
	"entgo.io/ent/schema/field"
	"entgo.io/ent/schema/index"
)

// User defines user entity. user.id is global identity shared with Auth.js JWT sub.
type User struct {
	ent.Schema
}

// Fields of User.
func (User) Fields() []ent.Field {
	return []ent.Field{
		field.String("id").NotEmpty().Immutable(),
		field.String("username").NotEmpty().Unique(),
		field.String("display_name").Default(""),
		field.String("email").Optional().Nillable(),
		field.String("avatar_url").Optional().Nillable(),
	}
}

// Indexes of User.
func (User) Indexes() []ent.Index {
	return []ent.Index{
		index.Fields("email"),
	}
}

// Edges of User.
func (User) Edges() []ent.Edge {
	return []ent.Edge{
		edge.To("posts", Post.Type),
		edge.To("replies", Reply.Type),
		edge.To("likes", Like.Type),
		edge.To("sent_messages", Message.Type),
		edge.To("received_messages", Message.Type),
	}
}
