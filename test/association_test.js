const mongoose = require('mongoose');
const User = require('../src/user');
const Comment = require('../src/comment');
const BlogPost = require('../src/blogPost');

describe('Associations', () => {
	let joe, blogPost, comment;
	beforeEach((done) => {
		joe = new User({ name: 'Joe'});
		blogPost = new BlogPost({ title: 'JS is good', content: 'this is content'});
		comment = new Comment({ content: 'Congrats comment'});
		
		//pushing model and mongoose takes care of it and make ref to objectId
		joe.blogPosts.push(blogPost);
		blogPost.comments.push(comment);
		//assign joe ref (not the entire joe this)
		comment.user = joe;
	});
});