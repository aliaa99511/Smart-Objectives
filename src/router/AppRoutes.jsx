import { RouterProvider, Navigate, createHashRouter } from "react-router-dom";
import RootLayout from "@/components/layout/rootLayout/rootLayout.component";
import NotFound from "@/pages/notFound/notFound.page";
import Unauthorized from "@/pages/unauthorized/unauthorized.page";
import ServerError from "@/pages/serverError/serverError.page";
import MyObjectives from "../pages/myObjectives/myObjectives.page";
import QuartersLog from "../pages/quartersLog/quartersLog.page";
import Certificates from "../pages/certificates/certificates.page";
import MainLoader from "../components/general/mainLoader/mainLoader.component";
import WithPermission from "../helpers/customHooks/protectRoutes";
import { WithProtected } from "../helpers/customHooks/protectRoutes";
import CreateSmartObjective from "../pages/createSmartObjective/createSmartObjective.page";
import CreateSmartObjectiveByManager from "../pages/createSmartObjectiveByManager/createSmartObjectiveByManager.page";
import MyTeam from "../pages/myTeam/myTeam.page";
import MyCompany from "../pages/myCompany/myCompany.page";
import CurrentObjectives from "../pages/viewCurrentObjectivesWithManager/currentObjectives.page";
import CurrentObjectivesByDepartmentManager from "../pages/viewCurrentObjectivesWithDepartmentManager/currentObjectives.page";
import CurrentObjectivesByHr from "../pages/viewCurrentObjectivesWithHr/currentObjectives.page";
import Modal from "../components/general/modal/modal.component";
import Drawer from "../components/general/drawer/drawer.component";
import { useFetchCurrentUserQuery } from "../appState/apis/userApiSlice";
import QuarterLogWithManager from "../pages/quarterLogWithManager/quarterLogWithManager.page";
import QuarterLogWithHr from "../pages/quarterLogWithHr/quarterLogWithHr.page";
import CertificateWithManager from "../pages/certificateWithManager/certificateWithManager.component";
import CertificateWithHr from "../pages/certificateWithHr/certificateWithHr.component";
import MyDepartment from "../pages/myDepartment/myDepartment.page";
import QuarterLogWithDepartmentManager from "../pages/quarterLogWithDepartmentManager/quarterLogWithDepartmentManager.page";
import CertificateWithDepartmentManager from "../pages/certificateWithDepartmentManager/certificateWithDepartmentManager.component";
import CreateAchievementByManager from "../pages/createAchievementsByManager/createAchievementsByManager";
import AchievementsWithManager from "../pages/achievementsWithManager/achievementsWithManager";
import Achievements from "../pages/achievements/achievements";
import AchievementsWithDepartmentManager from "../pages/achievementsWithDepartmentManager/achievementsWithDepartmentManager";
import CreateAchievementByDepartmentManager from "../pages/createAchievementByDepartmentManager/createAchievementByDepartmentManager";
import AchievementsWithHr from "../pages/achievementsWithHr/achievementsWithHr";
import DashboardPage from "../pages/dashboard/dashboard.page";
import About from "../pages/about/about.page";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import RankingsPage from "../pages/rankings/rankings.page";
import { canAccessPage } from "../helpers/utilities/permissinUtilities/canAccessPage";

const RootRedirector = () => {
  const { data: userData, isLoading } = useFetchCurrentUserQuery();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && userData) {
      // Check if user is CEO
      const isCEO = userData?.roles?.includes("CEO");

      // Debug: Check if user can access myObjectives
      const canAccessMyObjectives = canAccessPage(userData, 'myObjectives');

      if (isCEO) {
        console.log('RootRedirector - Redirecting CEO to /ceo/dashboard');
        navigate("/ceo/dashboard", { replace: true });
      } else {
        if (canAccessMyObjectives) {
          navigate("/myObjectives", { replace: true });
        } else {
          // Check what pages the user can access
          // For debugging, let's see what happens with a different route
          navigate("/quartersLog", { replace: true });
        }
      }
    }
  }, [userData, isLoading, navigate]);

  // Show loader while determining redirect
  return isLoading ? <MainLoader /> : null;
};

