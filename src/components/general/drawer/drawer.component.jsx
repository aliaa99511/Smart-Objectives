import { SwipeableDrawer } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import {
  closeDrawer,
  selectDrawer,
} from "../../../appState/slices/drawerSlice";
import { lazy, Suspense } from "react";
import MainLoader from "../mainLoader/mainLoader.component";

// Use lazy to create dynamically loaded components
const EditSmartObjective = lazy(() =>
  import("../../editSmartObjective/editSmartObjective.component")
);
const EditProgressSmartObjective = lazy(() =>
  import(
    "../../editProgressSmartObjective/editProgressSmartObjective.component"
  )
);
const SmartObjectiveDetails = lazy(() =>
  import(
    "../../smartObjectiveDetails/smartObjectiveDetails/smartObjectiveDetails.component"
  )
);
const ActivetiesLog = lazy(() =>
  import("../../activetiesLog/activetiesLog/activetiesLog.component")
);
const CertficatesLog = lazy(() =>
  import("../certficatesLog/certficatesLog.component")
);

// Loading fallback component
const LoadingFallback = () => <MainLoader />;

const Drawer = () => {
  const { drawerShow, drawerData, drawerType } = useSelector(selectDrawer);
  const dispatch = useDispatch();

  const handleClose = () => {
    dispatch(closeDrawer());
  };

  // Add this handler for the onOpen prop
  const handleOpen = () => {
    // This function is required by SwipeableDrawer but we don't need to do anything
    // since opening is handled by our Redux state
  };

  // Render the appropriate component based on drawerType
  const renderComponent = () => {
    switch (drawerType) {
      case "editSO":
        return <EditSmartObjective drawerData={drawerData} />;
      case "editProgressSO":
        return <EditProgressSmartObjective drawerData={drawerData} />;
      case "detailsSO":
        return <SmartObjectiveDetails drawerData={drawerData} />;
      case "activeties":
        return <ActivetiesLog drawerData={drawerData} />;
      case "certficatesLog":
        return <CertficatesLog drawerData={drawerData} />;
      default:
        return null;
    }
  };

  return (
    <SwipeableDrawer
      anchor="right"
      open={drawerShow}
      onClose={handleClose}
      onOpen={handleOpen}
      PaperProps={{ sx: { width: "50vw", padding: "20px" } }}
    >
      <Suspense fallback={<LoadingFallback />}>{renderComponent()}</Suspense>
    </SwipeableDrawer>
  );
};

export default Drawer;
