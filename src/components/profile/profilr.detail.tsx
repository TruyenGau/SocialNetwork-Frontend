"use client";

import { FC, useEffect, useState } from "react";
import { Avatar, Box, Typography, Divider, Grid, Paper } from "@mui/material";


interface ProfileDetailProps {
    userId: string;
}

interface Post {
    _id: string;
    content: string;
    images?: string[];
    videos?: string[];
}

const ProfileDetail: FC<ProfileDetailProps> = ({ userId }) => {
    const [user, setUser] = useState<any>(null);
    const [posts, setPosts] = useState<Post[]>([]);

    useEffect(() => {
        console.log("ProfileDetail mounted, userId:", userId);
        if (!userId) return;

        const fetchProfile = async () => {
            try {
                const res = await fetch(
                    `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/users/${userId}`
                );
                const data = await res.json();
                setUser(data.data);
            } catch (err) {
                console.error(err);
            }
        };

        const fetchPosts = async () => {
            try {
                const res = await fetch(
                    `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/posts/user/${userId}`,
                    {
                        method: "GET",
                        credentials: "include", // ✅ gửi cookie đi kèm
                    }
                );

                if (!res.ok) {
                    console.error("fetchPosts failed:", res.status, res.statusText);
                    return;
                }

                const json = await res.json();
                console.log("Fetched posts:", json.data);
                setPosts(json.data || []);
                console.log("Number of posts:", (json.data || []).length);
            } catch (err) {
                console.error("fetchPosts error:", err);
            }
        };



        fetchProfile();
        fetchPosts();
    }, [userId]);

    if (!user) return <p>Loading...</p>;

    return (
        <Box sx={{ maxWidth: 600, mx: "auto", mt: 4, px: 2 }}>
            {/* COVER */}
            <Box
                sx={{
                    height: 220,
                    width: "100%",
                    borderRadius: 2,
                    overflow: "hidden",
                    position: "relative",
                }}
            >
                <img
                    src={
                        user.coverUrl
                            ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/post/images/${user.coverUrl}`
                            : '/default-cover.jpg'
                    }
                    alt="Cover"
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
                {/* AVATAR */}
                <Avatar
                    src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/post/images/${user.avatarUrl}`}
                    sx={{
                        width: 128,
                        height: 128,
                        border: "4px solid white",
                        position: "absolute",
                        bottom: -64,
                        left: "50%",
                        transform: "translateX(-50%)",
                    }}
                />
            </Box>

            {/* NAME & STATS */}
            <Box sx={{ mt: 8, textAlign: "center" }}>
                <Typography variant="h5" fontWeight="bold">
                    {user.name && user.surname
                        ? `${user.name} ${user.surname}`
                        : user.username}
                </Typography>
                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "center",
                        gap: 6,
                        mt: 2,
                    }}
                >
                    <Box sx={{ textAlign: "center" }}>
                        <Typography fontWeight="bold">{posts.length}</Typography>
                        <Typography variant="body2" color="text.secondary">
                            Posts
                        </Typography>
                    </Box>
                    <Box sx={{ textAlign: "center" }}>
                        <Typography fontWeight="bold">
                            {user._count?.followers || 0}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            Followers
                        </Typography>
                    </Box>
                    <Box sx={{ textAlign: "center" }}>
                        <Typography fontWeight="bold">
                            {user._count?.followings || 0}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            Following
                        </Typography>
                    </Box>
                </Box>
            </Box>

            <Divider sx={{ my: 4 }} />

            {/* POSTS */}
            <Box sx={{ mt: 2 }}>
                <Typography variant="h6" fontWeight="bold" mb={2}>
                    Bài viết của bạn ({posts.length})
                </Typography>
                <Grid container spacing={2}>
                    {posts.length ? (
                        posts.map((post) => (
                            <Grid item xs={12} key={post._id}>
                                <Paper sx={{ p: 2, borderRadius: 2 }}>
                                    <Typography mt={0.5}>{post.content}</Typography>
                                    {post.images && post.images.length > 0 && (
                                        <Box mt={1}>
                                            {post.images.map((img, idx) => (
                                                <img
                                                    key={idx}
                                                    src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/post/images/${img}`}
                                                    alt={`Post image ${idx}`}
                                                    style={{ maxWidth: "100%", borderRadius: 8, marginTop: 4 }}
                                                />
                                            ))}
                                        </Box>
                                    )}
                                    {post.videos && post.videos.length > 0 && (
                                        <Box mt={1}>
                                            {post.videos.map((video, idx) => (
                                                <video
                                                    key={idx}
                                                    src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/post/videos/${video}`}
                                                    controls
                                                    style={{ maxWidth: "100%", borderRadius: 8, marginTop: 4 }}
                                                />
                                            ))}
                                        </Box>
                                    )}
                                </Paper>
                            </Grid>
                        ))
                    ) : (
                        <Typography ml={1}>Bạn chưa có bài viết nào.</Typography>
                    )}
                </Grid>
            </Box>
        </Box>
    );
};

export default ProfileDetail;
