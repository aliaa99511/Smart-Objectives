import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { canAccessPage } from "../utilities/permissinUtilities/canAccessPage";
import { isUserAuthrized } from "../utilities/permissinUtilities/isUserAuthrized";
import { useFetchCurrentUserQuery } from "../../appState/apis/userApiSlice";

//heiger order function to protect UN-public pages like root layout which includes all the pages
export function WithProtected({ page = "root", children }) {
  const { data: userData, isLoading, error } = useFetchCurrentUserQuery();

  const navigate = useNavigate();

  useEffect(() => {
    if (isLoading) return; // avoid firing redirect too early

    if (!userData && error && page != "serverError") {
      navigate("/serverError", { replace: true });
    } else if (userData && !error && page == "serverError") {
      navigate("/", { replace: true });
    } else if (
      userData &&
      !error &&
      page != "unauthorized" &&
      !isUserAuthrized(userData)
    ) {
      navigate("/unauthorized", { replace: true });
    } else if (
      userData &&
      !error &&
      page == "unauthorized" &&
      isUserAuthrized(userData)
    ) {
      navigate("/", { replace: true });
    }
  }, [userData, error, navigate, page, isLoading]);

  // Don't render children if still loading or navigating
  if (isLoading) return null;
  // Special case for server error page
  if (page === "serverError") {
    return !userData && error ? children : null;
  }

  return userData && !error && isUserAuthrized(userData) ? children : null;
}

//heiger order function to protect UN-public pages with permission
export function WithPermission({ children, page }) {
  const { data: userData, isLoading, error } = useFetchCurrentUserQuery();

  const navigate = useNavigate();

  useEffect(() => {
    if (isLoading) return; // avoid firing redirect too early

    if (
      userData &&
      !error &&
      page != "unauthorized" &&
      !isUserAuthrized(userData)
    ) {
      navigate("/unauthorized", { replace: true });
    } else if (userData && !error && isUserAuthrized(userData)) {
      page == "unauthorized"
        ? navigate("/", { replace: true })
        : !canAccessPage(userData, page)
          ? navigate("/unauthorized", { replace: true })
          : null;
    }
  }, [userData, error, navigate, page, isLoading]);

  // Don't render children if still loading or navigating
  if (isLoading) return null;
  // Special case for unauthorized page
  if (page === "unauthorized") {
    return userData &&
      !error &&
      !isUserAuthrized(userData) &&
      !canAccessPage(userData, page)
      ? children
      : null;
  }
  return userData &&
    !error &&
    isUserAuthrized(userData) &&
    canAccessPage(userData, page)
    ? children
    : null;
}
