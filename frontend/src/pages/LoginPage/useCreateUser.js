import resolveUrl from "../../utils/resolveUrl";



const useCreateUser = () => {
	const CreateUser = async (Email, Name, Password) => {
		try{
			const response = await fetch(resolveUrl("/api/user/CreateUser"), {
				method: "POST",
				headers: {"Content-Type":"application/json"},
				body: JSON.stringify({ Email: Email,
					Name: Name,
					Password: Password})});

			if (!response.ok) {
				console.error("Failed to create user: ", response.status);
			}
		}
		catch(error){
			console.error(error);
		}
	};
	return {CreateUser};
};

export default useCreateUser;