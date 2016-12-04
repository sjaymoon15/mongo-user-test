const mongoose = require('mongoose');
const assert = require('assert');
const User = require('../src/user');
const Comment = require('../src/comments');
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

		Promise.all([joe.save(), blogPost.save(), comment.save()])
		.then(() => done())
	});

	it('saves a relation between a user and a blogpost', (done) => {
		User.findOne({ name: 'Joe' })
		.populate('blogPosts')
		.then((user) => {
			assert(user.blogPosts[0].title === 'JS is good');
			done();
		});
	});

	it('saves a full relation graph', (done) => {
		User.findOne( { name: 'Joe' })
		.populate({
			path: 'blogPosts',
			populate: {
				path: 'comments',
				model: 'comment',
				populate: {
					path: 'user',
					model: 'user'
				}
			}
		})
		.then((user) => {
			assert(user.name === 'Joe');
			assert(user.blogPosts[0].title === 'JS is good');
			assert(user.blogPosts[0].comments[0].content === 'Congrats comment');
			assert(user.blogPosts[0].comments[0].user.name === 'Joe');
			done();
		});
	});
});