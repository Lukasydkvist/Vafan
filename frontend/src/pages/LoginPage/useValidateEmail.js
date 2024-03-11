import resolveUrl from "../../utils/resolveUrl";


const useValidateEmail = () => {
	console.log("useValidateEmail called");
	const ValidateEmail = async (Email) => {
		try{
			
			const response = await fetch(resolveUrl("/api/user/ValidateEmail"), {
				method: "POST",
				headers: {"Content-Type":"application/json"},
				body: JSON.stringify({ Email: Email })
			});


			console.log("response.ok: ", response.ok);
			return response.ok
		}
		catch(error){
			console.error(error);
			return false;
		}
	};
	return {ValidateEmail};
};

export default useValidateEmail;