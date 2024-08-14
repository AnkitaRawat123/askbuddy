import { createContext, useState } from "react";
import run from "../config/askbuddy";

export const Context = createContext();

const ContextProvider =(props)=>{
    const [input,setInput]= useState("");
    const [recentPrompt,setRecentPrompt]=useState("");
    const [prevPrompts,setPreviousPrompts]= useState([]);
    const [showResult,setShowResult]= useState(false);
    const [loading,setLoading]= useState(false);
    const [resultData,setResultData]= useState("");


    const delayPara = (index, nextWord) => {
        setTimeout(function () {
            setResultData(prev => {
                const updated = prev + nextWord;
                console.log('Updated resultData:', updated);
                return updated;
            });
        }, 75 * index);
    };
    const newChat=()=>{
        setLoading(false)
        setShowResult(false)
    }

    const onSent = async (prompt) => {
        let newResponse = '';
        try {
            setLoading(true);
            setShowResult(true);
    
            // Reset resultData before processing new response
            setResultData('');
    
            let response;
            console.log("Received prompt:", prompt || input);  // Debugging log
    
            if (prompt !== undefined) {
                response = await run(prompt);
                setRecentPrompt(prompt);
            } else {
                setPreviousPrompts(prev => [...prev, input]);
                setRecentPrompt(input);
                response = await run(input);
            }
    
            console.log("Response from run function:", response);  // Debugging log
    
            if (response && typeof response === 'string') {
                const responseArray = response.split("**");
    
                for (let i = 0; i < responseArray.length; i++) {
                    if (i % 2 === 0) {
                        newResponse += responseArray[i];
                    } else {
                        newResponse += "<b>" + responseArray[i] + "</b>";
                    }
                }
                let newResponse2 = newResponse.split("*").join("</br>");
                let newResponseArray = newResponse2.split(" ");
    
                for (let i = 0; i < newResponseArray.length; i++) {
                    const nextWord = newResponseArray[i];
                    delayPara(i, nextWord + " ");
                }
            } else {
                setResultData("Sorry, I couldn't process your request. Please try again.");
            }
    
        } catch (error) {
            console.error("Error in onSent function:", error);
            setResultData("An error occurred while processing your request. Please try again later.");
        } finally {
            setLoading(false);
            setInput(""); // Clear input after processing
        }
    };
    
    const contextValue={
        prevPrompts,
        setPreviousPrompts,
        onSent,
        setRecentPrompt,
        recentPrompt,
        showResult,
        loading,
        resultData,
        input,
        setInput,
        newChat
        
    }

    return (
        <Context.Provider value={contextValue}>
            {props.children}
        </Context.Provider>
    )
}
export default ContextProvider