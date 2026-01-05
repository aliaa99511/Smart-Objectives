import { Outlet } from "react-router-dom";
import styles from "./rootLayout.module.css";
import SideBar from "../sideBar/sideBar.component";
const RootLayout = () => {
  return (
    //avoide shrink for layout when the page content height is less than the page height
    <div className="flex-col flex justify-start">
      <div className="min-h-screen">
        <div className={`${styles.pageWrapper}`}>
          <aside className={`${styles.aside}`}>
            <SideBar />
          </aside>
          <main className={`${styles.main}`}>
            <div className={`${styles.mainContent}`}>
              <div className={styles.wedgetContener}>
                <Outlet />
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default RootLayout;
