export const getAcecessToken = (): boolean => {
    const savedUserData = localStorage.getItem("userData")

  console.log("AccessToken");
  if (savedUserData) {
    console.log(savedUserData)
    return true;
  } else {
    return false;
  }
};
