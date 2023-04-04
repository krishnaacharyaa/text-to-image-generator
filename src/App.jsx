import { useEffect, useRef, useState } from "react";
import { Progress } from "@material-tailwind/react";
import "./App.css";
const randomPromptsAndResults = [
	{
		"Dog riding car": [
			"https://th.bing.com/th/id/OIG.FVTof5vie10AnHVKe3o2?pid=ImgGn",
			"https://th.bing.com/th/id/OIG.W1Zl_BEh1pecE52Jdc1x?pid=ImgGn",
			"://th.bing.com/th/id/OIG.84rMcYHaHt6.8nkw.Y04?pid=ImgGn",
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

const getPrediction = (prompt, intervalId, randomValue = 4) => {
	return new Promise((resolve) => {
		setTimeout(() => {
			clearInterval(intervalId);
			resolve({
				status: "succeeded",
				// result: [
				// 	"https://picsum.photos/id/1015/200/300",
				// 	"https://picsum.photos/id/1016/200/300",
				// 	"https://picsum.photos/id/1018/200/300",
				// 	"https://picsum.photos/id/1019/200/300",
				// ],
				result: randomPromptsAndResults[randomValue][prompt],
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
	const [intervalId, setIntervalId] = useState(null);
	const [progress, setProgress] = useState(0);
	const [fetched, setFecthed] = useState(false);
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
		setProgress(0);
		setIntervalId(
			setInterval(() => {
				setProgress((progress) => progress + 1);
			}, Math.round(10000 / 100))
		);
		if (progress === 100) {
			clearInterval(intervalId);
			setProgress(0);
		}

		// Call the API and get the response
		const response = await getPrediction(prompt, intervalId);

		// Extract the images array from the response and set it in the state
		const { result } = response;
		setImages(result);
	};

	const handleRandom = async (e) => {
		setProgress(0);
		setIntervalId(
			setInterval(() => {
				setProgress((progress) => progress + 1);
			}, Math.round(10000 / 100))
		);
		if (progress === 100) {
			clearInterval(intervalId);
			setProgress(0);
		}
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
				prompt = Object.keys(randomPromptsAndResults[2])[0];
				getPrediction(prompt);
		}
		setPrompt(prompt);
		response = await getPrediction(prompt, intervalId, randomIndex);
		const { result } = response;
		setImages(result);
	};
	return (
		<div>
			<label>
				Enter Prompt:
				<input
					type="text"
					value={prompt}
					onChange={(e) => setPrompt(e.target.value)}
				/>
			</label>
			<button onClick={handleSubmit}>Submit</button>
			<button onClick={handleRandom} type="submit">
				Random
			</button>
			<div>{progress > 0 && `Completed ${progress}%`}</div>
			{/* {progress > 0 && progress <= 100 && (
				<Progress value={progress} color="green" className="h-5" />
			)} */}
			<div className="grid grid-cols-2 gap-4">
				{images.map((image, index) => (
					<img key={index} src={image} alt={`Image ${index}`} />
				))}
			</div>
		</div>
	);
	// const [mytime, setMytime] = useState(0);

	// useEffect(() => {
	// 	// create a interval and get the id
	// 	const myInterval = setInterval(() => {
	// 		setMytime((prevTime) => prevTime + 1);
	// 	}, 1000);
	// 	// clear out the interval using the id when unmounting the component
	// 	return () => clearInterval(myInterval);
	// }, []);
	// useEffect(()=>{
	// 	if(mytime>=10){
	// 		clearInterval()
	// 	}
	// },[mytime])

	// return <div> {mytime} </div>;

	// const [time, setTime] = useState(0);
	// const currentTimer = useRef();
	// useEffect(() => {
	// 	return () => clearInterval(currentTimer.current);
	// }, []);
	// const startTimer = () => {
	// 	currentTimer.current = setInterval(() => {
	// 		setTime((prev) => prev + 1);
	// 	}, 1000);
	// };
	// const stopTimer = () => {
	// 	clearInterval(currentTimer.current);
	// };
	// const resetTimer = () => {
	// 	clearInterval(currentTimer.current);
	// 	setTime(0);
	// };
	// return (
	// 	<div>
	// 		<div>{time}</div>
	// 		<button onClick={startTimer}>Start</button>
	// 		<button onClick={stopTimer}>Stop</button>
	// 		<button onClick={resetTimer}>Reset</button>
	// 	</div>
	// );
}

export default App;

{
	/* <div class="flex min-h-screen w-full flex-col object-contain">
  <div class="relative h-96 w-full">
    <div class="absolute h-full w-full bg-[url('https://static.fotor.com/app/features/img/aiimage/background_image3.jpg')] bg-cover object-cover"></div>
    <div class="extra absolute flex h-full  w-full flex-col items-center justify-center bg-gradient-to-tr from-yellow-300 to-green-400 bg-clip-text text-4xl  md:text-7xl font-bold text-transparent">
      Text to Image with <br />
      <hr />
      AI Image Generator
    </div>
    <div class="absolute bottom-0 flex flex-col md:flex-row  w-full gap-2 bg-transparent px-8 md:py-8 md:px-28">
      <input class="flex-1 rounded-lg border md:px-3 w-full p-2 md:p-0 " type="text" placeholder="Describe what you want to see, Confused what to type ? select Suprise Me" />
      <div class="flex gap-2 justify-center items-center">
      <button class="rounded-lg bg-green-400 p-2">Generate</button>
      <button class="rounded-lg border border-green-400 p-2 text-green-400">Suprise Me</button>
      </div>
    </div>
  </div>
<div class="hidden h-96 md:flex flex-col justify-start items-start md:px-28 px-8 py-8 bg-gradient-to-b from-[#2e1216] bg-black w-full ">
  <div class="flex flex-col md:flex-row rounded-lg md:h-72 md:w-full ">
  <img class="  md:h-72 md:w-72 " src="https://prompthero.com/rails/active_storage/representations/proxy/eyJfcmFpbHMiOnsibWVzc2FnZSI6IkJBaEpJaWxrTW1VNU5qbGlNeTAwTmpjd0xUUmxNR0l0WVdObE1TMWlPRGd6TWpjeE5UZ3dNV01HT2daRlZBPT0iLCJleHAiOm51bGwsInB1ciI6ImJsb2JfaWQifX0=--ad0bcee01c9058ba4e7600a742f27eae29eaab52/eyJfcmFpbHMiOnsibWVzc2FnZSI6IkJBaDdDRG9MWm05eWJXRjBPZ2wzWldKd09oUnlaWE5wZW1WZmRHOWZiR2x0YVhSYkIya0NBQVJwQWdBRU9ncHpZWFpsY25zSk9oTnpkV0p6WVcxd2JHVmZiVzlrWlVraUIyOXVCam9HUlZRNkNuTjBjbWx3VkRvT2FXNTBaWEpzWVdObFZEb01jWFZoYkdsMGVXbEIiLCJleHAiOm51bGwsInB1ciI6InZhcmlhdGlvbiJ9fQ==--f753885922b37d6e6788eb7c04f7caf6e86de707/prompthero-prompt-51727938965.png"></img>
  <div class="bg-gray-400 bg-opacity-40 flex-1 flex flex-col p-8">
    <div class="text-white text-xl md:text-2xl font-extrabold mb-4" >Pro Tip 💡</div>
    <div class="text-white md:text-xl mb-8 font-semibold">Get crazy with your prompt</div>
    <div class="text-white text-xl md:text-2xl">Try: "An astronaut resting on mars in a beach chair, vibrant lighting, elegant, highly detailed, smooth, sharp focus, illustration, beautiful, geometric"</div>
  </div>
  
  </div>
 <div class="text-white">Your image is being created by AI</div> 
</div>
  <div class=" py-8 text-center text-2xl text-white bg-black">Featured Gallery</div>
  <div class="flex md:flex-row flex-col justify-evenly gap-4 bg-black md:px-28 py-4">
    <div class="relative h-full md:w-1/3 px-8 md:px-0">
      <img src="https://th.bing.com/th/id/OIG.lQW2ATPf8sWgXG4Dl7dT?pid=ImgGn" alt="Your Image" class="h-72 w-full rounded-lg" />
      <div class="absolute inset-x-0 bottom-0 bg-black bg-opacity-50 p-4">
        <h2 class="font-bold text-white">Panda bear baking a cake in a sunny kitchen, digital art</h2>
      </div>
    </div>
    <div class="relative h-full md:w-1/3 px-8 md:px-0">
      <img src="https://www.greataiprompts.com/wp-content/uploads/2023/01/4268126f-9359-4a75-859a-3977946214ae-683x1024.jpg.webp" alt="Your Image" class="h-72 w-full  rounded-lg object-cover" />

      <div class="absolute inset-x-0 bottom-0 bg-black bg-opacity-50 p-4">
        <h2 class="font-bold text-white">Portrait of a beutiful young woman of 18 age</h2>
      </div>
    </div>
    <div class="relative h-full md:w-1/3 px-8 md:px-0">
      <img src="https://th.bing.com/th/id/OIG.WMtTCbVcZ7AzNjn1tVwW?pid=ImgGn" alt="Your Image" class="h-72 w-full rounded-lg" />
      <div class="absolute inset-x-0 bottom-0 bg-black bg-opacity-50 p-4">
        <h2 class="font-bold text-white">Renaissance painting of an elephant in a tuxedo</h2>
      </div>
    </div>
  </div>
</div> */
	// https://play.tailwindcss.com/GKik5xrUIg
}
