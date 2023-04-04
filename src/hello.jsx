import { Progress } from "@material-tailwind/react";

function Hello() {
	return (
		<div>
			<div className="text-red-500">Hello</div>
			<Progress
				value={40}
				color="green"
				variant="gradient"
				className="bg-black"
			/>
		</div>
	);
}
export default Hello;
