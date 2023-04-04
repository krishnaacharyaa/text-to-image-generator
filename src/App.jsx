import { useEffect, useRef, useState } from "react";
import { Progress } from "@material-tailwind/react";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const randomPromptsAndResults = [
	{
		"Dog riding car": [
			"https://th.bing.com/th/id/OIG.FVTof5vie10AnHVKe3o2?pid=ImgGn",
			"https://th.bing.com/th/id/OIG.W1Zl_BEh1pecE52Jdc1x?pid=ImgGn",
			"https://th.bing.com/th/id/OIG.84rMcYHaHt6.8nkw.Y04?pid=ImgGn",
			"https://th.bing.com/th/id/OIG.ODO.XaxJMc8_7AyZoCQL?pid=ImgGn",
		],
	},
	{
		"Beautiful girl painting art": [
			"https://th.bing.com/th/id/OIG.hvDyOStcmHoEU7_Agp8q?pid=ImgGn",
			"https://th.bing.com/th/id/OIG.Vk.PxVHqCAPgEwzHbBnF?pid=ImgGn",
			"https://th.bing.com/th/id/OIG.aV7iM5ckbyVguHs6NbB_?pid=ImgGn",
			"https://th.bing.com/th/id/OIG.DtWUYpwWeV1y2aFzhTcD?pid=ImgGn",
		],
	},
	{
		"Elephant using mobile phone": [
			"https://th.bing.com/th/id/OIG.tUikWFQHGDEgD2jzifJC?pid=ImgGn",
			"https://th.bing.com/th/id/OIG.br7ZPMf3JeYOWHHMjYp8?pid=ImgGn",
			"https://th.bing.com/th/id/OIG.Xf5KVYm0p0G6ijBbVv4G?pid=ImgGn",
			"https://th.bing.com/th/id/OIG.VDxvTXpL0zjKyNXPb_Av?pid=ImgGn",
		],
	},
	{
		"default prompt": [
			"https://th.bing.com/th/id/OIG.hm_Iy0E5VpDPc4yHn2LC?pid=ImgGn",
			"https://th.bing.com/th/id/OIG.3qvW2qmlqOqId6ksHETJ?pid=ImgGn",
			"https://th.bing.com/th/id/OIG.t3OiS4xjiJaHYyT3t3tk?pid=ImgGn",
			"https://th.bing.com/th/id/OIG.0UySDby6M5re9.TDiyU5?pid=ImgGn",
		],
	},
];

const getPrediction = (prompt, randomValue = 3) => {
	return new Promise((resolve) => {
		setTimeout(() => {
			let result = [];
			var present = null;
			present = randomPromptsAndResults.find((obj) =>
				obj.hasOwnProperty(prompt)
			);
			console.log(`present value ${present} `);
			if (present !== undefined) {
				console.log(`${present[prompt]}`);
			}
			if (randomPromptsAndResults[randomValue][prompt]) {
				result = randomPromptsAndResults[randomValue][prompt];
			} else if (present != null) {
				result = present[prompt];
			} else if (prompt.trim() != "" && prompt != undefined) {
				result = randomPromptsAndResults[3]["default prompt"];
			}
			console.log(result);
			resolve({
				status: "succeeded",
				result: result,
				metrics: {
					predict_time: 11.990901,
				},
			});
		}, 10000);
	});
};

