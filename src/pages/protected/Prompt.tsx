import { WandSparkles } from "lucide-react";
import { RootLayout } from "../../components/Layouts";

const Prompt = () => {
  return (
    <RootLayout className="justify-center items-center flex bg-mainBg">
      <div className="relative z-10 px-5">
        <h2 className="font-fredoka font-medium text-4xl sm:text-5xl text-center text-primaryDark mb-1">TrendBits</h2>
        <h1 className="text-center mb-3 text-sm sm:text-xl font-medium text-gray-700">What is trending on your mind?</h1>

        <div className="w-auto md:w-[560px] bg-mainBg shadow-md rounded-xl border border-primary">
          <div className="bg-transparent flex flex-col p-4 rounded-lg gap-2">
            <textarea
              id="prompt"
              className="outline-none border-none w-full bg-transparent sm:text-base text-sm text-gray-800 py-1 font-poppins resize-none h-16"
              placeholder="Enter a trend or keyword (e.g., AI layoffs in 2025)"
            />

            <div className="flex ml-auto items-center gap-2">
              <button className="text-sm transition-all px-3 py-2 bg-primaryDark text-white hover:bg-primary rounded-md flex items-center font-medium">
                <WandSparkles size={18} className="mr-2" /> Search
              </button>
            </div>
          </div>
        </div>

        <p className="text-xs text-gray-500 mt-2 text-center font-poppins">
          🪄 <strong>Pro Tip:</strong> Try specific or buzzworthy trends (e.g., “AI layoffs in 2025”) to get sharper summaries.
        </p>
      </div>
    </RootLayout>
  );
};

export default Prompt;
