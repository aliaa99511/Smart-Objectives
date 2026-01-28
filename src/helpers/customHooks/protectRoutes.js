import { useNavigate } from "react-router-dom";
import { useEffect, useRef } from "react";
import { canAccessPage } from "../utilities/permissinUtilities/canAccessPage";
import { isUserAuthrized } from "../utilities/permissinUtilities/isUserAuthrized";
import { useFetchCurrentUserQuery } from "../../appState/apis/userApiSlice";

// Higher order function to protect UN-public pages like root layout which includes all the pages
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

export function WithPermission({ children, page }) {
  const { data: userData, isLoading, error } = useFetchCurrentUserQuery();
  const navigate = useNavigate();
  const hasRedirected = useRef(false);

  useEffect(() => {
    if (isLoading) return;
    if (hasRedirected.current) return;

    // If there's an error fetching user data
    if (error && !userData) {
      navigate("/serverError", { replace: true });
      hasRedirected.current = true;
      return;
    }

    // If we have user data
    if (userData && !error) {
      // Check if user is authorized
      const isAuthorized = isUserAuthrized(userData);

      // If user is not authorized and not on unauthorized page
      if (!isAuthorized && page !== "unauthorized") {
        navigate("/unauthorized", { replace: true });
        hasRedirected.current = true;
        return;
      }

      // If user is authorized
      if (isAuthorized) {
        // Redirect from unauthorized page
        if (page === "unauthorized") {
          navigate("/", { replace: true });
          hasRedirected.current = true;
          return;
        }

        // SPECIAL HANDLING FOR MYOBJECTIVES
        // CEO should not have access to myObjectives
        if (page === "myObjectives" && userData?.roles?.includes("CEO")) {
          navigate("/ceo/dashboard", { replace: true });
          hasRedirected.current = true;
          return;
        }

        // Check page access for all users
        if (!canAccessPage(userData, page)) {
          navigate("/unauthorized", { replace: true });
          hasRedirected.current = true;
          return;
        }
      }
    }
  }, [userData, error, navigate, page, isLoading]);

  // Don't render children if still loading or navigating
  if (isLoading) return null;

  // Special case for unauthorized page
  if (page === "unauthorized") {
    return userData && !error && !isUserAuthrized(userData) ? children : null;
  }

  // For all pages, check all conditions
  return userData &&
    !error &&
    isUserAuthrized(userData) &&
    canAccessPage(userData, page)
    ? children
    : null;
}

// Default export
export default WithPermission;