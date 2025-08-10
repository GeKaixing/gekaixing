```
import React, { useLayoutEffect, useEffect, useMemo, useCallback, useState, useRef, useContext, useReducer, useId, createContext } from 'react'
//react 19的新功能
import { useTransition } from 'react';
import Head from './head';
export const test = createContext(0);
export default function App() {

    console.log("app")
    console.log('1' + 1)
    useLayoutEffect(() => {
        console.log("useLayoutEffect")
    }, [])
    useEffect(() => {
        console.log("useEffect")
    }, [])
    useMemo(() => { console.log("useMemo") }, [])
    useCallback(() => { console.log("useCallback") }, [])
    const [value, setValue] = useState(0)
    const ref = useRef(1)
    const use = useContext(1)

    const dd = useReducer()
    const id = useId()

    const [ispending, startTransition] = useTransition()
    const handleSubmit = () => {

        fetch('http://127.0.0.1:4000/modifyingbirthday', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(
           {     data: { 
                    birthday: "12/06",
                    id: '66a9045019b4500106be7218'
                }}
            )
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            console.log('成功:', data);
            // 更新页面或其他操作
        })
        .catch(error => {
            console.error('错误:', error);
            // 处理错误，比如显示错误信息
        });

    }

    return (
        <div value={test}>
            <Head></Head>
            <button onClick={handleSubmit}>按钮</button>
        </div>
    )
}

```
