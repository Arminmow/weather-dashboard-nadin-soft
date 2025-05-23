  const getDesignTokens = (mode: "light" | "dark") => ({
    palette: {
      mode,
      surface: {
        main: mode === "light" ? "#F3FAFE" : "#151D32",
        card: mode === "light" ? "#E1E9EE" : "#292F45",
        item: mode === "light" ? "#CDD9E0" : "#3F4861",
      },
      text: {
        primary: mode === "light" ? "#003464" : "#F3F4F7",
      },
    },
  });

  export default getDesignTokens;
