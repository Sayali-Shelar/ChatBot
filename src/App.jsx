// import React from 'react'
// import { useState } from 'react'

// const App = () => {
//   const [questions, setQuestions] = useState('')

//   const API_KEY ="AIzaSyAYa2Z4IoXfQblsyRCoXmyhNoULbB6POFU"
   
//   const payload = {
//     "contents": [
//       {
//         "parts": [
//           {
//             "text": "Explain how AI works in a few words"
//           }
//         ]
//       }
//     ]
//   }             


//   const askQuestion = async () => {
//     let response = await fetch(URL,{
//       method: "POST",
//       body: JSON.stringify(payload),
//     })
//     response = await response.json()
//     console.log(response)
//   }

//   return (
//     <div className='grid grid-cols-5'>
//       <div className='col-span-1 bg-zinc-800 h-screen text-center text-white text-2xl font-bold py-4'>

//       </div>



//       <div className='col-span-4 p-10'>
//         <div className='container h-120'></div>
//         <div className='bg-zinc-800 w-1/2 h-16 text-white p-1 pr-5 m-auto rounded-4xl border border-zinc-700 flex'>
//           <input type="text" value={questions} onChange={(e) => setQuestions(e.target.value)} className=' h-full w-full outline-none rounded-lg  text-white px-4' placeholder='Ask anything' />
//           <button onClick={askQuestion}>Ask</button>
//         </div>

//       </div>

//     </div>
//   )
// }
// export default App

import React, { useState } from 'react'
import Answers from './components/Answers'

const App = () => {
  const [questions, setQuestions] = useState('')
  const [answer, setAnswer] = useState([])
  const [recentHistory, setRecentHistory] = useState([])

  const API_KEY = "AIzaSyCbx2VvdFYNIr0oAEwWzdoIQXw83mrVDDc"

  const askQuestion = async () => {
    if(localStorage.getItem('history')){
      let history = JSON.parse(localStorage.getItem('history'));
      history = [questions,...history]
      localStorage.setItem('history',JSON.stringify(history)) 
      // setRecentHistory(history)
    }
    else{
      localStorage.setItem("history",JSON.stringify([questions]))
      // setRecentHistory([questions])
    }
    const URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent?key=${API_KEY}`

    const payload = {
      contents: [
        {
          parts: [
            {
              text: questions   // user input
            }
          ]
        }
      ]
    }

    try {
      let response = await fetch(URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload),
      })

      const data = await response.json()
      

      let text = data.candidates?.[0]?.content?.parts?.[0]?.text
      text=text.split("* ");
      text=text.map((item)=>item.trim());
      // text=text.join("\n- ");
      console.log(text)
      setAnswer([...answer,{type:"question", text: questions}, {type:"answer", text: text}])
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <div className='grid grid-cols-5'>
      <div className='col-span-1 bg-zinc-800 h-screen'></div>

      <div className='col-span-4 p-10'>
        <div className='container h-120 mb-6 overflow-scroll'>
          <div className='text-zinc-300'>
            <ul>
            {
              answer.map((item, index) => (
                <div key={index+Math.random()} className={item.type=="question"? "flex justify-end":""}>
                  {
                item.type === "question" ? 
                <li key={index+Math.random()} className='p-1 text-right border-5 bg-zinc-700 border-zinc-700 rounded-tl-3xl rounded-br-3xl rounded-bl-3xl w-fit'>
                  <Answers ans={item.text} totalResult={1} index={index} type={item.type}/>
                </li>
                : item.text.map((textItem, textIndex) => (
                  <li key={textIndex+Math.random()} className='p-1'><Answers ans={textItem} totalResult={item.length} index={textIndex}/></li>
                ))
              }
                </div>
              ))
            }
            </ul>
            {/* <ul>
              
              {
                answer && answer.map((item,index)=>(
                  <li key={index+Math.random()} className='p-1'><Answers ans={item} totalResult={answer.length} index={index}/></li>
                ))
              }
              </ul> */}
           
          </div>
          
        </div>

        <div className='bg-zinc-800 w-1/2 h-16 text-white p-1 pr-5 m-auto rounded-3xl border border-zinc-700 flex'>
          <input
            type="text"
            value={questions}
            onChange={(e) => setQuestions(e.target.value)}
            className='h-full w-full outline-none text-white px-4 bg-transparent'
            placeholder='Ask anything'
          />
          <button
            onClick={askQuestion}
            className='px-4 bg-blue-600 rounded-xl'
          >
            Ask
          </button>
        </div>
      </div>
    </div>
  )
}

export default App
