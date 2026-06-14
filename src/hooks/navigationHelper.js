/**
 * Save scroll position and navigate to a new page
 * @param {string} pageKey - Current page identifier
 * @param {function} navigateFunction - React Router navigate function
 * @param {string} path - Target path
 * @param {object} options - Navigation options (state, etc.)
 */
export const savePositionAndNavigate = (
    pageKey,
    navigateFunction,
    path,
    options = {},
    selectedEmployeeId = null
) => {
    // Save current scroll position
    const scrollPosition = window.scrollY || window.pageYOffset;

    sessionStorage.setItem(
        `scrollPosition_${pageKey}`,
        scrollPosition.toString()
    );

    // Save selected employee id
    if (selectedEmployeeId) {
        sessionStorage.setItem(
            `selectedEmployee_${pageKey}`,
            selectedEmployeeId.toString()
        );
    }

    // Navigate
    navigateFunction(path, options);
};

/**
 * Get the common navigation paths used across the app
 */
export const getNavigationPaths = (departmentId, departmentTitle) => ({
    myCompany: "/myCompany",
    myCompanyDepartment: `/myCompany?selectedDepartmentId=${departmentId}`,
    currentObjectives: `/myCompany/currentObjectives?departmentId=${departmentId}&departmentTitle=${encodeURIComponent(
        departmentTitle
    )}`,
    quarterLog: `/myCompany/quarterLog?departmentId=${departmentId}&departmentTitle=${encodeURIComponent(
        departmentTitle
    )}`,
    certificate: `/myCompany/certificateWithHr?departmentId=${departmentId}&departmentTitle=${encodeURIComponent(
        departmentTitle
    )}`,
    achievements: `/myCompany/achievementsWithHr?departmentId=${departmentId}&departmentTitle=${encodeURIComponent(
        departmentTitle
    )}`,
});