package schema

import (
	"time"

	"entgo.io/ent"
	"entgo.io/ent/schema/edge"
	"entgo.io/ent/schema/field"
)

// Post defines social feed content.
type Post struct {
	ent.Schema
}

// Fields of Post.
func (Post) Fields() []ent.Field {
	return []ent.Field{
		field.String("id").NotEmpty().Immutable(),
		field.String("author_id").NotEmpty(),
		field.Text("content").NotEmpty(),
		field.Int("like_count").Default(0),
		field.Int("reply_count").Default(0),
		field.Int("share_count").Default(0),
		field.Time("created_at").Default(time.Now).Immutable(),
	}
}

// Edges of Post.
func (Post) Edges() []ent.Edge {
	return []ent.Edge{
		edge.To("replies", Reply.Type),
		edge.To("likes", Like.Type),
		edge.From("author", User.Type).Ref("posts").Field("author_id").Unique().Required(),
	}
}
