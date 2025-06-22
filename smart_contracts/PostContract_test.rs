#![cfg(test)]

use super::*;
use soroban_sdk::{Address, Env, Symbol};

#[test]
fn test_create_post() {
    let env = Env::default();
    let author = Address::generate(&env);
    
    let post = PostContract::create_post(
        &env,
        author.clone(),
        symbol_short!("Hello, this is my first anonymous post!"),
        vec![&env, symbol_short!("general"), symbol_short!("introduction")]
    );
    
    assert_eq!(post.author, author);
    assert_eq!(post.content, symbol_short!("Hello, this is my first anonymous post!"));
    assert_eq!(post.likes, 0);
    assert_eq!(post.comments, 0);
    assert_eq!(post.tags.len(), 2);
    assert!(!post.anonymous);
}

#[test]
fn test_create_anonymous_post() {
    let env = Env::default();
    let author = Address::generate(&env);
    
    let post = PostContract::create_anonymous_post(
        &env,
        author.clone(),
        symbol_short!("This is an anonymous post about blockchain technology"),
        vec![&env, symbol_short!("blockchain"), symbol_short!("technology")]
    );
    
    assert_eq!(post.author, author);
    assert_eq!(post.content, symbol_short!("This is an anonymous post about blockchain technology"));
    assert!(post.anonymous);
    assert_eq!(post.tags.len(), 2);
}

#[test]
fn test_get_post() {
    let env = Env::default();
    let author = Address::generate(&env);
    
    let created_post = PostContract::create_post(
        &env,
        author.clone(),
        symbol_short!("Test post content"),
        vec![&env, symbol_short!("test")]
    );
    
    let retrieved_post = PostContract::get_post(&env, created_post.id).unwrap();
    
    assert_eq!(retrieved_post.id, created_post.id);
    assert_eq!(retrieved_post.author, created_post.author);
    assert_eq!(retrieved_post.content, created_post.content);
    assert_eq!(retrieved_post.likes, created_post.likes);
    assert_eq!(retrieved_post.comments, created_post.comments);
}

#[test]
fn test_get_nonexistent_post() {
    let env = Env::default();
    
    let post = PostContract::get_post(&env, 999);
    assert!(post.is_none());
}

#[test]
fn test_like_post() {
    let env = Env::default();
    let author = Address::generate(&env);
    let liker = Address::generate(&env);
    
    let post = PostContract::create_post(
        &env,
        author.clone(),
        symbol_short!("Post to like"),
        vec![&env, symbol_short!("test")]
    );
    
    assert_eq!(post.likes, 0);
    
    let liked_post = PostContract::like_post(&env, post.id, liker.clone());
    assert_eq!(liked_post.likes, 1);
    
    // Like again (should increment)
    let liked_post_again = PostContract::like_post(&env, post.id, liker.clone());
    assert_eq!(liked_post_again.likes, 2);
}

#[test]
fn test_unlike_post() {
    let env = Env::default();
    let author = Address::generate(&env);
    let liker = Address::generate(&env);
    
    let post = PostContract::create_post(
        &env,
        author.clone(),
        symbol_short!("Post to unlike"),
        vec![&env, symbol_short!("test")]
    );
    
    // Like the post first
    PostContract::like_post(&env, post.id, liker.clone());
    
    // Unlike the post
    let unliked_post = PostContract::unlike_post(&env, post.id, liker.clone());
    assert_eq!(unliked_post.likes, 0);
}

#[test]
fn test_add_comment() {
    let env = Env::default();
    let author = Address::generate(&env);
    let commenter = Address::generate(&env);
    
    let post = PostContract::create_post(
        &env,
        author.clone(),
        symbol_short!("Post with comments"),
        vec![&env, symbol_short!("test")]
    );
    
    assert_eq!(post.comments, 0);
    
    let comment = PostContract::add_comment(
        &env,
        post.id,
        commenter.clone(),
        symbol_short!("Great post!"),
        false
    );
    
    assert_eq!(comment.post_id, post.id);
    assert_eq!(comment.author, commenter);
    assert_eq!(comment.content, symbol_short!("Great post!"));
    assert!(!comment.anonymous);
    
    // Check that post comment count increased
    let updated_post = PostContract::get_post(&env, post.id).unwrap();
    assert_eq!(updated_post.comments, 1);
}

