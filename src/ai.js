const { GoogleGenerativeAI } = require("@google/generative-ai");
const dotenv = require("dotenv");
dotenv.config();
const readline = require("readline")
// Access your API key as an environment variable (see "Set up your API key" above)
const genAI = new GoogleGenerativeAI(process.env.API_KEY);
const userInterface = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});
userInterface.prompt();

// userInterface.on("line", async input =>{
//     const model = genAI.getGenerativeModel({ model: "gemini-pro"});
  
//     const result = await model.generateContentStream([input]);
//     for await(const chunk of result.stream)
//     {
//         const chunkText = chunk.text();
//         console.log(chunkText);
//     }
// });

async function gemini(input){
  const model = genAI.getGenerativeModel({ model: "gemini-pro"});


  // const result = await model.generateContent(input);
  // const response = await result.response;
  // console.log(response);
  // console.log(response.content);
  // const text = response.text();
  // return text;
  const result = await model.generateContent(input);
    const response = await result.response;

    // Call the `text` function to obtain the actual text content
    const text = await response.text();
   // console.log(text);
    return text;

};
module.exports= gemini;
