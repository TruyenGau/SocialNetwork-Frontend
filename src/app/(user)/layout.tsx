import AppFooter from "@/components/footer/app.footer";
import AppHeader from "@/components/header/app.header";
import { Box, Stack } from "@mui/material";
import Rightbar from "../../components/rightbar/rightbar";
import NPprogressWrapper from "@/lib/npprogress.wrapper";
import Sidebar from "@/components/sidebar/sidebar";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <AppHeader />
      <Stack
        direction="row"
        spacing={2}
        justifyContent="space-between"
        sx={{ mt: 4, px: 2 }}
      >
        {/* LEFT: SIDEBAR 20% */}
        <Box sx={{ flexBasis: "20%", flexShrink: 0 }}>
          <Sidebar />
        </Box>

        {/* CENTER: NỘI DUNG POST 60% */}
        <Box sx={{ flexBasis: "50%" }}>{children}</Box>

        {/* RIGHT: RIGHTBAR 20% */}
        <Box sx={{ flexBasis: "30%", flexShrink: 0 }}>
          <Rightbar />
        </Box>
      </Stack>
    </>
  );
}
