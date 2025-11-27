import { Box } from "@mui/material";
import Post from "@/components/post/main";

import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";
import { sendRequest } from "@/utils/api";
import PostForm from "@/components/post/createPost";

const HomePage = async () => {
  const session = await getServerSession(authOptions);
  // const res = await sendRequest<IBackendRes<IModelPaginate<IPost>>>({
  //   url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/posts`,
  //   method: "GET",
  //   queryParams: { current: 1, pageSize: 100, sort: "-createdAt" },
  //   headers: { Authorization: `Bearer ${session?.access_token}` },
  //   nextOption: {
  //     // cache: "no-store",
  //     next: { tags: ["fetch-posts"] },
  //   },
  // });
  // console.log("check session", session);
  // await new Promise((resolve) => setTimeout(resolve, 1000));
  // const posts = res.data?.result ?? [];
  return (
    <Box flex={4} p={6} sx={{ marginTop: "-25px", marginLeft: "20px" }}>
      <PostForm />
      <Post session={session} />
    </Box>
  );
};

export default HomePage;
