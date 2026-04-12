package schema

import (
	"time"

	"entgo.io/ent"
	"entgo.io/ent/schema/edge"
	"entgo.io/ent/schema/field"
	"entgo.io/ent/schema/index"
)

// Like prevents duplicate likes via compound unique index.
type Like struct {
	ent.Schema
}

// Fields of Like.
func (Like) Fields() []ent.Field {
	return []ent.Field{
		field.String("id").NotEmpty().Immutable(),
		field.String("post_id").NotEmpty(),
		field.String("user_id").NotEmpty(),
		field.Time("created_at").Default(time.Now).Immutable(),
	}
}

// Edges of Like.
func (Like) Edges() []ent.Edge {
	return []ent.Edge{
		edge.From("post", Post.Type).Ref("likes").Field("post_id").Unique().Required(),
		edge.From("user", User.Type).Ref("likes").Field("user_id").Unique().Required(),
	}
}

// Indexes of Like.
func (Like) Indexes() []ent.Index {
	return []ent.Index{
		index.Fields("post_id", "user_id").Unique(),
	}
}
