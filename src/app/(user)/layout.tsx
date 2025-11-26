import AppFooter from "@/components/footer/app.footer";
import AppHeader from "@/components/header/app.header";
import Sidebar from "./sidebar/page";
import { Stack } from "@mui/material";
import Rightbar from "./rightbar/page";
import NPprogressWrapper from "@/lib/npprogress.wrapper";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <NPprogressWrapper>
        <AppHeader />
        <Stack direction="row" spacing={2} justifyContent="space-between">
          <Sidebar />
          {children}
          <Rightbar />
        </Stack>
      </NPprogressWrapper>
    </>
  );
}
