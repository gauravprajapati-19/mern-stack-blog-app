const Post = require("../models/postModel");
const User = require("../models/userModel");
const path = require("path");
const fs = require("fs");
const { v4: uuid } = require("uuid");
const HttpError = require("../models/errorModel");

// =========================== Create a Post ===========================
// Post : api/posts
// Protected

const createPost = async (req, res, next) => {
    try {
        let { title, category, description } = req.body;
        if (!title || !category || !description || !req.files) {
            return next(new HttpError("Fill in all fields and choose thumbnail.", 422));
        }

        const { thumbnail } = req.files;
        // check the file size
        if (thumbnail.size > 2000000) {
            return next(new HttpError("Thumbnail is too big. File should be less than 2mb."));
        }

        let fileName = thumbnail.name;
        let splittedFilename = fileName.split(".");
        let newFilename = splittedFilename[0] + uuid() + "." + splittedFilename[splittedFilename.length - 1];
        thumbnail.mv(path.join(__dirname, "..", "/uploads", newFilename), async (err) => {
            if (err) {
                return next(new HttpError(err));
            } else {
                const newPost = await Post.create({ title, category, description, thumbnail: newFilename, creator: req.user.id });
                if (!newPost) {
                    return next(new HttpError("Post couldn't be created.", 422));
                }
                // Find user and increate post count by 1
                const currentUser = await User.findById(req.user.id);
                const userPostCount = currentUser.posts + 1;
                await User.findByIdAndUpdate(req.user.id, { posts: userPostCount });

                res.status(201).json(newPost);
            }
        });
    } catch (error) {
        return next(new HttpError(error));
    }
};

// =========================== Get All Posts ===========================
// Get : api/posts
// Unprotected

const getPosts = async (req, res, next) => {
    try {
        const posts = await Post.find().sort({ updatedAt: -1 });
        res.status(200).json(posts);
    } catch (error) {
        return next(new HttpError(error));
    }
};

// =========================== Get Single Post ===========================
// Get : api/posts/:id
// Unprotected

const getPost = async (req, res, next) => {
    try {
        const postId = req.params.id;
        const post = await Post.findById(postId);
        if (!post) {
            return next(new HttpError("Post not found.", 404));
        }
        res.status(200).json(post);
    } catch (error) {
        return next(new HttpError("Post not found.", 404));
    }
};

// =========================== Get Posts by Categories ===========================
// Get : api/posts/categories/:category
// Unprotected

const getCatPosts = async (req, res, next) => {
    try {
        const { category } = req.params;
        const catPosts = await Post.find({ category }).sort({ createdAt: -1 });
        res.status(200).json(catPosts);
    } catch (error) {
        return next(new HttpError(error));
    }
};

// =========================== Get User / Author Post ===========================
// Get : api/posts/users/:id
// Unprotected

const getUserPosts = async (req, res, next) => {
    try {
        const { id } = req.params;
        const posts = await Post.find({ creator: id }).sort({ createdAt: -1 });
        res.status(200).json(posts);
    } catch (error) {
        return next(new HttpError(error));
    }
};

// =========================== Edit Post ===========================
// Patch : api/posts/:id
// Protected

const editPost = async (req, res, next) => {
    try {
        let fileName;
        let newFilename;
        let updatedPost;
        const postId = req.params.id;
        let { title, category, description } = req.body;

        if (!title || !category || description.length < 12) {
            return next(new HttpError("Fill in all fields.", 422));
        }

        const oldPost = await Post.findById(postId);
        if (req.user.id == oldPost.creator) {
            if (!req.files) {
                updatedPost = await Post.findByIdAndUpdate(postId, { title, category, description }, { new: true });
            } else {
                // Get old post from DB
                // Delete old thumbnail from upload
                fs.unlink(path.join(__dirname, "..", "uploads", oldPost.thumbnail), async (err) => {
                    if (err) {
                        return next(new HttpError(err));
                    }
                });

                // Upload new thumbnail
                const { thumbnail } = req.files;
                // Check file size
                if (thumbnail.size > 2000000) {
                    return next(new HttpError("Thumbnail too big. Should be less than 2BM."));
                }
                fileName = thumbnail.name;
                let splittedFilename = fileName.split(".");
                newFilename = splittedFilename[0] + uuid() + "." + splittedFilename[splittedFilename.length - 1];
                thumbnail.mv(path.join(__dirname, "..", "uploads", newFilename), async (err) => {
                    if (err) {
                        return next(new HttpError(err));
                    }
                });

                updatedPost = await Post.findByIdAndUpdate(postId, { title, category, description, thumbnail: newFilename }, { new: true });
            }
        }
        if (!updatedPost) {
            return next(new HttpError("Couldn't update post.", 404));
        }

        res.status(200).json(updatedPost);
    } catch (error) {
        return next(new HttpError(error));
    }
};

// =========================== Delete Post ===========================
// Delete : api/posts/:id
// Protected

const deletePost = async (req, res, next) => {
    try {
        const postId = req.params.id;
        if (!postId) {
            return next(new HttpError("Post unavailable.", 400));
        }
        const post = await Post.findById(postId);
        const fileName = post?.thumbnail;

        if (req.user.id == post.creator) {
            // Delete thumbnail from uploads folder
            fs.unlink(path.join(__dirname, "..", "uploads", fileName), async (err) => {
                if (err) {
                    return next(new HttpError(err));
                } else {
                    await Post.findByIdAndDelete(postId);
                    // Find user and reduce post cound by 1
                    const currentUser = await User.findById(req.user.id);
                    const userPostCount = currentUser?.posts - 1;
                    await User.findByIdAndUpdate(req.user.id, { posts: userPostCount });
                }
            });
        } else {
            return next(new HttpError("Post couldn't be deleted.", 403));
        }
        res.json(`Post ${postId} deleted successfully.`);
    } catch (error) {
        return next(new HttpError(err));
    }
};

module.exports = { createPost, getPosts, getPost, getCatPosts, getUserPosts, editPost, deletePost };
