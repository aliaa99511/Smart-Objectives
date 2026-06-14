import { useEffect, useCallback } from "react";

/**
 * Custom hook to save and restore scroll position
 */
const useScrollRestoration = (
    pageKey,
    shouldRestore = true
) => {

    // Save current scroll position
    const saveScrollPosition = useCallback(() => {
        const scrollPosition =
            window.scrollY || window.pageYOffset;

        sessionStorage.setItem(
            `scrollPosition_${pageKey}`,
            scrollPosition.toString()
        );
    }, [pageKey]);

    // Restore scroll position
    useEffect(() => {
        if (!shouldRestore) return;

        const savedEmployeeId = sessionStorage.getItem(
            `selectedEmployee_${pageKey}`
        );

        const savedPosition = sessionStorage.getItem(
            `scrollPosition_${pageKey}`
        );

        const restoreScroll = () => {

            // Restore exact employee card
            if (savedEmployeeId) {
                const employeeElement = document.getElementById(
                    `employee-${savedEmployeeId}`
                );

                if (employeeElement) {
                    employeeElement.scrollIntoView({
                        behavior: "instant",
                        block: "center",
                    });

                    sessionStorage.removeItem(
                        `selectedEmployee_${pageKey}`
                    );

                    sessionStorage.removeItem(
                        `scrollPosition_${pageKey}`
                    );

                    return;
                }
            }

            // Fallback to normal scroll
            if (savedPosition) {
                window.scrollTo({
                    top: parseInt(savedPosition),
                    behavior: "instant",
                });

                sessionStorage.removeItem(
                    `scrollPosition_${pageKey}`
                );
            }
        };

        // Wait until DOM fully rendered
        const timeout = setTimeout(() => {
            restoreScroll();
        }, 300);

        return () => clearTimeout(timeout);

    }, [shouldRestore, pageKey]);

    // Save before unload
    useEffect(() => {
        const handleBeforeUnload = () => {
            saveScrollPosition();
        };

        window.addEventListener(
            "beforeunload",
            handleBeforeUnload
        );

        return () => {
            saveScrollPosition();

            window.removeEventListener(
                "beforeunload",
                handleBeforeUnload
            );
        };
    }, [saveScrollPosition]);

    return { saveScrollPosition };
};

export default useScrollRestoration;