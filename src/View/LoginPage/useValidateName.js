

const useValidateName = () => {
	const ValidateName = async (Name) => {
		try{
			const response = await fetch("/api/user/ValidateName", {method: "POST",
				headers: {"Content-Type":"application/json"},
				body: JSON.stringify({ Name: Name})});
			if(response.ok){
				return false;
			}
			else{
				return true;
			}
		}
		catch(error){
			console.error(error);
			return false;
		}
	};
	return {ValidateName};
};

export default useValidateName;