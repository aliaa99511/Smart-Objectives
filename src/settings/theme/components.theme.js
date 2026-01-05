export const components = {
  MuiButton: {
    styleOverrides: {
      root: {
        borderRadius: 8,
        width: "150px", // Fixed width for all buttons
        height: "44px", // Fixed height for all buttons
        variants: [
          {
            props: { variant: "contained" },
            style: {
              backgroundColor: "#705CCF !important",
              boxShadow: "none !important",
              color: "#fff !important",
              textTransform: "capitalize",
            },
          },
          {
            props: { variant: "containedLight" },
            style: {
              backgroundColor: "#f4f1fd !important",
              fontSize: "12px !important",
              boxShadow: "none !important",
              color: "#705ccf !important",
              textTransform: "capitalize",
            },
          },
          {
            props: { variant: "outlinedLight" },
            style: {
              backgroundColor: "#f4f1fd !important",
              fontSize: "12px !important",
              boxShadow: "none !important",
              color: "#705ccf !important",
              border: "1px solid #705ccf !important",
              textTransform: "capitalize",
            },
          },
          {
            props: { variant: "outlined" },
            style: {
              textTransform: "capitalize",
            },
          },
        ],
        "&.Mui-disabled": {
          width: "150px",
          height: "44px",
          opacity: 0.7,
        },
      },
    },
  },
  MuiGrid2: {
    styleOverrides: {
      root: {
        "--Grid-columnSpacing": "10px",
        "--Grid-rowSpacing": "10px",
        "--Grid-parent-columnSpacing": "10px",
      },
    },
  },
};
