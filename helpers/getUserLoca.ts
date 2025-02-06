export function getUserLocal() {
  const user = localStorage.getItem("user");
  if (!user) {
    window.localStorage.clear();
    window.localStorage.setItem("unauthorized", "true");
    window.location.href = "/auth";
    //toast.error("Unauthorized! Required Login.");
    return null;
  }
  return JSON.parse(user);
}
