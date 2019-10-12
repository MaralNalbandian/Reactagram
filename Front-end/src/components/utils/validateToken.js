export default async function validateUserIdToken(){
    const obj = JSON.parse(localStorage.getItem("the_main_app"));
    if (obj && obj.userIdToken) {
        if (obj.userIdToken) {
            //Verify token
            const res = await fetch(process.env.REACT_APP_BACKEND_WEB_ADDRESS + "/api/user/verify?userIdToken=" + obj.userIdToken)
            const resJson = await res.json()
            if (resJson.result === "Success") {
                return true
            } else {
                return false
            }
        };
    } else {
        return false
    }
    return false
}