const AppRoutes = () => {
  const { isLoading, error } = useFetchCurrentUserQuery();

  // Create a wrapper component that includes both the app routes and the modal/drawer
  const AppWithModals = () => {
    return (
      <>
        <RootLayout />
        <Modal />
        <Drawer />
      </>
    );
  };

  const router = createHashRouter([
    {
      path: "/",
      element: (
        <WithProtected>
          <AppWithModals />
        </WithProtected>
      ),
      children: [
        {
          index: true,
          element: <RootRedirector />,
        },
        // ADD THIS ROUTE - This is critical!
        {
          path: "myObjectives",
          element: (
            <WithPermission page="myObjectives">
              <MyObjectives />
            </WithPermission>
          ),
        },
        {
          path: "quartersLog",
          element: (
            <WithPermission page="quartersLog">
              <QuartersLog />
            </WithPermission>
          ),
        },
        {
          path: "certificates",
          element: (
            <WithPermission page="certificates">
              <Certificates />
            </WithPermission>
          ),
        },
        {
          path: "achievements",
          element: (
            <WithPermission page="achievements">
              <Achievements />
            </WithPermission>
          ),
        },
        {
          path: "about",
          element: (
            <WithPermission page="about">
              <About />
            </WithPermission>
          ),
        },
        {
          path: "createSmartObjective",
          element: (
            <WithPermission page="createSmartObjective">
              <CreateSmartObjective />
            </WithPermission>
          ),
        },
        {
          path: "myTeam",
          element: (
            <WithPermission page="myTeam">
              <MyTeam />
            </WithPermission>
          ),
        },
        {
          path: "myCompany",
          element: (
            <WithPermission page="myCompany">
              <MyCompany />
            </WithPermission>
          ),
        },
        {
          path: "myDepartment",
          element: (
            <WithPermission page="myDepartment">
              <MyDepartment />
            </WithPermission>
          ),
        },
        {
          path: "myTeam/createSmartObjectiveByManager",
          element: (
            <WithPermission page="createSmartObjectiveByManager">
              <CreateSmartObjectiveByManager />
            </WithPermission>
          ),
        },
        {
          path: "myTeam/createAchievementByManager",
          element: (
            <WithPermission page="createAchievementByManager">
              <CreateAchievementByManager />
            </WithPermission>
          ),
        },
        {
          path: "myTeam/currentObjectives",
          element: (
            <WithPermission page="currentObjectives">
              <CurrentObjectives />
            </WithPermission>
          ),
        },
        {
          path: "myTeam/certificateWithManager",
          element: (
            <WithPermission page="certificateWithManager">
              <CertificateWithManager />
            </WithPermission>
          ),
        },
        {
          path: "myTeam/achievementsWithManager",
          element: (
            <WithPermission page="achievementsWithManager">
              <AchievementsWithManager />
            </WithPermission>
          ),
        },
        {
          path: "myTeam/quarterLog",
          element: (
            <WithPermission page="quarterLogWithManager">
              <QuarterLogWithManager />
            </WithPermission>
          ),
        },
        {
          path: "myDepartment/currentObjectives",
          element: (
            <WithPermission page="currentObjectives">
              <CurrentObjectivesByDepartmentManager />
            </WithPermission>
          ),
        },
        {
          path: "myDepartment/createAchievementByDepartmentManager",
          element: (
            <WithPermission page="createAchievementByDepartmentManager">
              <CreateAchievementByDepartmentManager />
            </WithPermission>
          ),
        },
        {
          path: "myDepartment/quarterLog",
          element: (
            <WithPermission page="quarterLogWithDepartmentManager">
              <QuarterLogWithDepartmentManager />
            </WithPermission>
          ),
        },
        {
          path: "myDepartment/certificateWithDepartmentManager",
          element: (
            <WithPermission page="certificateWithDepartmentManager">
              <CertificateWithDepartmentManager />
            </WithPermission>
          ),
        },
        {
          path: "myDepartment/achievementsWithDepartmentManager",
          element: (
            <WithPermission page="achievementsWithDepartmentManager">
              <AchievementsWithDepartmentManager />
            </WithPermission>
          ),
        },
        {
          path: "myCompany/quarterLog",
          element: (
            <WithPermission page="quarterLogWithHr">
              <QuarterLogWithHr />
            </WithPermission>
          ),
        },
        {
          path: "myCompany/currentObjectives",
          element: (
            <WithPermission page="currentObjectives">
              <CurrentObjectivesByHr />
            </WithPermission>
          ),
        },
        {
          path: "myCompany/certificateWithHr",
          element: (
            <WithPermission page="certificateWithHr">
              <CertificateWithHr />
            </WithPermission>
          ),
        },
        {
          path: "myCompany/achievementsWithHr",
          element: (
            <WithPermission page="achievementsWithHr">
              <AchievementsWithHr />
            </WithPermission>
          ),
        },
        {
          path: "ceo/dashboard",
          element: (
            <WithPermission page="dashboard">
              <DashboardPage />
            </WithPermission>
          ),
        },
        {
          path: "rankings",
          element: (
            <WithPermission page="rankings">
              <RankingsPage />
            </WithPermission>
          ),
        },
      ],
    },
    {
      path: "/notFound",
      element: <NotFound />,
    },
    {
      path: "/unauthorized",
      element: (
        <WithPermission page="unauthorized">
          <Unauthorized />
        </WithPermission>
      ),
    },
    {
      path: "/serverError",
      element: (
        <WithProtected page="serverError">
          <ServerError />
        </WithProtected>
      ),
    },
    {
      path: "*",
      element: <Navigate to="/notFound" />,
    },
  ]);

  if (!error && isLoading) {
    return <MainLoader />;
  } else {
    return <RouterProvider router={router} />;
  }
};

export default AppRoutes;

