const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const PostSchema = require('./post');

const UserSchema = new Schema({
	name: {
		type: String,
		validate: {
			validator: (name) => name.length > 2  ,
			message: 'Name should be at least 3 characters.'
		},
		required: [true, 'Name is required.']
	},
	posts: [PostSchema],
	likes: Number,
	blogPosts: [{
		type: Schema.Types.ObjectId,
		ref: 'blogPost'
	}]
});

UserSchema.virtual('postCount').get(function(){
	return this.posts.length;
});

UserSchema.pre('remove', function(next) {
	//this === joe
	// instead of using BlogPost.remove... directly use direct ref mongoose.model(blogPost) 
	// to avoid cyclic requires
	const BlogPost = mongoose.model('blogPost');
	// don't this.blogPosts.each(id => ...)
	BlogPost.remove({ _id: { $in: this.blogPosts }})
	.then(() => next());
});

const User = mongoose.model('user', UserSchema);

module.exports = User;