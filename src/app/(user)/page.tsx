import { Box } from "@mui/material";
import Post from "@/components/post/main";

import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";
import { sendRequest } from "@/utils/api";

const HomePage = async () => {
  const session = await getServerSession(authOptions);
  console.log("check session", session);
  return (
    <Box flex={4} p={2}>
      <Post session={session} />
    </Box>
  );
};

export default HomePage;