function App() {
	const [prompt, setPrompt] = useState("");
	const [images, setImages] = useState([]);
	const [progress, setProgress] = useState(0);
	const currentProgress = useRef();

	useEffect(() => {
		return () => clearInterval(currentProgress.current);
	}, []);
	useEffect(() => {
		if (progress >= 100) {
			clearInterval(currentProgress.current);
			setProgress(0);
		}
	}, [progress]);
	const timer = () => {
		if (progress != 0) {
			clearInterval(currentProgress.current);
			setProgress(0);
		}
		currentProgress.current = setInterval(() => {
			setProgress((prev) => prev + 1);
		}, 100);
	};

	const handleSubmit = async (e) => {
		setImages([]);
		if (prompt.trim() === "" || prompt === null) {
			return toast.error("Prompt Cannot be empty");
		}
		timer();
		console.log(prompt);
		// setInProgress(true);

		const response = await getPrediction(prompt);

		const { result } = response;
		setImages(result);
	};

	const handleRandom = async (e) => {
		setImages([]);
		timer();
		let response;
		var prompt;
		const randomIndex = Math.floor(Math.random() * 3);
		switch (randomIndex) {
			case 0:
				prompt = Object.keys(randomPromptsAndResults[0])[0];
				break;
			case 1:
				prompt = Object.keys(randomPromptsAndResults[1])[0];
				break;
			case 2:
				prompt = Object.keys(randomPromptsAndResults[2])[0];
				break;
			default:
				prompt = Object.keys(randomPromptsAndResults[3])[0];
		}
		setPrompt(prompt);
		response = await getPrediction(prompt, randomIndex);
		const { result } = response;
		setImages(result);
	};
	return (
		<div className="flex min-h-screen w-full flex-col object-contain ">
			<div className="relative h-96 w-full">
				<div className="absolute h-full w-full bg-[url('https://static.fotor.com/app/features/img/aiimage/background_image3.jpg')] bg-cover object-cover"></div>
				<div className="extra absolute flex h-full  w-full flex-col items-center justify-center bg-gradient-to-tr from-yellow-300 to-green-400 bg-clip-text text-3xl md:text-5xl  lg:text-7xl font-bold text-transparent">
					Text to Image with <br />
					<hr />
					AI Image Generator
				</div>
				<div className="absolute bottom-0 flex flex-col md:flex-row  w-full gap-2 bg-transparent px-8 md:py-8 md:px-28">
					<input
						className="flex-1 rounded-lg border md:px-3 w-full p-2 md:p-0 "
						type="text"
						value={prompt}
						onChange={(e) => setPrompt(e.target.value)}
						placeholder="Describe what you want to see, Confused what to type ? select Suprise Me"
					/>
					<div className="flex gap-2 justify-center items-center disabled:bg-gray-400">
						<button
							className="rounded-lg bg-green-400 p-2"
							onClick={handleSubmit}
							disabled={progress > 0}
						>
							Generate
						</button>
						<button
							disabled={progress > 0}
							onClick={handleRandom}
							className="rounded-lg border border-green-400 p-2 text-green-400"
						>
							Suprise Me
						</button>
					</div>
				</div>
			</div>
			{images.length != 0 ? (
				<div className="grid grid-cols-2 gap-4  md:px-28 px-8 py-8 bg-gradient-to-b from-[#2e1216] bg-black w-full">
					{images.map((image, index) => (
						<img
							key={index}
							src={image}
							className={`h-48 ${index % 2 === 0 ? "ml-auto" : "mr-auto"}`}
							alt={`Image ${index}`}
						/>
					))}
				</div>
			) : (
				<div className="hidden h-96 md:flex flex-col justify-start items-start md:px-28 px-8 py-8  bg-gradient-to-b from-[#2e1216] bg-black w-full ">
					<div className="flex flex-col md:flex-row rounded-lg md:h-72 md:w-full ">
						<img
							className="  md:h-72 md:w-72 "
							src="https://th.bing.com/th/id/OIP.TwiIfaePJW6nAT1P4dp_cgHaHa?pid=ImgDet&rs=1"
						></img>
						<div className="bg-gray-400 bg-opacity-40 flex-1 flex flex-col p-8">
							<div className="text-white text-xl md:text-2xl font-extrabold mb-4">
								Pro Tip 💡
							</div>
							<div className="text-white md:text-xl mb-8 font-semibold">
								Get crazy with your prompt
							</div>
							<div className="text-white text-xl md:text-2xl">
								Try: "An astronaut resting on mars in a beach chair, vibrant
								lighting, elegant, highly detailed, smooth, sharp focus,
								illustration, beautiful, geometric"
							</div>
						</div>
					</div>
					{progress && (
						// <Progress value={progress} color="green" variant="gradient" />
						<progress
							className="progress w-full progress-accent h-3"
							value={progress}
							max="100"
						></progress>
					)}
					<div className="text-white">Your image is being created by AI</div>
				</div>
			)}
			<div className=" py-8 text-center text-2xl text-white bg-black">
				Featured Gallery
			</div>
			<div className="flex md:flex-row flex-col justify-evenly gap-4 bg-black md:px-28 py-4">
				<div className="relative h-full md:w-1/3 px-8 md:px-0">
					<img
						src="https://th.bing.com/th/id/OIG.lQW2ATPf8sWgXG4Dl7dT?pid=ImgGn"
						alt="Your Image"
						className="h-72 w-full rounded-lg"
					/>
					<div className="absolute inset-x-0 bottom-0 bg-black bg-opacity-50 p-4">
						<h2 className="font-bold text-white">
							Panda bear baking a cake in a sunny kitchen, digital art
						</h2>
					</div>
				</div>
				<div className="relative h-full md:w-1/3 px-8 md:px-0">
					<img
						src="https://www.greataiprompts.com/wp-content/uploads/2023/01/4268126f-9359-4a75-859a-3977946214ae-683x1024.jpg.webp"
						alt="Your Image"
						className="h-72 w-full  rounded-lg object-cover"
					/>

					<div className="absolute inset-x-0 bottom-0 bg-black bg-opacity-50 p-4">
						<h2 className="font-bold text-white">
							Portrait of a beutiful young woman of 18 age
						</h2>
					</div>
				</div>
				<div className="relative h-full md:w-1/3 px-8 md:px-0">
					<img
						src="https://th.bing.com/th/id/OIG.WMtTCbVcZ7AzNjn1tVwW?pid=ImgGn"
						alt="Your Image"
						className="h-72 w-full rounded-lg"
					/>
					<div className="absolute inset-x-0 bottom-0 bg-black bg-opacity-50 p-4">
						<h2 className="font-bold text-white">
							Renaissance painting of an elephant in a tuxedo
						</h2>
					</div>
				</div>
			</div>
			<ToastContainer />
		</div>
	);
}

export default App;
