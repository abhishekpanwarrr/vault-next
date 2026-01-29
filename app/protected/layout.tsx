import { FC, ReactNode } from "react";
import Footer from "@/components/footer";
import Navbar from "@/components/navbar";

interface Props {
  children: ReactNode;
}
const ProtectedLayout: FC<Props> = ({ children }) => {
  return (
    <main className="min-h-screen flex flex-col items-center">
      <div className="flex-1 w-full items-center">
        <Navbar />
        <div className="gap-10 px-10 flex-1 min-w-full">{children}</div>
        <Footer />
      </div>
    </main>
  );
};
export default ProtectedLayout;