#[test]
fn test_add_anonymous_comment() {
    let env = Env::default();
    let author = Address::generate(&env);
    let commenter = Address::generate(&env);
    
    let post = PostContract::create_post(
        &env,
        author.clone(),
        symbol_short!("Post for anonymous comment"),
        vec![&env, symbol_short!("test")]
    );
    
    let comment = PostContract::add_comment(
        &env,
        post.id,
        commenter.clone(),
        symbol_short!("Anonymous comment"),
        true
    );
    
    assert!(comment.anonymous);
    assert_eq!(comment.content, symbol_short!("Anonymous comment"));
}

#[test]
fn test_get_post_comments() {
    let env = Env::default();
    let author = Address::generate(&env);
    let commenter1 = Address::generate(&env);
    let commenter2 = Address::generate(&env);
    
    let post = PostContract::create_post(
        &env,
        author.clone(),
        symbol_short!("Post with multiple comments"),
        vec![&env, symbol_short!("test")]
    );
    
    PostContract::add_comment(&env, post.id, commenter1.clone(), symbol_short!("First comment"), false);
    PostContract::add_comment(&env, post.id, commenter2.clone(), symbol_short!("Second comment"), false);
    
    let comments = PostContract::get_post_comments(&env, post.id);
    assert_eq!(comments.len(), 2);
    
    assert_eq!(comments[0].content, symbol_short!("First comment"));
    assert_eq!(comments[1].content, symbol_short!("Second comment"));
}

#[test]
fn test_search_posts() {
    let env = Env::default();
    let author1 = Address::generate(&env);
    let author2 = Address::generate(&env);
    
    PostContract::create_post(
        &env,
        author1.clone(),
        symbol_short!("Post about blockchain technology"),
        vec![&env, symbol_short!("blockchain"), symbol_short!("technology")]
    );
    
    PostContract::create_post(
        &env,
        author2.clone(),
        symbol_short!("Post about cooking recipes"),
        vec![&env, symbol_short!("cooking"), symbol_short!("recipes")]
    );
    
    PostContract::create_post(
        &env,
        author1.clone(),
        symbol_short!("Another post about blockchain"),
        vec![&env, symbol_short!("blockchain"), symbol_short!("crypto")]
    );
    
    // Search for blockchain posts
    let blockchain_posts = PostContract::search_posts(&env, symbol_short!("blockchain"));
    assert_eq!(blockchain_posts.len(), 2);
    
    // Search for cooking posts
    let cooking_posts = PostContract::search_posts(&env, symbol_short!("cooking"));
    assert_eq!(cooking_posts.len(), 1);
}

#[test]
fn test_get_user_posts() {
    let env = Env::default();
    let author = Address::generate(&env);
    
    PostContract::create_post(
        &env,
        author.clone(),
        symbol_short!("First post"),
        vec![&env, symbol_short!("first")]
    );
    
    PostContract::create_post(
        &env,
        author.clone(),
        symbol_short!("Second post"),
        vec![&env, symbol_short!("second")]
    );
    
    PostContract::create_post(
        &env,
        author.clone(),
        symbol_short!("Third post"),
        vec![&env, symbol_short!("third")]
    );
    
    let user_posts = PostContract::get_user_posts(&env, author.clone());
    assert_eq!(user_posts.len(), 3);
    
    // Verify all posts belong to the same author
    for post in user_posts.iter() {
        assert_eq!(post.author, author);
    }
}

#[test]
fn test_delete_post() {
    let env = Env::default();
    let author = Address::generate(&env);
    
    let post = PostContract::create_post(
        &env,
        author.clone(),
        symbol_short!("Post to delete"),
        vec![&env, symbol_short!("test")]
    );
    
    // Verify post exists
    assert!(PostContract::get_post(&env, post.id).is_some());
    
    // Delete post
    PostContract::delete_post(&env, post.id, author.clone());
    
    // Verify post is deleted
    assert!(PostContract::get_post(&env, post.id).is_none());
}

#[test]
fn test_get_all_posts() {
    let env = Env::default();
    let author1 = Address::generate(&env);
    let author2 = Address::generate(&env);
    
    PostContract::create_post(
        &env,
        author1.clone(),
        symbol_short!("Post 1"),
        vec![&env, symbol_short!("test")]
    );
    
    PostContract::create_post(
        &env,
        author2.clone(),
        symbol_short!("Post 2"),
        vec![&env, symbol_short!("test")]
    );
    
    let all_posts = PostContract::get_all_posts(&env);
    assert_eq!(all_posts.len(), 2);
} 