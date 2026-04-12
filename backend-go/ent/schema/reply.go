package schema

import (
	"time"

	"entgo.io/ent"
	"entgo.io/ent/schema/edge"
	"entgo.io/ent/schema/field"
)

// Reply defines post replies.
type Reply struct {
	ent.Schema
}

// Fields of Reply.
func (Reply) Fields() []ent.Field {
	return []ent.Field{
		field.String("id").NotEmpty().Immutable(),
		field.String("post_id").NotEmpty(),
		field.String("author_id").NotEmpty(),
		field.Text("content").NotEmpty(),
		field.Time("created_at").Default(time.Now).Immutable(),
	}
}

// Edges of Reply.
func (Reply) Edges() []ent.Edge {
	return []ent.Edge{
		edge.From("post", Post.Type).Ref("replies").Field("post_id").Unique().Required(),
		edge.From("author", User.Type).Ref("replies").Field("author_id").Unique().Required(),
	}
}
