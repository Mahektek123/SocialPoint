"use client";

import React, { useEffect, useState } from "react";
import "@/app/page.module.css";
import Navbar from "./component/Navbar";
import DP from "./Images/temp.png";
import Like from "./Images/like.png";
import NotLike from "./Images/notLiked.png";

interface Post {
  _id: string;
  PP: string;
  name: string;
  Image: string;
  Caption: string;
  likes: string[]; // Contains user IDs who liked the post
}

const Page = () => {
  const [PP, setPP] = useState<string>();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [posts, setPosts] = useState<Post[]>([]);
  const [UID, setUID] = useState<string | null | undefined>(null);

  useEffect(() => {
    const userName = sessionStorage.getItem("UserName");
    if (userName) {
      setIsLoggedIn(true);
      displayImages();
    } else {
      window.location.href = "/Login";
    }
  }, []);

  const displayImages = async () => {
    const user = sessionStorage.getItem("UserName");
    const data = { UserName: user };

    const response = await fetch(`http://localhost:3000/ImgBack`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const rData = await response.json();
    if (rData.Posts.PP) {
      setPP(rData.Posts.PP);
    }

    const newArr = shuffleArray(rData.Posts);
    setPosts(newArr);
    setUID(sessionStorage.getItem("UID"));
  };

  const shuffleArray = (array: any[]) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  };

  const toggleLike = async (postId: string, isLiked: boolean) => {
    const name = sessionStorage.getItem("UserName");
    const endpoint = isLiked
      ? "http://localhost:3000/DisLikePost"
      : "http://localhost:3000/likePost";

    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, post_id: postId }),
    });

    const rData = await response.json();
    if (rData.message === "Liked" || rData.message === "DisLiked") {
      // Update the local state
      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post._id === postId
            ? {
                ...post,
                likes: isLiked
                  ? post.likes.filter((id) => id !== UID) // Remove like
                  : [...post.likes, UID!], // Add like
              }
            : post
        )
      );
    }
  };

  return isLoggedIn ? (
    <>
      <Navbar />
      <form id="frm1">
        <div className="container d-flex justify-content-around flex-column">
          <div id="dropArea" className="drop-area">
            <p>Upload Your Images Here</p>
            <input
              className="form-control w-70"
              type="file"
              id="img2"
              name="image"
              accept="image/*"
              required
            />
            <p className="text-danger">* Image must be under 100KB</p>
          </div>
          <div className="form-group caption-area">
            <label htmlFor="caption">Caption: </label>
            <input type="text" className="form-control w-10" id="caption" />
          </div>
        </div>
        <center>
          <button type="submit" className="btn btn-primary">
            Post
          </button>
        </center>
        <br />
      </form>

      <div className="d-flex flex-column align-items-center" id="fetchedData">
        {posts.length > 0 ? (
          posts.map((post, index) => (
            <div key={post._id} className="post-item">
              <div className="container">
                <center>
                  <div className="card mb-3">
                    <div className="card-header d-flex align-items-center bg-gray">
                      <img
                        src={post.PP || DP.src}
                        alt="Profile Picture"
                        className="rounded-circle mr-2"
                        style={{ width: "50px", height: "50px" }}
                      />
                      <span className="font-weight-bold">
                        &nbsp;{post.name}
                      </span>
                    </div>
                    <center>
                      <img
                        className="w-50 card-img-top"
                        src={post.Image}
                        alt="Post Image"
                      />
                    </center>
                    <div className="d-flex">
                      {UID && post.likes.includes(UID) ? (
                        <div><img
                          src={Like.src}
                          style={{
                            width: "50px",
                            margin: "8px 20px 8px 20px",
                          }}
                          alt="Liked"
                          onClick={() => toggleLike(post._id, true)} /><br/><p>{post.likes.length}</p></div>
                      ) : (
                        <div>
                        <img
                          src={NotLike.src}
                          style={{
                            width: "40px",
                            height: "40px",
                            margin: "10px 20px 10px 20px",
                          }}
                          alt="NotLiked"
                          onClick={() => toggleLike(post._id, false)}
                        /><br/><p>{post.likes.length}</p></div>
                      )}

                      <span
                        className="material-symbols-outlined"
                        style={{
                          fontSize: "45px",
                          margin: "7px 20px 7px 20px",
                        }}
                      >
                        <a
                          style={{ color: "black", textDecoration: "none" }}
                          href={post.Image}
                          download={`${post.name}-${index}.jpg`}
                        >
                          download
                        </a>
                      </span>
                    </div>
                    <div className="card-header bg-gray">
                      <p>{post.Caption}</p>
                    </div>
                  </div>
                </center>
              </div>
            </div>
          ))
        ) : (
          <p>No posts available.</p>
        )}
      </div>
    </>
  ) : null;
};

export default Page;
