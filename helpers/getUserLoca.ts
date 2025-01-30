export function getUserLocal() {
  const user = localStorage.getItem("user");
  if (!user) return null;
  return JSON.parse(user);
}
