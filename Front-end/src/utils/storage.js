//This function returns a key (token) to check if user is logged in
export function getFromStorage(key) {
  if (!key) {
    return null;
  }
  try {
    const valueStr = localStorage.getItem(key);
    if (valueStr) {
      return JSON.parse(valueStr);
    }
    return null;
  } catch (err) {
    return null;
  }
}

//Store key (token) in localStorage
export function setInStorage(key, obj) {
  if (!key) {
    console.error("Error: Key is missing");
  }
  try {
    localStorage.setItem(key, JSON.stringify(obj));
  } catch (err) {
    console.error(err);
  }
}
