export default async function validateUserIdToken(){
    const obj = JSON.parse(localStorage.getItem("the_main_app"));
    if (obj && obj.userIdToken) {
        const { userIdToken } = obj;
        if (userIdToken) {
            //Verify token
            const res = await fetch("http://localhost:80/api/user/verify?userIdToken=" + userIdToken)
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